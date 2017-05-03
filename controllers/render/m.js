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
    redis = require('../../redis/redis-client'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    _ = require('underscore'),
    mEvent = require('../event/mEvent'),
    hbsHelper = require('../../helper/helper')(Handlebars);

Swag.registerHelpers(Handlebars);

router.get('/', function (req, res) {
    res.send("home")
})
router.get('/forbidden', function (req, res) {
    res.send("forbidden")
})
router.get('/:urlkey', function (req, res) {
    var urlkey = req.params.urlkey;
    var preview = req.query.preview;
    console.log("node env is " + env);
    redis.get('activity:' + urlkey, function (err, result) {
        if (result && !config.missRedis) {
            console.log("read from redis cache");
            var $ = cheerio.load(result);
            $('body').attr("data-now", new Date().getTime());
            res.send($.html());
        } else {
            models.Canvas.findOne({
                where: {
                    url_key: urlkey
                }
            }).then(function (results) {
                if (results) {
                    var status = results.state;
                    if (preview || (!preview && status)) {

                        var result = results.setting;
                        var mConfig;
                        try {
                            mConfig = JSON.parse(result);
                        } catch (e) {
                            mConfig = {}
                            console.log(e); //error in the above string(in this case,yes)!
                        }

                        mConfig.status = status ? 1 : 0;
                        var fields = mConfig.field;

                        var callbacks = {};
                        for (let i = 0; i < fields.length; i++) {
                            let field = fields[i];
                            let categoryid = field.categoryid;
                            let skus = field.skus;
                            let type = field.type;
                            console.log(type,'here we are');
                            let grouponId = field.grouponId;
                            if (categoryid) {
                                callbacks[field.id]=(function (callback) {
                                    console.log(config.solr + '/global/search?categoryId=' + categoryid);
                                    console.log("ceshi::::",JSON.stringify(results));
                                    request(config.solr + '/global/search?pageSize=10000&categoryId=' + categoryid, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            try {
                                                field.data = JSON.parse(body);
                                            } catch (e) {
                                                field.data = {}
                                                console.log(e); //error in the above string(in this case,yes)!
                                            }

                                            callback(null, field.data);

                                        }
                                    });
                                })
                            } else if (skus) {
                                callbacks[field.id]=(function (callback) {
                                    request(config.solr + '/global/search?pageSize=10000&sku=' + skus, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            try {
                                                field.data = JSON.parse(body);
                                            } catch (e) {
                                                field.data = {}
                                                console.log(e); //error in the above string(in this case,yes)!
                                            }

                                            callback(null, field.data);
                                        }
                                    });
                                });
                            }
                            (function (type) {
                                let url = {
                                    presale: '/h5/presale/list' + (field.presaleNum ? ('?pageSize=' + field.presaleNum) : ('?pageSize=' + 0)),
                                    groupon: '/h5/newgroupon/list?activityId=' + grouponId + (field.grouponNum ? ('&pageSize=' + field.grouponNum) : ('&pageSize=' + 10000)),
                                    newcomer: '/h5/newcomer/list' + (field.newcomerNum ? ('?pageSize=' + field.newcomerNum) : ('?pageSize=' + 10000)),
                                    newcomercomment: '/h5/newcomer/list' + (field.newcomerNum ? ('?pageSize=' + field.newcomerNum) : ('?pageSize=' + 10000)),
                                    comment: '/h5/comment/sasTop100'
                                };
                                mEvent[type] &&  mEvent[type](field);
                                url[type] && (callbacks[field.id]=function (callback) {
                                    request(config.internalApi + url[type], function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            try {
                                                let data = JSON.parse(body);
                                                field.data = data.data;
                                                if(type==='comment'){
                                                    field.data.forEach(function(item){
                                                        item.date = moment(item.date).format('YYYY/MM/DD');
                                                    });
                                                }

                                            } catch (e) {
                                                field.data = {};
                                                console.log(e); //error in the above string(in this case,yes)!
                                            }
                                        }
                                        callback(null, field.data);
                                    });
                                });

                                if(type=='newcomercomment'){
                                    callbacks['commentList']=[field.id,function (r,callback) {
                                        var comment=r[field.id];
                                        if(comment){
                                            let list=comment.list;
                                            let productIds=_.pluck(list, 'productId');
                                            request(config.comment + '/Review/batchExcellentList?hasImg=0&productIds='+productIds.join(','), function (error, response, body) {
                                                if (!error && response.statusCode == 200 && body) {
                                                    try {
                                                        let data = JSON.parse(body);
                                                        list.map(function (v) {
                                                            if(data.data[v.productId]){
                                                                v.comment=data.data[v.productId];
                                                            }
                                                        });
                                                    } catch (e) {
                                                        field.comment = {};
                                                        console.log(e); //error in the above string(in this case,yes)!
                                                    }
                                                }
                                                callback && callback(null, field.comment);
                                            });
                                        }else{
                                            callback && callback(null,field.comment);
                                        }


                                    }]
                                }
                            })(type);
                        }
                        async.auto(callbacks,
                            function (err, results) {
                                mConfig.field = fields;
                                mConfig.serverConfig = config;
                                mConfig.root.now = new Date().getTime();
                                fs.readFile(path.join(__dirname, '../../views/render/m.html'), 'utf-8', function (err, data) {
                                    var contentTpl = Handlebars.compile(data);
                                    var html = contentTpl({config: mConfig});
                                    var key = 'activity:' + mConfig.root.urlkey;
                                    redis.set(key,html)
                                    redis.expire(key, config.cache);

                                })
                                // console.log("no redis cache");
                                //console.log(mConfig,'mconfig');
                                res.render('render/m', {config: mConfig});
                            }
                        );

                    } else {
                        res.redirect(config.mproduct);

                    }


                }else{
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
