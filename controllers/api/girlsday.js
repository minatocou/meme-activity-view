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

router.get('/girlsday/productlist', function (req, res) {

    models.girlsday.findAll({
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