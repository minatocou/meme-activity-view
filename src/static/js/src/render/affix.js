/**
 * Created by memebox on 16/10/27.
 */
$(function(){
    if( $(".bottomfix").length ){
        var src = $(".bottomfix").data("src");
        $(".render_container").append("<img src="+src+" class='vhidden'/>")
    }
    if( $(".topfix").length ){
        var $dom =  jQuery('body');
        var src = $(".topfix").data("src");
        var top;


        $(window).on('touchstart touchmove touchend scroll' ,function(){
            var scrollTop = $dom.scrollTop();

            if( !$(".topfix").hasClass("fixed") ){
                if( $(".topfix").offset() ){
                    top = $(".topfix").offset().top;
                }else{
                    top = 0;
                }

            }

            if( scrollTop > top ){
                $(".topfix").addClass("fixed")
                $(".topfix").next().removeClass("hide")
            }else{
                $(".topfix").removeClass("fixed")
                $(".topfix").next().addClass("hide")
            }
        })
        $(window).scroll()

    }
    
})