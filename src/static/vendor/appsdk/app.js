var callbacks=window.callbacks || {};
var appVer={
    iosVer: function () {
        var ver = navigator.appVersion.match(/MWProjectTemplate.*/);
        return ver && ver[0].match(/[\d]/g) && ver[0].match(/[\d]/g).join('');
    },
    iosAlias: function () {
        var ver = navigator.appVersion.match(/MemeboxAlias.*/);
        return ver && ver[0].match(/[\d]/g) && ver[0].match(/[\d]/g).join('');
    },
    androidVer: function () {
        var ver = navigator.appVersion.match(/MeMeAndroid.*/);
        return ver && ver[0].match(/[\d]/g) && ver[0].match(/[\d]/g).join('');
    }
}
function encode( opts ){
    if( typeof opts === "object" ){
        for(var p in opts){
            if( typeof opts[p] === "object" ){
                opts[p] = encode( opts[p] )
            }else if (Array.isArray(opts[p])){
                for( var i=0 ; i < opts[p].length ; i++ ){
                    if( typeof opts[p][i] === "object" ){
                        opts[p][i] = encode( opts[p][i] )
                    }else{
                        opts[p][i] = encodeURIComponent( opts[p][i] )
                    }
                }
            }else{
                opts[p] = encodeURIComponent(opts[p])
            }
        }
    }else{
        console.log("不是有效的对象")
    }
    return opts;
}
function invoke(domain,action,cmd) {
    console.log('do app',domain,action,cmd);
    if(appVer.androidVer()==360 || appVer.iosVer()==360){
        console.log('do app ver 360 ',domain,action,cmd);
        location.href = 'memebox://'+domain+'?action='+action+'&data='+JSON.stringify(cmd);
    }else if(appVer.androidVer()>360 || appVer.iosVer()>360 || appVer.iosAlias()){
        var obj ={
            domain:domain,
            action:action,
        };
        cmd&&(obj.data=cmd);
        console.log('do app ver 360 +','memebox://'+encodeURIComponent(JSON.stringify(obj)));
        location.href = 'memebox://'+encodeURIComponent(JSON.stringify(obj));
    }
}

function callByJS(opt) {
    var callKey=opt.domain+opt.action;
    var input = {};
    //input.name = opt.name;
    //input.callbackId = generateID();
    input.param = opt.param || {};
    console.log(opt,callKey)
    opt.callback && (callbacks[callKey] = opt.callback);

    invoke(opt.domain,opt.action,opt.param);
}
function appCallback (domain,action,opt) {
    opt= opt || {};
    var callKey=domain+action;
    var callback = callbacks[callKey];
    // var result = opt.result || {};
    // var script = opt.script || '';
    // Native主动调用Web
    if (!callback) {
        //log('callByNative script', script);
        // try {
        //     invoke(JSON.stringify({
        //         callbackId: opt.callbackId,
        //         result: eval(script)
        //     }));
        // } catch (e) {
        //     console.error(e);
        // }
    }
    // Web主动调用Native，Native被动响应
    else{
        try {
            callback(JSON.parse(opt));
            delete callback;
            //log(callbacks);
        } catch (e) {
            callback(opt);
            delete callback;
            //console.log(e);
        }
    }
}
