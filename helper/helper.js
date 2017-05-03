/**
 * Created by memebox on 16/10/22.
 */
var moment = require('moment'),
    //appVer = require('../helper/version'),
    env    = process.env.NODE_ENV || "development",
    config = require('../conf/config')[env];


var helper = function(Handlebars ){
    Handlebars.registerHelper("bgc",function(val){
        if(val){
            return "background:"+val;
        }else{
            return "background:'#ffffff'";
        }
    });

    Handlebars.registerHelper("json",function(val){
        return JSON.stringify(val);
    });

    Handlebars.registerHelper("link",function(val){
        if(val){
            return config.product+"/catalog/product/view/id/"+val;
        }else{
            return "javascript:void(0)";
        }
    });
    Handlebars.registerHelper("mlink",function(val){
        if(val){
            return config.mproduct+"/m/productDetails/productDetails.html?p="+val;
        }else{
            return "javascript:void(0)";
        }
    });
    Handlebars.registerHelper("mlinkToComment",function(val,cid){
        if(val){
            return config.mproduct+"/m/productDetails/productDetails.html?p="+val+'&c='+cid;
        }else{
            return "javascript:void(0)";
        }
    });


    Handlebars.registerHelper("imgCat",function(column , small , big){
        if(column == 1){
            return big;
        }else{
            return small;
        }
    });

    Handlebars.registerHelper("format",function(val , format){
        return moment(val).format(format)
    });

    Handlebars.registerHelper("ifCond",function(v1, v2, v3, v4){
        if(v1 && (v2!=0)){
            return v3;
        }
        else{
            return v4;
        }
    });

    Handlebars.registerHelper('makeArr',function () {
        var l = arguments.length-1;
        var arr = [];
        for(var i = 0;i<l;i++){
            if(arguments[i]!=''){
                arr.push(arguments[i]);
            }
        }
        console.log(arr)
        return arr;
    });

    Handlebars.registerHelper('compare', function(left, operator, right, options) {
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

}


module.exports = helper;
