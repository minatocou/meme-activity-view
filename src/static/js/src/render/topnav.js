/**
 * Created by Jesse on 17/2/27.
 */
(function () {
    var width = 0;
    document.getElementById("noMove")&&document.getElementById("noMove").addEventListener('touchmove', function (event) {
        event.preventDefault();
    });
    $("#navInner a").each(function (index, ele) {
        width += $(ele).width() + 20;
    });
    // $("#navInner").css({
    //     width: width + 45 + "px"
    // });
    var l = $("#navInner .nav-item").length;
    if(l<5){
        $("#navInner").addClass("navShort");
        $("#navInner .nav-item").each(function (index,ele) {
           $(ele).css({
               width:($("body").width()-45)/l
            });
        });
    }else {
        $("#navInner").css({
            width: width + 45 + "px"
        });
    }
    function stabPop(hide) {
        $(this).find("i").toggleClass("rotate180");
        hide?$(".stab-pop").hide():$(".stab-pop").toggle();
    }

    function changeClass(clas, other, id) {
        var index = $(this).data("index");
        if (index == $(".nav-item-selected").data("index")) {
            return;
        }
        $("#nav-wrap ." + clas).removeClass(clas);
        $(this).addClass(clas);
        $("#nav-wrap ." + other).removeClass(other);
        $($("#" + id).children()[index]).addClass(other);
        scrollNav(index);
        changeBottomLine();
    }
    function anchor() {
        var anchorVal = $(this).data("anchor");
        var anchorEle = $(".anchor-ele[name="+anchorVal+"]");
        if(anchorEle.length==0){
            return;
        }
        var y = anchorEle.position().top;
        var $dom =  jQuery('html, body');
        $dom.scrollTop(y || 0);
    }
    function changeBottomLine() {
        var width = $(".nav-item-selected").css("width"),
            leftFirst = $($("#navInner a")[0]).offset().left,
            leftLast = $(".nav-item-selected").offset().left,
            left = leftLast - leftFirst;
        $(".nav-bottom-line").css({
            "width": $(".nav-item-selected").css("width"),
            "display": "block",
            "left": left + "px"
        });
    }

    function scrollNav(index) {
        var leftLast = $($("#navInner a")[index]).offset().left,
            leftFirst = $($("#navInner a")[0]).offset().left,
            width = $("body").width() / 2,
            left = leftLast - leftFirst - width;
        $("#navOuter").scrollLeft(left);
    }

    $(".stab-more").click(function () {
        stabPop.call(this);
    });
    $(".no-move").click(function () {
        stabPop.call(this);
    });
    $("#newWrap").on("click", ".nav-item", function () {
        changeClass.call(this, "nav-item-selected", "liOn", "topNavUl");
        anchor.call(this);
        stabPop(true);
    });
    $("#nav-wrap .stab-pop ul").on("click", "li", function () {
        changeClass.call(this, "liOn", "nav-item-selected", "navInner");
        anchor.call(this);
        stabPop();
    });

})();
