/**
 * Created by Jesse on 16/11/16.
 * 拼团
 */
(function () {
    var pids = '';
    $('.grouponPro').length != 0 && $('.grouponPro').each(function () {
        if (pids) {
            pids += ',' + $(this).data('id');
        } else {
            pids = $(this).data('id');
        }
    });
    pids&&$.ajax({
        url: $("body").data("pc") + "/h5/product/getprice",
        type: 'get',
        dataType: 'json',
        traditional: true,
        data: {
            productIds: pids,
            type:1
        },
        success:function (data) {
            var proData = data.data,l ;
            l = proData.length;
            for(var i = 0;i<l;i++){
                var productLi = $('.grouponPro[data-id='+proData[i].productId+']');
                var arr = productLi.find('.current-price').html().split('￥');
                productLi.find('.original-price').text('单独购买￥'+parseFloat(proData[i].price));
                productLi.find('.current-price').html(arr[0]+'￥'+parseFloat(proData[i].grouponPrice));
                if ((appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400)) {
                    var obj = {
                        domain: "product",
                        action: "detail",
                        data: {
                            productId: proData[i].productId,
                            url: location.href
                        }
                    };
                    var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                    productLi.children('a').attr("href", href);
                    productLi.children('a').attr("data-href", href);
                }
                if(proData[i].stockStatus=='0'||proData[i].stockStatus==null){
                    productLi.children('a').attr('href','javascript:void(0)');
                    if(productLi.find('.groupon-out').length<=0){
                        productLi.find('.product-img').append('<div class="groupon-out">已抢光</div>');
                        productLi.find('.openGrouponBtn').addClass('groupon-label-out');
                        productLi.find('.openGrouponBtn').removeClass('groupon-label');
                    }
                }
            }
        }
    })
})();