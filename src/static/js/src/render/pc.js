/**
 * Created by memebox on 16/10/12.
 */


$(function(){
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?d303aeebc00e96434b3bcf04b88d8666";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    // Vue.config.delimiters = ['${', '}']
    //
    // var vue = new Vue({
    //     mixins:[vueWx],
    //
    //     methods: {
    //         app_share: function (param) {
    //             window.callByJS && window.callByJS({
    //                 domain:'share',
    //                 action:'share',
    //                 param: param,
    //                 callback: function (data) {
    //                     vue.appShareCall(data);
    //                 }
    //             })
    //         },
    //         app_setShare: function (param) {
    //             window.callByJS && window.callByJS({
    //                 domain:'share',
    //                 action:'setShareInfo',
    //                 param: param
    //             })
    //         },
    //     },
    //     created: function () {
    //         this.app_setShare(share_obj);
    //         this.set_share(share_obj);
    //     }
    // })


    !(function () {
        echo.init({
            offset: 400,
            throttle: 10,
            unload: false,
            callback: function (element, op) {

            }
        });
        window.onload = function () {
            $(".groupImg").each(function () {
                var li = $(this).siblings("li").eq(0);
                var height = $(li).innerHeight()-1;
                var css = {"height": height};
                $(this).css(css);

                $(this).find(".groupImg-link").show();
            })
        };

        var ids = ""
        $(".product").each(function (index, ele) {
            if (ids) {
                ids += ("," + $(ele).data("id"))
            } else {
                ids += $(ele).data("id")
            }

        })

        if( ids ){
            $.ajax({
                url: $("body").data("pis")+"/global/price",
                type: 'get',
                dataType: 'json',
                traditional: true,
                data: {productIds: ids},
                success: function (data) {
                    var productData = data.data;
                    for (var i = 0; i < productData.length; i++) {
                        var $product = $(".product[data-id=" + productData[i].productId + "]");
                        if (!parseInt(productData[i].stockStatus)) {
                            $product.append("<div class='stock-over'>抢光了</div>")
                        }
                        $product.find(".pro-shop em").html("美美价:"+parseInt(productData[i].price))
                        $product.find(".pro-shop del").html("原价:"+parseInt(productData[i].originPrice))

                    }

                }
            })
        }

    })();

})