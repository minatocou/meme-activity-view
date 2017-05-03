/*
 * @Author: Derek Zhou
 * @Date:   2016-12-14 17:38:11
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2016-12-27 16:46:00
 */
'use strict';
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    async = require('async'),
    env = process.env.NODE_ENV || "development",
    config = require('../../conf/config')[env],
    redis = require('../../redis/redis-client');

router.get('/wechat/reply', function (req, res) {

    models.wechatMsg.findAll({
    }).then(function (result) {
        res.json({
            code: 1,
            msg: '获取成功',
            data: result
        });
    }).catch(function (error) {
        console.log('错误', error);
    })
})


module.exports = router;
