/*
 * @Author: Derek Zhou
 * @Date:   2017-01-18 15:24:35
 * @Last Modified by:   Derek
 * @Last Modified time: 2017-04-11 22:21:02
 */

(function() {
    if ((appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400)) {
		$('.newcomer a,.newcomercomment a').each(function(){
			var appProductId = $(this).data('id');
			console.log(appProductId);
			var obj = {
	            domain: "product",
	            action: "detail",
	            data: {
	                productId: appProductId,
	                url: location.href
	            }
	        };
	        var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
	        $(this).attr('href',href);
		})
		$('.comment-item').each(function(){
			var appProductId = $(this).data('id');
			var obj = {
	            domain: "product",
	            action: "detail",
	            data: {
	                productId: appProductId,
	                url: location.href
	            }
	        };
	        var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
	        $(this).attr('href',href);
		})
	}
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0
    });
    if(vue.isApp()){
        localStorage.removeItem('mmToken');
    }
    $('.getCouponBtn').click(function () {
        if($(this).attr('data-ruleids')){
            localStorage.ruleids=$(this).attr('data-ruleids');
        }
        if(!$(this).hasClass('over')){
            _maq.push(["_trackEvent", "collarcoupon_check", {Platform: vue.getPlatform()}]);
            if(vue.isApp()){
                localStorage.ref = location.href;
                localStorage.source = 17;
                window.callByJS && window.callByJS({
                    domain: 'user',
                    action: 'userinfo',
                    callback: function (data) {
                        // callBack?callBack(data):vue.userInfoCall(data);
                        if (data && data.data && data.data.token) {
                            localStorage.mmToken = data.data.token;
                            getNewcomerconpon();
                        }
                        setTimeout(function () {
                            if (!localStorage.mmToken) {
                                vue.app_login({source: 17, channel: 17, type: 'register'},function(data){
                                    if(data && data.data && data.data.token){
                                        localStorage.mmToken = data.data.token;
                                        getNewcomerconpon();
                                    }

                                });
                            }
                        }, 100)
                    }
                })
            }else{
                if($(this).attr('data-ruleids')){
                    localStorage.ruleids=$(this).attr('data-ruleids');
                }
                if(!localStorage.mmToken){
                    localStorage.ref = location.href;
                    localStorage.source = 17;
                    location.href='/m/account/login.html?source=17';
                }else{
                    getNewcomerconpon();
                }
            }
        }

    })
    if(localStorage.couponToken){
        window.callByJS && window.callByJS({
            domain: 'user',
            action: 'userinfo',
            callback: function (data) {
                // callBack?callBack(data):vue.userInfoCall(data);
                if (data && data.data && data.data.token) {
                    localStorage.mmToken = data.data.token;
                    if(localStorage.couponToken==data.data.token){
                        $('.newcomercoupon li').addClass('over');
                        $('.getCouponBtn').addClass('over');
                    }
                }
            }
        })
    }

})()
window.getNewcomerconpon=function () {
    var dialog = $('.dislog');
    if (localStorage.ruleids && localStorage.mmToken && (!localStorage.couponToken || localStorage.couponToken!=localStorage.mmToken)) {
        $('.getCouponBtn').addClass('over');
        $.ajax({
            url: $("body").attr("data-pc") + "/h5/getcoupon/batchBind",
            type: 'get',
            dataType: 'json',
            data: {token: localStorage.mmToken,ruleIds:localStorage.ruleids},
            traditional: true,
            success: function (data){
                if(localStorage.mmToken){
                    localStorage.couponToken=localStorage.mmToken
                }
                $('.newcomercoupon li').addClass('over');
                $('.getCouponBtn').addClass('over');
                if(data.msg){
                    dialog.html(data.msg).addClass('show');
                    localStorage.removeItem('ruleids');
                    setTimeout(function () {
                        $('.dislog').removeClass('show');
                    }, 3000)
                }

            }
        });
    }else if(localStorage.couponToken && localStorage.mmToken && localStorage.couponToken==localStorage.mmToken){
        $('.newcomercoupon li').addClass('over');
        $('.getCouponBtn').addClass('over');
    }

}

