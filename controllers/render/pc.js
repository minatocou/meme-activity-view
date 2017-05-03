/**
 * Created by memebox on 16/9/6.
 */
'use strict';
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    http = require('http'),
    async = require('async'),
    Handlebars = require('hbs'),
    models = require('../../models'),
    path = require('path'),
    fs = require('fs'),
    Swag = require('swag'),
    env = process.env.NODE_ENV || "development",
    config = require('../../conf/config')[env],
    redis = require('../../redis/redis-client');

Swag.registerHelpers(Handlebars);

Handlebars.registerHelper("bgc",function(val){
    if(val){
        return "background:"+val;
    }else{
        return "background:'#ffffff'";
    }
});

Handlebars.registerHelper("link",function(val){
    if(val){
        return config.product+"/catalog/product/view/id/"+val;
    }else{
        return "javascript:void(0)";
    }
});


router.get('/' , function(req, res){
    res.send("home")
})
router.get('/forbidden' , function(req, res){
    res.send("forbidden")
})
router.get('/:urlkey', function(req, res){
    var urlkey = req.params.urlkey;
    var preview = req.query.preview;
    console.log("node env is " + env);
    redis.get('promotion:'+urlkey, function(err, result){
        if( result ){
            console.log("read from redis cache");
            res.send(result);
        }else{
            models.Canvas.findOne({
                where : {
                    url_key : urlkey
                }
            }).then(function (results) {
                if(results){
                    var status = results.state;
                    if(preview||(!preview&&status)){

                        var result = results.setting;

                        var mConfig = JSON.parse(result);
                        mConfig.status = status ? 1 : 0;
                        var fields=mConfig.field;

                        var callbacks=[];
                        for(let i=0;i<fields.length;i++){
                            let field=fields[i];
                            let categoryid=field.categoryid;
                            let skus=field.skus;
                            if(categoryid){
                                callbacks.push(function(callback){
                                    console.log( config.solr+'/global/search?categoryId='+categoryid );
                                    request(config.solr+'/global/search?pageSize=10000&categoryId='+categoryid, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            field.data=JSON.parse(body);
                                            callback(null, JSON.parse(body));

                                        }
                                    });
                                })
                            }else if(skus) {
                                callbacks.push(function (callback) {
                                    request(config.solr + '/global/search?pageSize=10000&sku=' + skus, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            field.data = JSON.parse(body);
                                            callback(null, JSON.parse(body));
                                        }
                                    });
                                });
                            }

                        }
                        async.parallel(callbacks,
                            function(err, results){
                                mConfig.field = fields;

                                console.log(mConfig);
                                mConfig.serverConfig = config;
                                fs.readFile(path.join(__dirname, '../../views/render/pc.html') , 'utf-8' , function(err , data){
                                    var contentTpl = Handlebars.compile(data);
                                    var html = contentTpl({config:mConfig});
                                    var key = 'promotion:'+mConfig.root.urlkey
                                    redis.set(key,html)
                                    redis.expire(key,600);

                                })
                                console.log("no redis cache");
                                res.render('render/pc',{config:mConfig});
                            }
                        );

                    }else{
                        res.redirect(config.product);

                    }


                }
                else{
                    res.send("活动不存在")
                }
            }).catch(function (err) {
                console.log(err);
                res.send("数据库查找urlkey出现异常")
            });

        }
    });




})

module.exports = router