(function (window, $) {

	"use strict";

	var Loader = function(options) {
		var me = this;
		options = $.extend({
			/*default*/
			el:".lazyloader"
		}, options || {});
		me.init(options);
	};

	Loader.prototype = {

		init:function(options) {
			var me = this;
			var $container = $(options.el);
			
			// 可以拿到外面去,可以优化
			$(document).ready(function(){
				me.checkImgTop($container,true);
			});

			$(window).on('scroll',me.throttle(function(){
				// 每滚动一次检查一次
				me.checkImgTop($container);
				// 延迟200ms,其中500ms内最多一次
			},200,500));
		},

		checkImgTop:function(domList,isFirst) {
			var me = this;

			var scrollHeight,windowHeight;
			scrollHeight = $(window).scrollTop() || 0;
			windowHeight = $(window).height();
			isFirst = isFirst || false;

			domList.each(function(index,el){
				// if ((typeof $(el).attr('src') === 'undefined') && !isFirst) {
				// 	return false;
				// }
				var top = $(el).offset().top;
				if( top < windowHeight + scrollHeight) {
					me.loadPicture(el);
				}
			});

		},
		// 加载图片
		loadPicture:function(dom) {
			var me = this;

			var src = $(dom).data('src');
			/* ajax */
			$(dom).attr('src',src);
		},

		// 节流器
		throttle:function(fun, delay, time){
			var timeout,startTime = new Date();
		    // 最终产生一个新函数，加了延迟和time
		    return function() {
		        var context = this,
		            args = arguments,
		            curTime = new Date();
		        clearTimeout(timeout);
		        // 如果达到了规定的触发时间间隔，触发 handler
		        if (curTime - startTime >= time) {
		            fun.apply(context, args);
		            startTime = curTime;
		            // 没达到触发间隔，重新设定定时器
		        } else {
		            timeout = setTimeout(fun, delay);
		        }
		    };
		},
	};

	window.Loader = Loader;
	return Loader;
}(window, jQuery));