/*
* @Author: Derek Zhou
* @Date:   2017-02-13 15:41:22
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-14 16:31:54
*/

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    Handlebars = require('hbs'),
	models = require('../../models'),
    Swag = require('swag'),
    env = process.env.NODE_ENV || "development",
    config = require('../../conf/config')[env],
    hbsHelper = require('../../helper/helper')(Handlebars);

Swag.registerHelpers(Handlebars);

router.get('/:urlKey', function(req, res) {
    var urlKey = req.params.urlKey;
	var params = {};
    params.serverConfig = config;
    models.appdownload.findOne({
        where:{
            urlKey: urlKey
        }
    }).then(function (result){
        params.ios = result.dataValues.ios;
        params.android = result.dataValues.android;
        params.wechat = result.dataValues.wechat;
        res.render('app/download',{config:params});
    }).catch(function (error){
        console.log(error);
    })
})
module.exports = router
