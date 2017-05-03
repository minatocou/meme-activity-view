/**
 * Created by memebox on 16/11/17.
 */
$(".cat-ul").each(function( el,ul ){
    var from = $(ul).data("from"),
        to = $(ul).data("to"),
        now = $("body").data('now');

    if( from && to ){
        if( moment(from).diff(moment(now)) > 0){
            $(ul).find('.changeColor').css({color:'#666'})
        }else{
            $(ul).find(".special-price").remove()
            $(ul).find(".vhr").remove()
        }
    }
})

if($(".cat.list").length){
    $(".cat.list").each(function(index,ele){
        var fromtime = $(ele).data("fromtime"),
            totime = $(ele).data("totime"),
            now = $("body").data('now');
        if(fromtime && totime ){
            if( moment(now).diff(moment(fromtime)) <0  || moment(now).diff(moment(totime)) >0){
                $(ele).remove()
            }
        }
    })
}