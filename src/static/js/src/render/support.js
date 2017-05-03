/**
 * Created by Jesse on 16/12/19.
 */
(function () {
    var giftTotal, num = 0, giftBox;
    $('.gift').on('touchend', function () {
        var _this = this;
        _maq.push(["_trackEvent" , "support" , {name:$(_this).data('name')}]);
        var arr = $(this).data('pic').split(','), img, height = $(this).data('height');
        var second = (function () {
            return (height / 100) * 1000;
        })();
        var left = (parseInt(Math.random() * (height * 0.8)) - 0.4 * height) + 'px';
        num = $(this).data('num');
        $(this).addClass('gift-h');
        giftBox = $(this).find('.gift-box');
        giftTotal = arr.length;
        if (num == giftTotal) {
            num = 0;
            $(this).data('num', 0);
        }
        giftBox.append('<img src=' + arr[num] + ' class=' + 'show-gift' + '>');
        $(this).find('.show-gift').last().animate({
            bottom: height,
            opacity: 0,
            left: left,
            width: '50px'
        }, second, 'linear',function () {
            $(this).remove();
        });
        $(this).data('num', ++num);
    });
    $('.support').each(function () {
        var from = moment($(this).data('from')).toDate().getTime(),
            to = moment($(this).data('to')).toDate().getTime(),
            now = $("body").data("now"),
            startPv = $(this).data('startpv'),
            endPv = $(this).data('endpv');
        var pv = parseInt((endPv - startPv) / (to - from) * (now - from) + startPv);
        if (now < from || now > to||$(this).data('from')==''||$(this).data('to')=='') {
            $(this).css({'display': 'none'});
            return;
        } else {
            $(this).css({'display': 'block'});
        }
        $(this).find('.supportPeople').text(pv);
    });
})();
