/**
 * Created by memebox on 16/10/19.
 */
if($('.benefits-type').length){
    $('.benefits-type').each(function(index, ele){
        var shareId = $(ele).data("id");
        var fromDate = $(ele).data("from"),
            toDate = $(ele).data("to"),
            now = $("body").data("now"),
            nowDiffTo = moment(now).diff(moment(toDate)),
            fromDiffNow = moment(fromDate).diff(moment(now));



        //未开始
        if( fromDiffNow > 0 ){
            $(ele).find(".benefitsBeforeImg").addClass('hide');
            $(ele).find(".benefitsAfterImg").addClass('hide');
            $(ele).attr("data-status" , 0)
        }
        //已结束
        if( nowDiffTo > 0 ){
            $(ele).find(".benefitsBeforeImg").addClass('hide');
            $(ele).find(".benefitsAfterImg").addClass('hide');
            $(ele).attr("data-status" , 2)
        }
        //已开始
        if( fromDiffNow <= 0 && nowDiffTo <= 0 ){
            if(localStorage.getItem(shareId)){
                $(ele).find(".benefitsBeforeImg").addClass('hide');
                $(ele).find(".benefitsAfterImg").removeClass('hide');
            }else{
                $(ele).find(".benefitsBeforeImg").removeClass('hide');
                $(ele).find(".benefitsAfterImg").addClass('hide');
            }
            $(ele).attr("data-status" , 1)
        }


    })
}