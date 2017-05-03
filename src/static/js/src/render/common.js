/**
 * Created by Jesse on 16/11/28.
 */
(function () {
    var render_container = document.querySelector('.render_container');
    (render_container.innerHTML.trim()=='')&&(function () {
        document.querySelector('body').className = 'activeIsOver';
    })();

})();
var initLinkEvent=function (vue) {
    $(".map-link.trans,.img-link").each(function(index , ele){
        var $this=$(this);
        var reg = new RegExp("/catalog/product/view/id/","g");
        var url = $(this).attr("data-href");

        var isProduct = reg.test($(this).attr("data-href"));
        var obj = null;
        if (vue.isApp()) {
            if (!isProduct) {
                if ($this.attr('data-login') == 1 && !localStorage.mmToken) {
                    var pathname = location.href;
                    localStorage.toLogin = 1;
                    localStorage.loginMsg = $this.attr('data-loginMsg');
                    localStorage.regMsg = $this.attr('data-regMsg');
                    localStorage.ref = pathname;
                    localStorage.source = 12;
                    obj = {
                        domain: 'user',
                        action: 'login',
                        data: {channel: 12},
                    }
                    setTimeout(function () {
                        vue.set_native_callback('userlogin', function (data) {
                            if (data && data.data && data.data.token) {
                                localStorage.mmToken = data.data.token;
                                if ($this.attr('data-href')) {
                                    $this.attr('href', $this.attr('data-href'));
                                } else {
                                    $this.removeAttr('href');
                                }
                            }
                            window.isLogin();
                        });
                    }, 100)
                } else {
                    if(url){
                        obj = {
                            domain: "h5page",
                            action: "to_h5page",
                            data: {
                                title: "",
                                url: url,
                                image_url: "http://avatar.cn.memebox.com/avatar/2016/11/4/5b5c2b71-f04c-42ad-b96f-84a06ab9205a.png"
                            }
                        }
                    }
                }
            } else {
                obj = {
                    domain: "product",
                    action: "detail",
                    data: {
                        productId: url.split("/").pop(),
                        url: location.href
                    }
                }
            }
            if(obj){
                var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                $(this).attr("href", href)
            }

        }
        if (!vue.isApp() && $this.attr('data-login') == 1 && !localStorage.mmToken) {
            var pathname = location.href;
            localStorage.toLogin = 1;
            localStorage.loginMsg = $this.attr('data-loginMsg');
            localStorage.regMsg = $this.attr('data-regMsg');
            localStorage.ref = pathname;
            localStorage.source = 12;
            $this.attr('href', '/m/account/login.html?source=12');

        } else if (!vue.isApp() && (localStorage.mmToken || $this.attr('data-login') != 1)) {
            if ($this.attr('data-href')) {
                $this.attr('href', $this.attr('data-href'));
            } else {
                $this.removeAttr('href');
            }
        }else{
            window.isLogin();
        }
    })
}

window.isLogin = function () {
    var dialog = $('.dislog');
    if (localStorage.toLogin == 1 && localStorage.mmToken) {
        if(localStorage.loginMsg || localStorage.regMsg){
            $.ajax({
                url: $("body").attr("data-pc") + "/h5/newcomer/list",
                type: 'get',
                dataType: 'json',
                data: {token: localStorage.mmToken},
                traditional: true,
                success: function (data) {
                    if (data.data.isNewcomer == 1) {
                        localStorage.regMsg && dialog.html(localStorage.regMsg).addClass('show');
                    } else {
                        localStorage.loginMsg &&dialog.html(localStorage.loginMsg).addClass('show');
                    }
                    localStorage.removeItem('toLogin');
                    localStorage.removeItem('loginMsg');
                    localStorage.removeItem('regMsg');
                    setTimeout(function () {
                        $('.dislog').removeClass('show');
                    }, 3000)
                }
            });
        }
        if(localStorage.ruleId){
            $.ajax({
                url: $("body").attr("data-pc") + "/h5/getCoupon/batchBind",
                type: 'get',
                dataType: 'json',
                data: {token: localStorage.mmToken,ruleIds:localStorage.ruleId},
                traditional: true,
                success: function (data) {
                    data.msg && dialog.html(data.msg).addClass('show');
                    localStorage.removeItem('toLogin');
                    localStorage.removeItem('ruleId');
                    setTimeout(function () {
                        $('.dislog').removeClass('show');
                    }, 3000)
                }
            });
        }

    }

};
window.isLogin();