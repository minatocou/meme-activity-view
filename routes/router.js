/**
 * Created by memebox on 16/6/4.
 */
var express = require('express')
    , router = express.Router();

router.use('/activity',
    require('../controllers/render/m'),
    require('../controllers/api/wechat'),
    require('../controllers/api/girlsday')

);

// router.use('/api',
// 	require('../controllers/api/wechat')
// );

router.use('/promotion',
    require('../controllers/render/pc')
);

router.use('/activity/dl',
	require('../controllers/app/download')
);
module.exports = router
