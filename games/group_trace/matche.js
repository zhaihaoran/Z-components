var BattleChart = function(options) {
	var me = this;
	//ajaxdata
	me.config = {
		rounds_1:[
			{
				name:"王大宝",
				msg:"世界冠军"
			},
			{
				name:"赵大锤",
				msg:"爱棋道特战队"
			},
			{
				name:"李大炮",
				msg:"4D定式班"
			},
			{
				name:"赵大锤",
				msg:"5k定式班"
			},
			{
				name:"赵大锤",
				msg:"5k定式班"
			},
			{
				name:"赵大锤",
				msg:"5k定式班"
			},
			{
				name:"赵大锤",
				msg:"5k定式班"
			},{
				name:"赵大锤",
				msg:"5k定式班"
			},{
				name:"赵大锤",
				msg:"5k定式班"
			},{
				name:"赵大锤",
				msg:"5k定式班"
			},
			
		],
		rounds_2:[{
				name:"王大宝",
				msg:"世界冠军"
			},
			{
				name:"赵大锤",
				msg:"爱棋道特战队"
			}],
		rounds_3:[{
				name:"王大宝",
				msg:"世界冠军"
			},
			{
				name:"胖大海",
				msg:"爱棋道特战队"
			}],
		rounds_4:[{
				name:"钱多多",
				msg:"世界冠军"
			},
			{
				name:"赵大锤",
				msg:"爱棋道特战队"
			}],
		rounds_5:[{
				name:"钱多多",
				msg:"世界冠军"
			},{
				name:"钱多多",
				msg:"世界冠军"
			}],
		rounds_6:[{
			name:"钱多多",
			msg:"世界冠军"
		}],
		id:"matches",
		title:"爱棋道第一次武道大会",
	};
	//event
	me.init();
};

