/**
 * Created by memebox on 16/11/2.
 */
template.config("openTag", "${");
template.config("closeTag", "}");
template.config("escape", true);
template.config("compress", true);

template.helper('compare', function(left, operator, right, options) {
    if (arguments.length < 3) {
        throw new Error('Handlerbars Helper "compare" needs 2 parameters');
    }
    var operators = {
        '==':     function(l, r) {return l == r; },
        '===':    function(l, r) {return l === r; },
        '!=':     function(l, r) {return l != r; },
        '!==':    function(l, r) {return l !== r; },
        '<':      function(l, r) {return l < r; },
        '>':      function(l, r) {return l > r; },
        '<=':     function(l, r) {return l <= r; },
        '>=':     function(l, r) {return l >= r; },
        'typeof': function(l, r) {return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
    }

    var result = operators[operator](left, right);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

template.helper("link",function(val ,label){
    if(val && label !=0 && label !=2){
        if(appVer.androidVer()>=400 || appVer.iosVer()>=400 || appVer.iosAlias()>=400){
            var obj ={
                domain:"product",
                action:"detail",
                data : {
                    productId : val,
                    url : location.href
                }
            }
            return 'memebox://'+encodeURIComponent(JSON.stringify(obj));
        }else{
            return $('body').data("pc")+"/catalog/product/view/id/"+val;
        }

    }else{
        return "javascript:void(0)";
    }
});

template.helper("mlink",function(val ,label){
    if(val && label !=0 && label !=2){
        if(appVer.androidVer()>=400 || appVer.iosVer()>=400 || appVer.iosAlias()>=400){
            var obj ={
                domain:"product",
                action:"detail",
                data : {
                    productId : val,
                    url : location.href
                }
            }
            return 'memebox://'+encodeURIComponent(JSON.stringify(obj));
        }else{
            return $('body').data("m")+"/m/productDetails/productDetails.html?p="+val;
        }

    }else{
        return "javascript:void(0)";
    }
});


