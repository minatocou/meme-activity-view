var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);
var routes = require('./routes/router');
var hbs = require('hbs');
var log = require('./log');
var env    = process.env.NODE_ENV || "development";
var config = require('./conf/config')[env];
var app = express();

//记录日志
log.use(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', hbs.__express);
app.set('view engine', 'html');
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /static
app.use(favicon(path.join(__dirname, 'static/common/img', 'favicon_cn.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//activity view session redis
// app.use(session({
//     store: new RedisStore({
//         host : config.redis.host,
//         port: config.redis.port,
//         db: config.redis.db
//     }),
//     secret: 'membox_mars_rock',
//     resave: false,
//     saveUninitialized: true
// }))

app.use('/activity',express.static(path.join(__dirname, 'static')));





app.use(routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
