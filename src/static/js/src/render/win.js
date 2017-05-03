/**
 * Created by memebox on 16/11/2.
 */
$(function(){

    if($(".win-type").length && $(".win-type > .win-opt").length){
        var info = $(".win-opt"),
            si,
            flag=true;

        var html = "",
            target;
        for(var i=0 ; i < info.length ; i++){
            var from = moment($(info[i]).data("from")),
                to = moment($(info[i]).data("to")),
                now = moment($("body").data("now"))
            if( now.diff(from) >= 0 && to.diff(now)>=0 ){
                target = $(info[i]);
                break;
            }

        }
        if(target ){
            target.html(template('winTpl',{items : JSON.parse(target.attr("data-csv"))}))
            target.addClass("active")
        }

        $(".win-type").fadeIn()
        
        var intervalRun = function(){
            si = setInterval(function(){
                var target = $(".win-opt.active > .win-wrapper:visible");
                $(".win-type").fadeOut()

                setTimeout(function(){
                    $(".win-type").fadeIn()
                    if( target.next().length ){
                        target.hide();
                        target.next().show()

                    }else{
                        target.hide();
                        $(".win-opt.active > .win-wrapper").first().show()
                    }
                } , 2000)
            },7000)
        }
        intervalRun()
        $(".win-type").click(function(){
            var obj={} ,
                href = $(".win-type").data("url");
            if(appVer.androidVer()>=400 || appVer.iosVer()>=400 || appVer.iosAlias() >=400){
                var obj ={
                    domain:"h5page",
                    action:"to_h5page",
                    data : {
                        title : "",
                        url : href,
                        image_url : "http://avatar.cn.memebox.com/avatar/2016/11/4/5b5c2b71-f04c-42ad-b96f-84a06ab9205a.png"
                    }
                }

                href = 'memebox://'+encodeURIComponent(JSON.stringify(obj));

            }
            window.location.href=href;
        })
        $(".win-type").on("click" , ".win-close" , function(){
            if( flag ){
                clearInterval(si);
                $(".win-type").fadeOut(function(){
                    $(".win-hook").fadeIn()
                });
                flag = false;

            }
            
            
            return false;
        })
        $(".win-hook").on("click" , function(){
            $(".win-hook").fadeOut(function(){
                $(".win-type").fadeIn();
            })
            intervalRun()
            flag = true
        })
    }
})