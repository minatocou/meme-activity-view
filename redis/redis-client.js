/**
 * Created by page.xia on 16/9/14.
 */
var env  = process.env.NODE_ENV || "development",
     config = require('../conf/config')[env],
    Redis = require('ioredis'),
    client = new Redis({
        port: config.redis.port,
        host: config.redis.host,
        db: config.redis.db
    })

module.exports = client;