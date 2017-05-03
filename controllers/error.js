/**
 * Created by memebox on 16/6/12.
 */
var express = require('express')
    , router = express.Router(),
    request = require('request');


router.get('/404', function (req, res) {
    res.render('/error/404');

}).get('/500', function (req, res) {
    res.render('/error/500');
})

module.exports = router