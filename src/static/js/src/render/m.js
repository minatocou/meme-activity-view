var vue = {
    wxConfig: null,
    appid: 'wx0deda0920b9a3e80',
    openId: '',
    wxError: null,
    memeDomain: 'https://cn.memebox.com',
    get_wxSdk: function (callback) {
        if (window.wx) {
            callback();
        } else {
            //
        }
    },
    /*
     * param:{productId:xx,url:xx}
     *
     */
    app_product: function (param) {
        param = param || {};
        param.url = location.href;
        window.callByJS && window.callByJS({
            domain: 'product',
            action: 'detail',
            param: param
        })
    },
    isIos: function () {
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    },
    isAndroid: function () {
        return /android/.test(window.navigator.userAgent.toLowerCase());
    },
    isApp: function () {
        return this.iosVer() || this.androidVer() || this.iosAlias();
    },
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
    },
    isInWeixin: function () {
        return /MicroMessenger/i.test(navigator.userAgent);
    },
    getSearch: function (name, search) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = search ? search.substr(1).match(reg) : decodeURIComponent(window.location.search).substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    },
    getPlatform: function () {
        if(this.isInWeixin()){
            return "wechat";
        }else if(this.iosVer()){
            return "iOS";
        }else if(this.androidVer()){
            return "Android";
        }else{
            return "h5";
        }
    },
    openNative: function (obj) {
        var $this = this;
        if ($this.isIos()) {
            if (!$this.isApp()) {
                var iframe = document.createElement("iframe");
                iframe.src = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                iframe.style.display = 'none';
                // iframe.onerror = function(){
                //     location.href='memebox://'+encodeURIComponent(JSON.stringify(obj));
                // };
                iframe.onload = function () {
                    console.log('success')
                };
                document.body.appendChild(iframe);
            } else if ($this.isWeixin()) {
                location.href = location.origin + '/m/app?app_json=' + encodeURIComponent(JSON.stringify(obj));
            }
            location.href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
        }
        if ($this.isAndroid()) {
            if (!$this.isApp()) {
                var iframe = document.createElement("iframe");
                iframe.src = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                iframe.style.display = 'none';
                // iframe.onerror = function(){
                //     location.href='memebox://'+encodeURIComponent(JSON.stringify(obj));
                // };
                iframe.onload = function () {
                    console.log('success')
                };
                document.body.appendChild(iframe);
            }
            location.href = 'memebox://m.cn.memebox.com?app_json=' + encodeURIComponent(JSON.stringify(obj));
        }
    },
    toAppH5View: function (url, title, image_url) {
        url = url || location.href;
        title = title || document.title;
        image_url = image_url || null;
        var $this = this;
        var param = {
            domain: 'h5page',
            action: 'to_h5page',
            data: {url: url, title: title, image_url: image_url}
        };
        if (!$this.isApp()) {
            $this.openNative(param);
        }
    },
    signature: function (err, callback) {

        var $this = this;
        var data = {url: location.href};
        if (err) data.err = err;
        if (this.isInWeixin()) {
            if ($this.wxConfig) {
                wx.config($this.wxConfig);

                callback && callback(data, err);
            } else {
                $.ajax({
                    url: $this.memeDomain + '/h5/wechat/getsignpackage',
                    data: data,
                    dataType: 'json',
                    showLoading: true,
                    success: function (data) {
                        $this.wxConfig = {
                            debug: /debug=1/.test(location.search),
                            appId: data.data.appId,
                            timestamp: data.data.timestamp,
                            timeStamp: data.data.timestamp,
                            nonceStr: data.data.nonceStr,
                            signature: data.data.signature,
                            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay']
                        }
                        wx.config($this.wxConfig);
                        wx.error(function (res) {
                            $this.wxError = res;
                            if (/debug=1/.test(location.search))
                                alert(JSON.stringify(res));
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                            $this.signature(res);
                            //避免多次调用接口
                            $this.signature = function () {
                            };
                        })

                        callback && callback(data, err);
                    }
                });
            }
        }
    },
    addUrlPara: function (name, value, url) {
        url = url || window.location.href;
        var currentUrl = url.split('#')[0];
        if (/\?/g.test(currentUrl)) {
            if (/name=[-\w]{4,25}/g.test(currentUrl)) {
                currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
            } else {
                currentUrl += "&" + name + "=" + value;
            }
        } else {
            currentUrl += "?" + name + "=" + value;
        }
        if (url.split('#')[1]) {
            return currentUrl + '#' + url.split('#')[1];
        } else {
            return currentUrl;
        }
    },
    native_share: function (callback) {
        callbacks && (callbacks['sharenativeShare'] = callback);
    },
    set_native_callback: function (name, callback) {
        callbacks && (callbacks[name] = callback);
    },

    set_share: function (config) {
        var $this = this;
        var url = config.link || config.url;
        var mapParam = {
            stoken: localStorage.mmToken,//可能uid不存在,所以先拿token代替。
            set: 'wechat'
        };
        if (localStorage.user) {
            url = $this.addUrlPara('suid', JSON.parse(localStorage.user).userId, url);
            mapParam.suid = JSON.parse(localStorage.user).userId;
        }
        if (localStorage.uuid) {
            mapParam.suuid = localStorage.uuid;
            url = $this.addUrlPara('suuid', localStorage.uuid)
        }
        if (localStorage.uuid2) {
            mapParam.suuid2 = localStorage.uuid2;
            url = $this.addUrlPara('suuid2', localStorage.uuid2)
        }
        mapParam.sell = url;
        $this.signature(null, function (data, err) {
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: config.title,
                    link: url,
                    imgUrl: config.imgUrl || config.image,
                    trigger: function () {
                    },
                    success: function () {
                        mapParam.set = 'activity_moment';
                        _maq && _maq.push(["_trackEvent", "app_share", mapParam])
                        vue.appShareCall && vue.appShareCall({code: 1, bshareId: config.bshareId || ""})
                    },
                    cancel: function () {
                    },
                    fail: function () {
                    }
                });
                wx.onMenuShareAppMessage({
                    title: config.title,
                    desc: config.desc || config.text,
                    link: url,
                    imgUrl: config.imgUrl || config.image,
                    trigger: function () {
                    },
                    success: function () {
                        mapParam.set = 'activity_friends';
                        _maq && _maq.push(["_trackEvent", "app_share", mapParam])
                        vue.appShareCall && vue.appShareCall({code: 1, bshareId: config.bshareId || ""})
                    },
                    cancel: function () {
                    },
                    fail: function () {
                    }
                });

            });
        }, config.success)
    },

    appShareCall: function (data) {
        if (data.code == 1) {
            if (data.bshareId) {
                localStorage.setItem(data.bshareId, true)
                $(".benefitsBeforeImg").addClass('hide')
                $(".benefitsAfterImg").addClass('hide')
                $(".benefits-type[data-status='1']").find(".benefitsBeforeImg").addClass('hide');
                $(".benefits-type[data-status='1']").find(".benefitsAfterImg").removeClass('hide');
            }

        }
    },
    app_share: function (param) {
        window.callByJS && window.callByJS({
            domain: 'share',
            action: 'share',
            param: param,
            callback: function (data) {
                vue.appShareCall(data);

            }
        })
    },
    app_login: function (param, cb) {
        param=param||{};
        param.source && (param.channel=param.source)
        window.callByJS && window.callByJS({
            domain: 'user',
            action: 'login',
            param: param,
            callback: function (data) {
                if (data && data.data && data.data.token) {
                    localStorage.mmToken = data.data.token;
                }
                cb && cb(data);
            }
        })
    },
    userInfoCall: function (data) {
        if (data && data.data && data.data.token) {
            localStorage.mmToken = data.data.token;
        }
    },
    app_userinfo: function () {
        //this.openAction(this.appDomain+'user?action=userinfo')
        localStorage.removeItem('mmToken');
        window.callByJS && window.callByJS({
            domain: 'user',
            action: 'userinfo',
            callback: function (data) {
                // callBack?callBack(data):vue.userInfoCall(data);
                vue.userInfoCall(data);
            }
        })
    },
    app_setShare: function (param) {
        window.callByJS && window.callByJS({
            domain: 'share',
            action: 'setShareInfo',
            param: param,
            callback: function (data) {

                if ($(".benefits-type").length) {
                    data.bshareId = $(".benefits-type[data-status=1]").data("id")
                }

            }
        })
    },
    isLogin: function () {

    },
    getUuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },
    created: function () {
        var $this = this;
        console.log(this);
        if ($(".benefits-type").length) {
            share_obj.bshareId = $(".benefits-type[data-status=1]").data("id")
        }
        if (vue.isApp()) {
            $this.app_userinfo();
        }
        if ($this.getSearch('s')) {
            $this.toAppH5View();
        }
        if (!localStorage.uuid) {
            localStorage.uuid = this.getUuid();
        }
        if (this.getSearch('suuid')) {
            _maq && _maq.push(["_trackEvent", "open_share", {
                suuid2: this.getSearch('suuid'),
                suuid: localStorage.uuid,
                sell: location.href,
                spathname: location.pathname,
                set: this.getSearch('set'),
                suid: this.getSearch('suid')
            }]);
            localStorage.uuid2 = this.getSearch('suuid');
        }
        setTimeout(function () {
            $this.app_setShare(share_obj);
            initLinkEvent($this)
        }, 50);
        this.set_share(share_obj);
        this.native_share(function (data) {
            data.bshareId = share_obj.bshareId;
            if (data.code == 1) {
                vue.appShareCall(data);
            } else {
                console.log(data.code)
            }

        });
        console.log(callbacks)
    }
}
vue.created();
!(function (window) {


    if ($(".benefits-type").length) {
        $(".benefits-type").each(function (index, bf) {
            var $ele = $(bf);

            $ele.find(".benefitsBeforeImg").click(function () {
                _maq.push(["_trackEvent", "hide-reward", {}])
                var shareId = $(this).parents(".benefits-type").data("id")
                if (appVer.iosVer() || appVer.androidVer() || appVer.iosAlias()) {
                    setTimeout(function () {
                        $(".benefitsBeforeImg").addClass('hide')
                        $(".benefitsAfterImg").addClass('hide')
                        $ele.find(".benefitsBeforeImg").addClass('hide');
                        $ele.find(".benefitsAfterImg").removeClass('hide');
                        localStorage.setItem(shareId, true)
                    }, 8000)

                    window.callByJS && window.callByJS({
                        domain: 'share',
                        action: 'share',
                        param: share_obj,
                        callback: function (data) {
                            if (data.code == 1) {
                                $(".benefitsBeforeImg").addClass('hide')
                                $(".benefitsAfterImg").addClass('hide')
                                $ele.find(".benefitsBeforeImg").addClass('hide');
                                $ele.find(".benefitsAfterImg").removeClass('hide');
                                localStorage.setItem(shareId, true);
                            }
                        }
                    })
                } else if (appVer.iosVer() || appVer.iosAlias()) {
                    location.href = 'https://itunes.apple.com/cn/app/memebox-mei-mei-xiang/id960677490?mt=8';
                } else if (appVer.androidVer()) {
                    location.href = 'http://pkg-cn1001.memebox.com/android/app/app-memebox_upgrade.apk';
                } else {
                    location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.memebox.cn.android&ckey=CK1334853810944';
                }

            })
        })
    }


    window.onload = function () {
        $(".groupImg").each(function () {
            var li = $(this).siblings("li").eq(0);
            var height = $(li).innerHeight() - 1;
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
    $(".top-anchor.map-link").click(function () {
        var anchorVal = $(this).data("anchor")
        var anchorEle = $(".anchor-ele[name=" + anchorVal + "]");
        var y = anchorEle.position().top;
        var $dom = jQuery('html, body');
        $dom.scrollTop(y || 0)
    })

    /**
     * 弹窗->临时需求  :(
     */
    $(".link-popup").click(function () {
        var img = $(this).data("img"),
            url = $(this).data("url"),
            type = $(this).data("type"),
            oDiv = document.createElement("div"),
            oA = document.createElement("a"),
            oImg = document.createElement("img"),
            oSpan = document.createElement("span"),
            childDiv = document.createElement("div");
        (type === "url") ? (oA.href = url) : (oA.href = "#" + url);
        oA.setAttribute("data-anchor", url);
        oImg.src = img;
        oA.appendChild(oImg);
        oDiv.className = "maskPopUp";
        oDiv.appendChild(childDiv);
        oDiv.appendChild(oA);
        oDiv.appendChild(oSpan);
        document.body.appendChild(oDiv);

    });
    $("body").on("touchend", ".maskPopUp", function (e) {
        if (e.target && (e.target.nodeName === "DIV" || e.target.nodeName === "SPAN" || e.target.nodeName === "IMG")) {
            var t = setTimeout(function(){
                $(".maskPopUp").remove();
                t = null;
            },0);
        }
    });

    // $("body").on("touchmove",".maskPopUp",function (e) {
    //    e.preventDefault();
    //    console.log(e)
    // });
    if (ids) {
        $.ajax({
            url: $("body").data("pis") + "/global/price",
            type: 'get',
            dataType: 'json',
            traditional: true,
            data: {productIds: ids},
            success: function (data) {
                var productData = data.data;
                for (var i = 0; i < productData.length; i++) {
                    var $product = $(".product[data-id=" + productData[i].productId + "]");

                    if (appVer.androidVer() >= 400 || appVer.iosVer() >= 400 || appVer.iosAlias() >= 400) {
                        var obj = {
                            domain: "product",
                            action: "detail",
                            data: {
                                productId: productData[i].productId,
                                url: location.href
                            }
                        }
                        var href = 'memebox://' + encodeURIComponent(JSON.stringify(obj));
                        $product.find("a").each(function (index, a) {
                            $(a).attr("href", href)
                        });
                    }

                    if (!parseInt(productData[i].stockStatus)) {
                        $product.append("<div class='stock-over'>抢光了</div>")
                    }
                    if (!$product.hasClass('friday')) {
                        $product.find(".pro-shop em").html(productData[i].price)
                        $product.find(".pro-shop del").html("原价:" + productData[i].originPrice)
                    } else {
                        $product.find(".pro-shop em span").html(parseInt(productData[i].price))
                        $product.find(".pro-shop del span").html(parseInt(productData[i].originPrice))
                        $product.find(".pro-shop strong span").html(parseInt(productData[i].specialPrice))

                    }

                }

            }
        })
    }



    if ($(".img-con").length) {
        $(".img-con").each(function (index, ele) {
            var fromtime = $(ele).data("fromtime"),
                totime = $(ele).data("totime"),
                now = $("body").data('now');
            if (fromtime && totime) {
                if (moment(now).diff(moment(fromtime)) < 0 || moment(now).diff(moment(totime)) > 0) {
                    $(ele).remove()
                }
            }
        })
    }
})(window);