BattleChart.prototype = {

	//基础框架
	BaseHTMLStruc:  [
		'<div class="matched-dom">',
			'<div class="match-heading">爱棋道第一次武道大会</div>',
			'<div id="rounds"></div>',
			'<div id="members"></div>',
		'</div>'
	].join(''),


	init:function(options){
		var me = this;

		console.log(me.BaseHTMLStruc);

		$(me.BaseHTMLStruc).appendTo($('#' + me.config.id));

		me.config = $.extend(me.config , options || {
			total:me.config.rounds_1.length
		});

		me.render();
		
	},
	render:function() {
		var me = this;
		//cube总人数
		me.cubeNums = me.renderRules(me.config.total);
		//处理空数组
		me.config.rounds_1 = me.handleEmptyToFill(me.cubeNums,me.config.rounds_1);
		me.config.rounds_2 = me.handleEmptyToFill(me.cubeNums/2,me.config.rounds_2);
		me.config.rounds_3 = me.handleEmptyToFill(me.cubeNums/4,me.config.rounds_3);
		me.config.rounds_4 = me.handleEmptyToFill(me.cubeNums/8,me.config.rounds_4);
		//总轮数 其中math.log2是以2为底的对数
		me.roundNums = Math.log2(me.cubeNums) + 1; 
		//渲染轮数
		me.renderRoundsStruc(me.roundNums);
		//根据数目渲染出模板
		me.renderStruc(me.cubeNums,me.roundNums);
	},
	//划线
	drawLines:function(rounds,className) {
		var me = this;
		//dom结构
		var dom = $('.'+ className)[0];
		//去除第一个字母取值判断是奇偶数
		var num = parseInt(className.substring(1),10);

		//svg宽度固定为70，高度不固定
		me.svglinesWidth = 70;
		//判断是否为最后一个元素  math.pow(x,y) 返回一个x的y次幂
		if (Math.pow(2,rounds)/me.cubeNums>1) {
			return false;
		}


		switch (rounds) {
			case 1: 
				var r = Raphael(dom,me.svglinesWidth,64);
				// console.log(r.canvas);//dom结构
				r.canvas.style.position = 'absolute';
				r.canvas.style.right = '-50px';
				//偶数path
				if(num%2===0){
					r.canvas.style.top = '-28px';
					r.path("M0 45L40 45V4H70").attr({
						'stroke-width':'2px'
					});
				} else {
				//奇数path
					r.canvas.style.top = '0';
					r.path("M0 18L40 18V62H70").attr({
						'stroke-width':'2px'
					});
				}
				break;
			case 2: 
				var m = Raphael(dom,me.svglinesWidth,106);
				m.canvas.style.position = 'absolute';
				m.canvas.style.right = '-50px';
				//偶数path
				if(num%2===0){
					m.canvas.style.top = '-70px';
					m.path("M0 88L40 88V0H70").attr({
						'stroke-width':'2px'
					});
				} else {
				//奇数path
					m.canvas.style.top = '0';
					m.path("M0 18L40 18V102H70").attr({
						'stroke-width':'2px'
					});
				}
				break;
			case 3: 
				var n = Raphael(dom,me.svglinesWidth,195);
				n.canvas.style.position = 'absolute';
				n.canvas.style.right = '-50px';
				//偶数path
				if(num%2===0){
					n.canvas.style.top = '-159px';
					n.path("M0 176L40 176V0H70").attr({
						'stroke-width':'2px'
					});
				} else {
				//奇数path
					n.canvas.style.top = '0';
					n.path("M0 18L40 18V186H70").attr({
						'stroke-width':'2px'
					});
				}
				break;
			case 4: 
				var t = Raphael(dom,me.svglinesWidth,370);
				t.canvas.style.position = 'absolute';
				t.canvas.style.right = '-50px';
				//偶数path
				if(num%2===0){
					t.canvas.style.top = '-334px';
					t.path("M0 352L40 352V14H70").attr({
						'stroke-width':'2px'
					});
				} else {
				//奇数path
					t.canvas.style.top = '0';
					t.path("M0 18L40 18V368H70").attr({
						'stroke-width':'2px'
					});
				}
				break;
			case 5:
				var z = Raphael(dom,me.svglinesWidth,720);
				z.canvas.style.position = 'absolute';
				z.canvas.style.right = '-50px';
				//偶数path
				if(num%2===0){
					z.canvas.style.top = '-682px';
					z.path("M0 700L40 700V14H70").attr({
						'stroke-width':'2px'
					});
				} else {
				//奇数path
					z.canvas.style.top = '0';
					z.path("M0 18L40 18V708H70").attr({
						'stroke-width':'2px'
					});
				}
				break;
		}


	},

	renderRoundsStruc:function(m) {
		var me = this;

		for (var i=1;i<m+1;i+=1) {

			$('<div class="round-cube">').html("第" + i + "轮").appendTo($('#rounds'));
		}
	},

	handleEmptyToFill:function(num,ary) {
		//num 为每轮的人数 ary为传入需要处理的数组
		var array = ary;

		for (var i=0;i<num;i+=1) {
			if (!array[i]) {
				array[i] = {
					name: "",
					msg: "轮空"
				};
			} else {
				array[i] = array[i];
			}
		}

		return array;
	},

	renderStruc:function(n,m) {
		var me = this;

		for (var t=1;t<m+1;t+=1) {
			var dom = $('<div class="col-list cl-' + t + '">').appendTo($('#members'));
		}
		//第一个list里
		for (var i=1;i<me.cubeNums+1;i+=1) {
			$('<div class="cube t'+ i + '"><div class="c-text">'+ me.config.rounds_1[i-1].name + '  ' + me.config.rounds_1[i-1].msg +'</div></div>').appendTo($('.col-list.cl-1'));
			me.drawLines(1,'t'+i);
		}
		//第二个list
		for (var j=1;j<me.cubeNums/2+1;j+=1) {
			$('<div class="cube j j'+ j +'"><div class="c-text">'+ me.config.rounds_2[j-1].name + '  ' + me.config.rounds_2[j-1].msg +'</div></div>').appendTo($('.col-list.cl-2'));
			me.drawLines(2,'j'+j);
		}

		if(me.isContinueRender(me.cubeNums/4)) {
			//第三个list
			for (var k=1;k<me.cubeNums/4+1;k+=1) {
				$('<div class="cube k k'+ k +'"><div class="c-text">'+ me.config.rounds_3[k-1].name + '  ' + me.config.rounds_3[k-1].msg +'</div></div>').appendTo($('.col-list.cl-3'));
				me.drawLines(3,'k'+k);
			}

			if(me.isContinueRender(me.cubeNums/8)) {
				//第四个list
				for (var l=1;l<me.cubeNums/8+1;l+=1) {
					$('<div class="cube l l'+ l +'"><div class="c-text">'+ me.config.rounds_4[l-1].name + '  ' + me.config.rounds_4[l-1].msg +'</div></div>').appendTo($('.col-list.cl-4'));
					me.drawLines(4,'l'+l);
				}

				if(me.isContinueRender(me.cubeNums/16)) {
					//第五个list
					for (var o=1;o<me.cubeNums/16+1;o+=1) {
						$('<div class="cube o o'+ o +'"><div class="c-text">'+ me.config.rounds_5[o-1].name + '  ' + me.config.rounds_5[o-1].msg +'</div></div>').appendTo($('.col-list.cl-5'));
						me.drawLines(5,'o'+o);
					}

					if(me.isContinueRender(me.cubeNums/32)) {
						//第六个list ---撑死了估计就6轮,优化为递归
						for (var p=1;p<me.cubeNums/32+1;p+=1) {
							$('<div class="cube p p'+ p +'"><div class="c-text">'+ me.config.rounds_6[p-1].name + '  ' + me.config.rounds_6[p-1].msg +'</div></div>').appendTo($('.col-list.cl-6'));
						}
						
					}
				}
			}
		}
		
	},

	isContinueRender:function(num) {
		var me = this;

		if(num<1) {
			return false;
		}
		return true;
	},

	renderRules:function(num) {
		var me = this;
		var rendernum;

		if (num<=64&&num>32) {
			rendernum = 64;
		} else if(num<=32&&num>16) {
			rendernum = 32;
		} else if(num<=16&&num>8) {
			rendernum = 16;
		} else if(num<=8) {
			rendernum = 8;
		}

		return rendernum;
	},
};


var aa = new BattleChart();

/*  options -- format --  */
/* 	var options = {
  		personMsg :  [
			{
				name : "赵三",
				msg ："爱棋道一段"
			},
			{
				name : "王四",
				msg : "爱棋道特战队"
			}
  		]
	}
*/