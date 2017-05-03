/**
 * Created by memebox on 16/12/22.
 */
!function(){
    var clickOrTouch = "ontouchend" in window ? "touchend" : "click",
        isMoving = !1;
    $("#liveVideo, .pause, .pause-wrap").on(clickOrTouch , function(event){
        var e = event || window.event
        if( e.stopPropagation() , !isMoving ){
            var video = document.getElementById("liveVideo");
            if(video.paused){
                video.play();
                $(".videobg").remove();
                video.style.background = "#000";
                $(".pause").hide()
            }else{
                video.pause();
                $(".pause").show();
            }
        }
        isMoving = !1
    })
    $("#liveVideo, .pause, .pause-wrap").on("touchmove", function () {
        isMoving = !0;
        console.log("moving")
    })
}()