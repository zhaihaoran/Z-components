/**
 * iqidao Admin Common
 * ------------------
 */
define([
	"jquery",
	'dataTables',
	'bootstrap.switch',
	'select2',
	"adminLte",
	'editor-zh',
	'icheck',
	'waves',
	'velocity'
], function ($, AdminLTE) {

	// "use strict";
	var Common = function() {
		var me = this;

        me.fakeLoader();

		me.init();
		me.adminModal();
	}

	Common.prototype = {

		skins:[
			"skin-blue",
		    "skin-black",
		    "skin-red",
		    "skin-yellow",
		    "skin-purple",
		    "skin-green",
		    "skin-blue-light",
		    "skin-black-light",
		    "skin-red-light",
		    "skin-yellow-light",
		    "skin-purple-light",
		    "skin-green-light"
		],

		dataTableDefault:{
			"scrollX":true,
			"info": false,
			"paging": false,
			"searching": false,
			"oLanguage":{
				"sZeroRecords": "对不起，查询不到任何相关数据",
		      	"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
		      	"sInfoEmtpy": "找不到相关数据",
		      	"sInfoFiltered": "数据表中共为 _MAX_ 条记录)",
		      	"sProcessing": "正在加载中...",
		      	"sSearch": "搜索",
			}
		},

		init:function() {
			var me = this;

			var tmp = me.get('skin');
		    if (tmp && $.inArray(tmp, me.skins)) {
		      	me.change_skin(tmp);
		    }

		 //    //Add the change skin listener
			// $("[data-skin]").on('click', function (e) {
			// 	if ($(this).hasClass('knob')){
			// 		return;
			// 	}
			// 	e.preventDefault();
			// 	me.change_skin($(this).data('skin'));
			// });

			// //Add the layout manager
			// $("[data-layout]").on('click', function () {
			// 	me.change_layout($(this).data('layout'));
			// });

			$("[data-controlsidebar]").on('click', function () {
				me.change_layout($(this).data('controlsidebar'));
				var slide = !AdminLTE.options.controlSidebarOptions.slide;
				AdminLTE.options.controlSidebarOptions.slide = slide;
				if (!slide) {
					$('.control-sidebar').removeClass('control-sidebar-open');
				}
			});

			$("[data-sidebarskin='toggle']").on('click', function () {
				var sidebar = $(".control-sidebar");
				if (sidebar.hasClass("control-sidebar-dark")) {
					sidebar.removeClass("control-sidebar-dark");
					sidebar.addClass("control-sidebar-light");
				} else {
					sidebar.removeClass("control-sidebar-light");
					sidebar.addClass("control-sidebar-dark");
				}
			});

			$("[data-enable='expandOnHover']").on('click', function () {
				$(this).attr('disabled', true);
				AdminLTE.pushMenu.expandOnHover();
				if (!$('body').hasClass('sidebar-collapse')){
					$("[data-layout='sidebar-collapse']").click();
				}
			});

			me.resetOptions();

			// aside
			var $sidebarLi = $('.sidebar-menu .treeview');
			var $treeUrl = $('.treeview-menu li', $sidebarLi);

			$treeUrl.each(function(){
				if ($(this).data('name') === "active") {
					$(this).parents('.treeview').addClass('active');
				}
			});

		    me.dataTableConfig();
		    me.dateTimePickerConfig();
		   	me.recordScrollBarPosition();

		   	// tooltips 
		    $('.tooltips').tooltip();
		    // popovers
		    $('.popovers').popover();
		    // icheck
		    $('.icheck').iCheck({
				checkboxClass: 'icheckbox_flat-green',
      			radioClass: 'iradio_flat-green'
			})

			// load scrolllbar position
			var value = sessionStorage.getItem('pagePosition');
			$(window).scrollTop(value);
			// 
			me.slidenav();
			
		},

		// 节流函数 为了优化性能，确保times时间当函数多次触发时，函数只会并且必须执行一次

		//fun 要执行的函数
		//delay 延迟
		//time  在time时间内必须执行一次
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

		recordScrollBarPosition:function(){
			var me = this;
			// 记录滚动条位置 and 触发置顶
			$(window).on('scroll',me.throttle(function(){
				var location = $(this).scrollTop();
				var $rocket = $('.actGotop');

				sessionStorage.setItem('pagePosition',location);

				// if(location >= 100) {
				// 	$rocket.fadeIn(300);
				// } else {
				// 	$rocket.fadeOut(300);
				// }

				// $rocket.on('click',function(){
				// 	$('html').animate({
				// 		scrollTop:'0px'
				// 	},800);
				// })
			},500,1500));
		},

		dateTimePickerConfig:function() {
			var me = this;
			if($.fn.datetimepicker){
				$.fn.datetimepicker.dates['zh'] = {  
	                days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],  
	                daysShort:  ["日", "一", "二", "三", "四", "五", "六","日"],  
	                daysMin:    ["日", "一", "二", "三", "四", "五", "六","日"],  
	                months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
	                monthsShort:  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],  
	                meridiem:    ["上午", "下午"],  
	                today:       "今天"  
	   		 	};
	   		 	$.fn.datetimepicker.defaults = {
	   		 		'language':'zh'
	   		 	}
			}
		},

		dataTableConfig:function() {
			var me = this;

			// 设置插件通用配置
			$.extend(true,$.fn.dataTable.defaults,me.dataTableDefault);
			// 加true 为深度拷贝
		},

		resetOptions:function() {
			var me = this;

			if ($('body').hasClass('fixed')) {
				$("[data-layout='fixed']").attr('checked', 'checked');
			}
			if ($('body').hasClass('layout-boxed')) {
				$("[data-layout='layout-boxed']").attr('checked', 'checked');
			}
			if ($('body').hasClass('sidebar-collapse')) {
				$("[data-layout='sidebar-collapse']").attr('checked', 'checked');
			}
		},

		change_layout:function(cls) {
			$("body").toggleClass(cls);
			AdminLTE.layout.fixSidebar();
			//Fix the problem with right sidebar and layout boxed
			if (cls === "layout-boxed") {
				AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
			}
			if ($('body').hasClass('fixed') && cls === 'fixed') {
				AdminLTE.pushMenu.expandOnHover();
				AdminLTE.layout.activate();
			}
			AdminLTE.controlSidebar._fix($(".control-sidebar-bg"));
			AdminLTE.controlSidebar._fix($(".control-sidebar"));
		},

		store:function(name, val) {
			if (typeof (Storage) !== "undefined") {
				localStorage.setItem(name, val);
			} else {
				window.alert('Please use a modern browser to properly view this template!');
			}
		},

		get:function(name) {
			if (typeof (Storage) !== "undefined") {
				return localStorage.getItem(name);
			} else {
				window.alert('Please use a modern browser to properly view this template!');
			}
		},

		change_skin:function(cls) {
			var me = this;

			$.each(me.skins, function (i) {
				$("body").removeClass(me.skins[i]);
			});

			$("body").addClass(cls);
			me.store('skin', cls);
			return false;
		},

		modals:{
			// 自己写触发modal
			init:function(options,$init){
				var _stack = 0,
					_lastID = 0,
					_generateID = function () {
						_lastID++;
						return 'materialize-modal-overlay-' + _lastID;
					};

				var defaults = {
			        opacity: 0.5,
			        in_duration: 350,
			        out_duration: 250,
			        ready: undefined,
			        complete: undefined,
			        dismissible: true,
			        starting_top: '4%',
			        ending_top: '10%'
		      	};

		      	// Override defaults 
		      	options = $.extend(defaults,options);

				return $init.each(function(){
					var modal_id = $(this).data('target');
					var $modal = $(modal_id);

					var closeModal = function() {
						var overlayId = $modal.data('overlay-id');
						var $overlay = $('#' + overlayId);
						$modal.removeClass('open');
						// Enable scrolling
						$('body').css({
							overflow:'',
							width:''
						});

						$modal.find('.modal-close').off('click.close');
						$(document).off('keyup.modal' + overlayId);

						// 遮罩动画
						$overlay.velocity({opacity:0},{duration:options.out_duration,queue:false,ease:"easeOutQuart"});

						// Define Bottom Sheet animation
				          var exitVelocityOptions = {
				            duration: options.out_duration,
				            queue: false,
				            ease: "easeOutCubic",
				            // Handle modal ready callback
				            complete: function() {
				              $(this).css({display:"none"});

				              // Call complete callback
				              if (typeof(options.complete) === "function") {
				                options.complete.call(this, $modal);
				              }
				              $overlay.remove();
				              _stack--;
				            }
				          };
				          if ($modal.hasClass('bottom-sheet')) {
				            $modal.velocity({bottom: "-100%", opacity: 0}, exitVelocityOptions);
				          }
				          else {
				            $modal.velocity(
				              { top: options.starting_top, opacity: 0, scaleX: 0.7},
				              exitVelocityOptions
				            );
				          }
					}


					var openModal = function($trigger) {
						var $body = $('body');
						var oldWidth = $body.innerWidth();
						$body.css('overflow','hidden');
						$body.width(oldWidth);

						//如果modal的dom上已经有open的class的话 
						if($modal.hasClass('open')) {
							return;
						}
						var overlayId = _generateID();
						var $overlay = $('<div class="modal-overlay"></div>');
						lStack = (++_stack);

						// store a reference of the overlay
						$overlay.attr('id', overlayId).css('z-index', 1000 + lStack * 2);
						$modal.data('overlay-id', overlayId).css('z-index', 1000 + lStack * 2 + 1);
						$modal.addClass('open');
						$("body").append($overlay);

						if(options.dismissible){
							// 点击遮罩
							$overlay.click(function(){
								closeModal();
							});
							// Esc
							$(document).on('keyup.modal' + overlayId, function (e) {
								if (e.keyCode === 27) { // ESC key
									closeModal();
								}
							});
						}

						$modal.find(".modal-close").on('click.close',function(e){
							closeModal();
						})

						$overlay.css({ display : "block", opacity : 0 });

						$modal.css({
							display: "block",
							opacity: 0
						});

						$overlay.velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: "easeOutCubic"});
	          			$modal.data('associated-overlay', $overlay[0]);

	          			// Define Bottom Sheet animation
						var enterVelocityOptions = {
							duration: options.in_duration,
							queue: false,
							ease: "easeOutCubic",
							// Handle modal ready callback
							complete: function () {
								if (typeof (options.ready) === "function") {
									options.ready.call(this, $modal, $trigger);
								}
							}
						};
						if ($modal.hasClass('bottom-sheet')) {
							$modal.velocity({
								bottom: "0",
								opacity: 1
							}, enterVelocityOptions);
						} else {
							$.Velocity.hook($modal, "scaleX", 0.7);
							$modal.css({
								top: options.starting_top
							});
							$modal.velocity({
								top: options.ending_top,
								opacity: 1,
								scaleX: '1'
							}, enterVelocityOptions);
						}
					}

					// 页面初始化时先解绑
			        $(document).off('click.modalTrigger', 'a[href="#' + modal_id + '"], [data-target="' + modal_id + '"]');
			        $(this).off('openModal');
			        $(this).off('closeModal');

			        // 再重新绑定
			        $(document).on('click.modalTrigger', 'a[href="#' + modal_id + '"], [data-target="' + modal_id + '"]', function(e) {
			          options.starting_top = ($(this).offset().top - $(window).scrollTop()) /1.15;
			          openModal($(this));
			          e.preventDefault();
			        }); // done set on click

			        $(this).on('openModal', function() {
			          var modal_id = $(this).attr("href") || '#' + $(this).data('target');
			          openModal();
			        });

			        $(this).on('closeModal', function() {
			          closeModal();
			        });
				})
			},
			open: function () {
				$(this).trigger('openModal');
			},
			close: function () {
				$(this).trigger('closeModal');
			}
		},

		// 页面fakerloader
		fakeLoader:function(options) {

			var defaults = {
				timeToHide:2200,
				pos:'fixed',
				top:'0px',
				width:'100%',
				height:'100%',
				zIndex: '999',  // Default zIndex 
	            bgColor: '#3498db', // Default background color
	            spinner:'spinner4', // Default Spinner
	            imagePath:''
			};
			var config = $(defaults,options || {});
			var el = $('<div class="fl spinner4"></div>');

			var $dom = $('.fakeloader').append($(el));
			setTimeout(function(){
				$dom.fadeOut();
			},1200);
		},

		adminModal:function(options) {
			var me = this;
			// 选取出所有页面上的初始dom
			var data = $(document).find('[modal="true"]');

			if(data && (typeof options === 'object' || !options)){
				me.modals.init(options,data);
			}
		},

		// slidenav
		slidenav:function(options) {
			var defaults = {
				width:227,
				height:50,
				rebound_speed:300/* speed */
			};

			config = $.extend(defaults,options || {});

			var $sidebar = $('.sidebar-menu');

			var $line = $('.sidebar-line',$sidebar);
			var $term = $('.treeview',$sidebar);

			// 设置辅助线高度和宽度
			$line.height(config.height).width(config.width);

			$term.on('mouseenter',function(){
				var thisY = $(this).position().top;
				console.log($(this).position());
				$line.stop(true,true).animate({
					top:thisY
				},200);
				return false;
			}).end().on('mouseleave',function(){

				var $active = $('.treeview.active',$sidebar);
				var thisY;

				if($active.length > 0) {
					thisY = $active.position().top;
				} else {
					thisY = $(this).position().top;
				}

				$line.stop(true,true).animate({
					top:thisY
				},200);
				return false;
			})
		}
	}

	window.Common = new Common();

	// 工具对象写法
	var tools = (function(window,jQuery){

		"use strict";

		return {
			

			isElement:function(obj) {
				return !!(obj && obj.nodeType === 1);
			},

			// isArray
			isArray:function(a) {
				Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
			},


			// 判断字符串是否为空 
			isStrEmpty:function(str) {
				var me = this;

				if(str != null && str.length > 0) {
					return true
				} else {
					return false
				}
			},
			// 判断是否是中文
			isChine:function(str) {
				var me = this;

				var reg = /^([u4E00-u9FA5]|[uFE30-uFFA0])*$/;

				if(reg.test(str)){
		            return false;
		        }
		        return true;
			},
			// 进入全屏
			fullScreen:function(element) {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
				return true;
			},

			// cookie操作
			cookieUtil:{
				path:"/",
				domain:'www.iqidao.com',
				add:function(name,val){
					$.cookie(name, val, {expires: 7, path: this.path, domain: this.domain, secure: true});
				},
				remove:function(name,val) {
					$.cookie(name, null,{path: this.path, domain: this.domain});
				},
			 	get:function(name){
		         	$.cookie(name,{path: this.path, domain: this.domain});
			    }
			},
			// 清空
			emptyTextarea:function(strIds){

		        try{
		            var ids = strIds.trim(",").split(",");
		            $(ids).each(function(){
		                var obj = $(this.toString());
		                if(obj.length>0){
		                    $(obj).each(function(){
		                        $(this).empty();
		                        $(this).val("");
		                    });
		                }else{
		                    obj.empty();
		                    obj.val("");
		                }
		            });
		        } catch(ex){
		            if(PublicUtil.isDebug()){
		                throw new Error("js方法：【PublicUtil.emptyTextarea(strIds)】，error！");
		            }
	        	}
			},

			upload:function(option) {
				var me = this;

				function readFile() {
					var file = this.files[0];

					if(!/image\/\w+/.test(file.type)){
				        alert("请确保文件为图像类型");
				        return false;
				    }

				    var reader = new FileReader();
				    reader.readAsDataURL(file);

				    reader.onload = function(e){
				        option.result.innerHTML = '<img src="'+ this.result +'" alt=""/ class="img-responsive" id="image_show">';
				    };
				}

				if ( typeof FileReader === 'undefined' ){
				    option.result.innerHTML = "<p class='warn'>抱歉，你的浏览器不支持 FileReader,无法显示</p>";
				    option.input.setAttribute( 'disabled','disabled' );
				} else {
				    $(option.input).on('change',readFile);
				}
			},

			switchButton:function(namevalue,state){
				var $dom = $('[name="'+ namevalue +'"');

				$dom.bootstrapSwitch('destroy');
				if(state){ 
					$dom.bootstrapSwitch({
						state:state
					});
				}

				$dom.bootstrapSwitch();
			},

			formatDate:function (data) {
				var date = new Date(data * 1000);
				var y = date.getFullYear(), m = date.getMonth() + 1,
			        d = date.getDate(),  h = date.getHours(), 
		    	    minute = date.getMinutes();

				m = m < 10 ? '0' + m : m;  
			    d = d < 10 ? ('0' + d) : d;  
			    h = h < 10 ? ('0' + h) : h; 
		    	minute = minute < 10 ? ('0' + minute) : minute; 
		     	return y + '-' + m + '-' + d +' '+ h + ':' + minute;
			},

			formatDateDay:function(data) {
				var date = new Date(data * 1000);
				var y = date.getFullYear(), m = date.getMonth() + 1,d = date.getDate();
				return y + "年" + m + '月' + d + '日';
			},
			
			select2Ajax:function (dom,url,callback) {
				var $dom = $(dom);

				function formatRepo (repo) {
					if (repo.loading) {
						return repo.text;
					}

					var markup = '<div class="clearfix text-center ajaxSelect">' + repo.text + '</div>';

					return markup;
				}

				function formatRepoSelection (repo) {
					return repo.text;
				}

				$dom.select2({
					minimumInputLength: 1,
					width: "100%",
					maximumInputLength: 20,
					ajax: {
						url: "/admin001/" + url,
						dataType: 'json',
						delay: 250,
						data: function (params) {
							return {
								key: params.term,
							};
						},
						processResults: function (data) {
							var item;
							for (var i = 0; i < data.Data.length; i += 1) {
								item = data.Data[i];
								item.id = item.Id;
								item.text = item.Value;
							}
							return {
								results: data.Data
							};
						},
					},
					escapeMarkup: function (m) {
						return m;
					},
					templateResult: formatRepo,
					templateSelection: formatRepoSelection,
				});

				callback && callback($dom);
			}
		}

	}).call(window,$);

	window.tools = tools;
	return tools;
});
