/**
 * Created by memebox on 16/10/14.
 */
$(function(){
    function loadHtml( nowpeople){
        var pstr = nowpeople+"",
            htmlPre = "<div class='copo'>目前已有<div class='box'>",
            html = "",
            htmlSuf="</div>人下单</div>";
        for( var i = 0 ; i <  pstr.length ; i++){
            html += "<span class='num'>"+pstr[i]+"</span>"
        }
        return htmlPre + html +htmlSuf;
    }
    if($(".people").length){
        $(".people").each(function(index , ele){
            var fromDate = $(ele).find('> .sou').data("from"),
                toDate = $(ele).find('> .sou').data("to"),
                peopleFrom = $(ele).find('> .sou').data("pfrom"),
                peopleTo = $(ele).find('> .sou').data("pto"),
                now = $("body").data("now"),
                diffNowtoFrom = moment(now).diff(moment(fromDate)),
                diffTotoNow = moment(toDate).diff(moment(now)),
                diffTotoFrom = moment(toDate).diff(moment(fromDate)),
                pdiff = peopleTo - peopleFrom;
            if( diffNowtoFrom < 0 || diffTotoNow < 0 || diffTotoFrom < 0 ||  pdiff < 0 ){
                $(ele).remove()
                return ;
            }
            var nowRate = diffNowtoFrom/diffTotoFrom;

            var nowPeople = Math.round(peopleFrom + (pdiff * nowRate))

            var mi = diffTotoNow/(peopleTo-nowPeople);

            $(ele).html( loadHtml(nowPeople) );

            var interval = setInterval(function(){
                nowPeople = ++nowPeople;

                $(ele).html(loadHtml(nowPeople))
                if( nowPeople >= peopleTo ){
                    $(ele).remove()
                    clearInterval(interval)
                }
            } , Math.round(mi))
        })

    }
})


