/**
 * Created by leo.Wang on 16/11/16.
 * 评论 comment
 */
if($('.recommend-comment-list').length){
	(function(touch){
		var comment = $('.recommend-comment-list');
		touch.on(".recommend-comment-list", "swipe", function(e) {
			e.stopPropagation();
			var elem = $(e.currentTarget);
			if("left" == e.direction){
				if($('.recommend-comment.active').next().length){
					swipeFunc.call($('.recommend-comment.active').next(),elem)
				} else {
					swipeFunc.call($('.recommend-comment').eq(0),elem)
				}
			}
			if("right" == e.direction){
				if($('.recommend-comment.active').prev().length){
					swipeFunc.call($('.recommend-comment.active').prev(),elem)
				}
				//  else {
				// 	swipeFunc.call($('.recommend-comment').eq(-1),elem)
				// }
			}
		});

		function swipeFunc(elem){
			this.addClass('active').siblings().removeClass('active');
			//var t = elem[0].style;
			//t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = 'translateX(-' + this.position().left + 'px)';
		}

		setInterval(function(){
			if($('.recommend-comment.active').next().length){
				swipeFunc.call($('.recommend-comment.active').next(),comment)
			} else {
				swipeFunc.call($('.recommend-comment').eq(0),comment)
			}
		},Number(comment.attr('data-interval')) || 5000);

	}(touch))
}


