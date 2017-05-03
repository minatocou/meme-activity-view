/**
 * Created by memebox on 16/10/17.
 */
$(function () {

    if($(".flashsale").length ){

        var solr = $("body").data("pis"),
            now = $("body").data('now');
        $(".flashsale").each(function(index ,ele){

            var $ele = $(ele),
                $leftTr = $ele.find(".leftTr"),
                $rightTr = $ele.find(".rightTr");
            var swiperWidth = $ele.find(".swiper-wrapper").width(),
                translateX = 0;
            $leftTr.on("touchstart" , function(){
                var scroll = $ele.find(".swiper-active .timeli.active").data("scrollEle");
                if(scroll){
                    if(scroll.x<0){
                        scroll.scrollBy( 250,0, 1000, IScroll.utils.ease.quadratic);

                    }
                }
            })
            $rightTr.on("touchstart" , function(){
                var scroll = $ele.find(".swiper-active .timeli.active").data("scrollEle");
                if(scroll){
                    if( scroll.x > scroll.maxScrollX ){
                        scroll.scrollBy(-250,0, 1000, IScroll.utils.ease.quadratic);

                    }

                }
            })
            $ele.find(".flash-button-next").on('touchstart',function(){
                var activeSlide = $ele.find(".swiper-active");
                translateX = -activeSlide.index()*swiperWidth
                $ele.find(".flash-button-prev").show()
                if( !activeSlide.next().next().length ){
                    $(this).hide()
                }else{
                    $(this).show()
                }
                if( !activeSlide.next().length ){
                    return false;
                }

                activeSlide.removeClass("swiper-active");
                activeSlide.next().addClass("swiper-active")
                translateX = translateX-swiperWidth;
                $ele.find(".swiper-wrapper").css("transform" , "translate3d("+translateX+"px, 0px, 0px)")

                $ele.find(".swiper-wrapper").css("transition-duration" , "300ms")
                if( $ele.find(".swiper-active .timeli[data-label='1']").length ){
                    $ele.find(".swiper-active .timeli[data-label='1']").find(".day").trigger("touchstart")
                }else{
                    $ele.find('.swiper-active .timeli').first().find(".day").trigger("touchstart")
                }
            })
            $ele.find(".flash-button-prev").on('touchstart',function(){
                var activeSlide = $ele.find(".swiper-active");
                translateX = -activeSlide.index()*swiperWidth
                $ele.find(".flash-button-next").show()
                if( !activeSlide.prev().prev().length ){
                    $(this).hide()
                }else{
                    $(this).show()
                }
                if( !activeSlide.prev().length ){

                    return false;
                }

                activeSlide.removeClass("swiper-active");
                activeSlide.prev().addClass("swiper-active");
                translateX = translateX+swiperWidth;
                $ele.find(".swiper-wrapper").css("transform" , "translate3d("+translateX+"px, 0px, 0px)")
                $ele.find(".swiper-wrapper").css("transition-duration" , "300ms")

                if( $ele.find(".swiper-active .timeli[data-label='1']").length ){
                    $ele.find(".swiper-active .timeli[data-label='1']").find(".day").trigger("touchstart")
                }else{
                    $ele.find('.swiper-active .timeli').first().find(".day").trigger("touchstart")
                }
            })
            $ele.find('.swiper-wrapper').on("webkitTransitionEnd", function(){
                echo.render()
            });

            $ele.find(".day").on("touchstart",function(e){
                var $thisli = $(this).parent();

                $thisli.addClass("active");
                if($thisli.data("active")){
                    $thisli.css("background" , $thisli.data("active"));
                    $thisli.siblings().each(function(index ,ele){
                        if($(ele).data("tab")){
                            $(ele).css("background" , $(ele).data("tab"));
                        }else{
                            $(ele).removeAttr("style");
                        }
                    })

                }
                $thisli.siblings().removeClass("active");
                if( $thisli.hasClass("clicked") ){
                    
                    return false;
                }


                var category = $thisli.data("category"),
                    from = $thisli.data("from"),
                    time = $thisli.data("time"),
                    to = $thisli.data("to"),
                    date = $thisli.data("date");

                var fromMoment = moment( date + " " + from ),
                    nowMoment = moment(now),
                    toMoment="";
                if( !to  ){
                    toMoment = moment(date).add(1 , "d")
                }else{
                    toMoment = moment( date + " " + to )
                }

                $thisli.addClass("clicked");

                $.ajax({
                    type :"get",
                    url :solr+"/global/search?pageSize=10000&categoryId="+category,
                    dataType :"json",
                    beforeSend : function(){
                        $thisli.parent().append("<div class='flash-mask'></div>")
                    },
                    success : function(data){
                        if( fromMoment.diff(nowMoment) >0){
                            data.label = 0;
                        }
                        if( nowMoment.diff(fromMoment) > 0 && toMoment.diff(nowMoment)>0 ){
                            data.label = 1;
                        }
                        if( nowMoment.diff(fromMoment.add(30,"m"))>0 ){
                            data.label = 2;
                        }
                        
                        //var template = Handlebars.compile(flashTpl);

                        var newItem = template('flashTpl',data);

                        var $html = $(newItem);
                        if( data.data ){
                            $html.width(6.875*(data.data.length)+0.625 +"rem");
                        }

                        var $timeContent = $thisli.find(".time-content");
                        $timeContent.html($html);
                       

                        var myScroll = new IScroll($timeContent[0], { scrollX: true, scrollY: false, 
                            bounce :false ,preventDefault:false,eventPassthrough : true
                        });
                        var targetLi = $(".swiper-active .timeli.active")
                        // targetLi[0].addEventListener('touchmove', function (e) {
                        //     e.preventDefault();
                        // }, false);

                        myScroll.on('scrollStart', function () {
                            echo.render()
                        });
                        myScroll.on('scrollEnd', function () {
                            echo.render()
                        });
                        targetLi.data("scrollEle" , myScroll);
                        echo.render()
                        //pis service
                        var ids = "";
                        $thisli.find(".time-content .flash-product").each(function (index, li) {
                            if (ids) {
                                ids += ("," + $(li).data("id"))
                            } else {
                                ids += $(li).data("id")
                            }

                        })
                        $thisli.parent().find(".flash-mask").remove()
                        if(ids){
                            $.ajax({
                                url: $("body").data("pis")+"/global/price",
                                type: 'get',
                                dataType: 'json',
                                traditional: true,
                                data: {productIds: ids},
                                success: function (pdata) {
                                    var productData = pdata.data;
                                    for (var i = 0; i < productData.length; i++) {
                                        var $product = $(".flash-product[data-id=" + productData[i].productId + "]");
                                        if (!parseInt(productData[i].stockStatus) && data.label != 0 && data.label != 2) {
                                            $product.append("<div class='stack-over'>抢光了</div>")
                                        }
                                        $product.find(".price em").html("￥"+productData[i].specialPrice)
                                        $product.find(".price del").html(productData[i].originPrice)

                                    }

                                }
                            })
                        }
                    },
                    error : function(){
                        $thisli.parent().find(".flash-mask").remove();
                        console.log("flash sale data error")
                    }
                });


            return false;

            })

            $ele.find(".timeli").each(function(index ,tl){
                var $tl = $(tl),
                    category = $(this).data("category"),
                    from = $(this).data("from"),
                    to = $(this).data("to"),
                    date = $(this).data("date");

                var fromMoment = moment( date + " " + from ),
                    nowMoment = moment(now),
                    toMoment="";
                if( !to  ){
                    toMoment = moment(date).add(1 , "d")
                }else{
                    toMoment = moment( date + " " + to )
                }

                if( fromMoment.diff(nowMoment) >0){
                    $tl.attr("data-label" , 0)
                    $tl.find(".flash-label").html("未开始")
                }
                if( nowMoment.diff(fromMoment) > 0 && toMoment.diff(nowMoment)>0 ){
                    $tl.attr("data-label" , 1)
                    $tl.find(".flash-label").html("疯抢中")
                }
                if( nowMoment.diff(fromMoment.add(30,"m"))>0 ){
                    $tl.attr("data-label" , 2)
                    $tl.find(".flash-label").html("已结束")
                }
                // if( nowMoment.diff(toMoment)>0 ){
                //     $tl.attr("data-label" , 2)
                //     $tl.find(".flash-label").html("已结束")
                // }

            })
            
            


            if( $ele.find(".timeli[data-label='1']").length ){
                var target = $ele.find(".timeli[data-label=1]"),
                    wrapper = target.closest('.swiper-wrapper'),
                    translateX=0,
                    swiperWidth = $ele.find(".swiper-wrapper").width(),
                    slide = target.closest('.swiper-slide'),
                    index = slide.index();
                wrapper.css("transform" , "translate3d("+(translateX-(index*swiperWidth))+"px, 0px, 0px)");
                if( !slide.next().length ){
                    $ele.find(".flash-button-next").hide()
                    $ele.find(".flash-button-prev").show()
                }else if( !slide.prev().length ){
                    $ele.find(".flash-button-prev").hide()
                    $ele.find(".flash-button-next").show()
                }else{
                    $ele.find(".flash-button-prev").show()
                    $ele.find(".flash-button-next").show()
                }

                wrapper.find('.swiper-slide').removeClass("swiper-active");
                slide.addClass("swiper-active")
                target.find(".day").trigger("touchstart")
            }else{
                $ele.find('.swiper-active .timeli').first().find(".day").trigger("touchstart")
            }
        })

    }


})