/**
 * Created by memebox on 16/10/22.
 */
$(function(){
    FastClick.attach(document.body);
    echo.init({
        offset: 300,
        throttle: 0,
        debounce : false,
        unload: false,
        callback: function (element, op) {

        }
    });

    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?d303aeebc00e96434b3bcf04b88d8666";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    
})