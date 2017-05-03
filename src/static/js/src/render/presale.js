/**
 * Created by Jesse on 16/11/16.
 * 预售
 */

$(function () {
    var now = $('body').data('now');
    var start = $('.presale').data('start') * 1000;
    var end = $('.presale').data('end') * 1000;
    var time;
    var coutdown;
    var description = $('.presale .mask p').text();
    description && (function () {
        var arr = description.trim().split(/\n/);
        var html = '';
        for (var i = 0; i < arr.length; i++)
            html += '<p>' + arr[i].trim() + '</p>';
        console.log(arr)
        $('.presale .mask .content').html(html);
    })();
    $('.mask').on('touchend', '.hide-mask,span', function () {
        $('.mask').hide();
    });
    $('.presale .countdown a').on('touchend', function () {
        $('.mask').show();
    });

    // if (appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400) {
    //     $('.presale ul .notover a').each(function (index, ele) {
    //         var obj = {
    //             domain: "product",
    //             action: "detail",
    //             data: {
    //                 productId: $(ele).data('id'),
    //                 url: location.href
    //             }
    //         };
    //         var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
    //         $(ele).attr("href", href);
    //         $(ele).attr("data-href", href);
    //         console.log($(ele).data('href'));
    //     });
    // }
    /**
     * 预售状态
     * 0: 开始
     * 1:开始
     * 2:结
     */
    var obj = {
        get state() {

        },
        set state(val) {
            var a = {
                0: 'javascript:void(0)',
                1: function (ele) {
                    if (appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400) {
                        var obj = {
                            domain: "product",
                            action: "detail",
                            data: {
                                productId: $(ele).data('id'),
                                url: location.href
                            }
                        };
                        var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                        return href;
                    }
                    return $(ele).data('href');
                }
            };
            a[2] = a[1];
            $('.presale ul .notover a').each(function (index, ele) {
                $(ele)[0].href = (typeof a[val] == 'function') ? a[val](ele) : a[val];
            });

        }
    };
    (now < start) && (function () {
        obj.state = 0;
        time = start - now;
        coutdown = setInterval(function () {
            time--;
            if (time == 0) {
                clearInterval(coutdown);
                obj.state = 1;
            }
        }, 1000);
    })();
    var pids = '';
    $('.presalePro').length != 0 && $('.presalePro').each(function () {
        if (pids) {
            pids += ',' + $(this).data('id');
        } else {
            pids = $(this).data('id');
        }
    });
    pids && $.ajax({
        url: $("body").data("pc") + "/h5/product/getprice",
        type: 'get',
        dataType: 'json',
        traditional: true,
        data: {
            productIds: pids,
            type: 2
        },
        success: function (data) {
            var proData = data.data, l;
            l = proData.length;
            for (var i = 0; i < l; i++) {
                var productLi = $('.presaleProLi[data-id=' + proData[i].productId + ']');
                productLi.find('.ls-double11-price').text('￥' + parseFloat(proData[i].specialPrice));
                productLi.find('.ls-original-price').text('￥' + parseFloat(proData[i].price));
                productLi.find('.ls-current-price').text('￥' + parseFloat(proData[i].presalePrice));
                productLi.find('.product-foot').text('预付定金￥' + parseFloat(proData[i].deposit));
                if ((appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400) ) {//&& $('.presale ul .not-over a').length != 0
                    var obj = {
                        domain: "product",
                        action: "detail",
                        data: {
                            productId: proData[i].productId,
                            url: location.href
                        }
                    };
                    var hrefApp = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                    productLi.children('a').attr("href", hrefApp);
                    productLi.children('a').attr("data-href", hrefApp);
                }

                if (proData[i].stockStatus == '0' || proData[i].stockStatus == null) {
                    productLi.addClass('over');
                    productLi.removeClass('not-over');
                    productLi.children('a').attr('href', 'javascript:void(0)');
                    productLi.find('.product-img').append('<div class="stock-out">已抢光</div>');
                } else {
                    if (now < start) {
                        var href = productLi.children('a').data('href');
                        productLi.children('a').attr('href', 'javascript:void(0)');
                    }
                }
            }
        }
    })
});