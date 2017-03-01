$(function () {

	"use strict";

	var Terris = function (options) {
		var me = this;

		me.init(options);
	};

	Terris.prototype = {

		shape: [
			"0,1,1,1,2,1,3,1", //line
			"1,0,1,1,1,2,1,3", //nline
			"1,1,2,1,1,2,2,2", //square
			"0,0,0,1,0,2,1,2", //L
			"0,0,0,1,1,0,2,0", //L1
			"0,0,1,0,1,1,1,2", //L2
			"0,1,1,1,2,1,2,0", //L3
			"1,0,1,1,1,2,0,2", //nL
			"0,0,0,1,1,1,2,1", //n1L
			"0,0,0,1,0,2,1,0", //n2L
			"0,0,1,0,2,0,2,1", //n3L
			"0,0,1,0,1,1,2,1", //nz
			"0,2,0,1,1,1,1,0", //nz1
			"0,1,1,1,1,0,2,0", //z
			"1,0,1,1,2,1,2,2", //z1
			"0,2,1,2,1,1,2,2", //t
			"0,2,1,1,1,2,1,3", //t1
			"0,2,1,2,1,3,2,2", //t2
			"1,1,1,2,1,3,2,2", //t3
		],
		// classname: c掉落中红色，d固定灰色，f，总区域
		init: function (options) {
			var me = this;

			var defaults = {
				el:"#box",
				shape:"",
				// 单位：格
				areaX:10,
				areaY:20,
				x:3,
				y:3
			};

			me.options = $.extend(defaults, options || {});

			// 创建方块cube
			me.divs = [create("div", c), create("div", c), create("div", c), create("div", c)];
			me.shape = options.shape ? options.shape : me.shape[Math.floor(Math.random()*(shapes.length))];
			me.generateCube();

			me.render();
			me.fieldInit();
		},

		render:function(){
			var me = this;

			me.c = c ? c : "c";
			//cube离边界的距离
			me.positon_x = options.x;
	        me.positon_y = options.y;
		},
		// 生成cube
		generateCube:function(){
			var me = this;

			me.divs.forEach(function(el, i){
				//i 表示 每个元素代表的dom,j表示每个index序列
				el.css('left',me.shape[i*2]*20 + me.positon_x + x*20 + 'px');
				el.css('top',me.shape[i*2+1]*20 + me.positon_y + y*20 + 'px');
			});
		},

		cubeReset:function(){
			var me = this;

			me.x = me.y = 0;
			me.divs = [create('c'),create('c'),create('c'),create('c'),];

			var random = Math.floor(Math.random()*6);
			var randomShape = shapes[Math.floor(Math.random()*(shapes.length))];
			me.x = random;
			me.show(randomShape,random,0);
		},

		fieldInit:function(){
			var me = this;
			// area
			me.$field = me.createCube("f");
			me.$field.width(me.options.areaX * 10).height(me.options.areaY * 10);
		},

		// 消行
		findFull:function(){
			var me = this;
			for (var i = 0; i < me.options.areaY ; i++) {
				var cubeNum = 0;
				for (var j = 0; j < me.options.areaX; j++) {
					cubeNum += me[i * me.options.areaX + j] ? 1 : 0;
				}
				if (cubeNum == this.width) {
					this.removeLine(l);
				}
			}
		},
		// 消行
		removeLine:function() {
			var me = this;

			for (var i = 0; i < me.options.areaX ; i++) {
				document.body.removeChild(this[line * this.width + i]);
			}
			// 	var cubeNum = 0;
			// 	for (var j = 0; j < me.options.areaX; j++) {
			// 		cubeNum += me[i * me.options.areaX + j] ? 1 : 0;
			// 	}
			// 	if (cubeNum == this.width) {
			// 		this.removeLine(l);
			// 	}
			// }
		},
		// 创建原子
		create: function (className) {
			var me = this;

			var $el = $('<div class=' + className + '>').appendTo($(options.el));
			return $el;
		},
	};
});