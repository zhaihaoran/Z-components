var wuziqi = function(options){
	var me = this;
	//1为黑，2为白
	me.config = {
		color:1
	};
	//dom
	me.$board = $('.checkerboard');
	me.$piece = $('.chess_piece img');
	me.$black = $('#black',me.$piece);
	me.$white = $('#white',me.$piece);
	me.$clear = $('.button-group input');
	//parameter
	me.clickP = {
		x:0,
		y:0,
		color:''
	};

	me.clickState = 0;//选中状态
	me.clickPointArray = [];//所有点
	me.choosedArray = [];//已经选中的；
	//event
	me.init(options);
}
wuziqi.prototype = {

	init:function(options){
		var me = this;

		me.paper = new Raphael('checkerboard',800,800);
		me.drawChessBoard();

		me.config = $.extend(me.config , options || {});

		me.clickPointArray = me.caculateClickPosition();

		me.clickChessBoard();
		me.ChessBoardEvent();
	},

	drawChessBoard:function(){
		var me = this;

		me.paper.image("img/801.jpg",0,0,800,800);
		me.paper.rect(40,40,720,720).attr({
			'position':'absolute'
		});
		me.paper.path("M40 80L40 80");
		for (var row = 1; row < 18; row++){
			me.paper.path("M40"+ " " + 40 * (row + 1) + "L760" + " "  + 40 * (row + 1));
		}
		for(var col = 1; col < 18 ;col++){
			me.paper.path("M" + 40 * (col + 1) + " 40L " + 40 * (col + 1) + " "  + 760);
		}
		console.log("M"+99+ ' ' +2323)
	},

	clickChessBoard:function(){
		var me = this;

		me.$board.on('click.chessboard',function(e){
			me.clickP = {
				x:e.offsetX,
				y:e.offsetY,
				color:me.config.color
			}
			me.isSelectPoint();
			me.createChessPiece();
			me.chessBoardRules();

		})

		me.$board.on('hover.button',function(){

		})
	},

	isSelectPoint:function(){
		var me = this;

		for (var i = 0; i < me.clickPointArray.length; i++) {
            var currentPoint = me.clickPointArray[i];
            var xdiff = Math.abs(currentPoint.x - me.clickP.x);
            var ydiff = Math.abs(currentPoint.y - me.clickP.y);
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            //判断是否落在同一位置
        	var a = JSON.stringify(me.choosedArray);
        	var b = JSON.stringify(me.clickPointArray[i]);
            //半径为22
            if ((dir < 18) && (a.indexOf(b) < 0)) {
            	me.clickP = {
            		x:me.clickPointArray[i].x,
            		y:me.clickPointArray[i].y,
            	}
         		me.choosedArray.push(me.clickPointArray[i]);
                me.clickState = 1;
                break;
            } else{
            	me.clickState = 0;
            }
        }
	},

	caculateClickPosition:function(){
		var me = this;
		var CubeWidth = 40;
		var CubeOffset = {
			x:40,
			y:40
		}
		var Re = [];//clickPointArray

        for (var row = 0; row < 19; row++) {
            for (var col = 0; col < 19; col++) {
                var Point = {
                    x: (CubeOffset.x + col * CubeWidth),
                    y: (CubeOffset.y + row * CubeWidth)
                };
                Re.push(Point);
            }
        }
        return Re
	},
//对象排序,m为变化的数组，n为与之对应变化的数组
	objSort:function(m,n){
		var array1 = n;
    	var array2 = m;
        var temp = 0;
        var temp2="";
        for (var i = 0; i < array2.length; i++) {
            for (var j = 0; j < array2.length - i; j++) {
                if (array2[j] > array2[j + 1]) {
                    temp = array2[j + 1];
                    array2[j + 1] = array2[j];
                    array2[j] = temp;
                    temp2=array1[j+1];
                    array1[j+1]=array1[j];
                    array1[j]=temp2;
                }
            }
        }
        return obj
	},
//规则
	chessBoardRules:function(){
		var me = this;
		var black = [];
		var white = [];
		var point = {};

		$.extend(point,me.choosedArray[me.choosedArray.length - 1],{color:me.config.color});
		console.log(point)
		for(var i in me.choosedArray){
			var a = {}
			if(i % 2 == 0){
				black.push(me.choosedArray[i])
			} else{
				white.push(me.choosedArray[i])
			}
		}

		//选取最后点周围9*9的区域判断
		var ChessState = [];

		if (point.color == 0){//i为行，j为列
			ChessState = [];//一定记得要事先清空；
			for(var i = point.x - 160;i < point.x + 190;i = i + 40){
				ChessState[i] = [];
				for(var j = point.y - 160;j < point.y + 190;j = j + 40){
					ChessState[i][j] = 0;
					//判断子是否落在区域内
					for(var z in black){
						if((black[z].x == i) && (black[z].y == j)){
							ChessState[i][j] = 1;
						}
					}
				}
			}
		}
		else {
			ChessState = [];
			for(var i = point.x - 160;i < point.x + 190;i = i + 40){
				ChessState[i] = [];
				for(var j = point.y - 160;j < point.y + 190;j = j + 40){
					ChessState[i][j] = 0;
					//判断子是否落在区域内
					for(var z in white){
						if((white[z].x == i) && (white[z].y == j)){
							ChessState[i][j] = 1;
						}
					}
				}
			}
		}
		//胜负手逻辑
		//左上
		if((ChessState[point.x][point.y] == 1) && (ChessState[point.x-40*1][point.y-40*1] == 1) && (ChessState[point.x-40*2][point.y-40*2] == 1) && (ChessState[point.x-40*3][point.y-40*3] == 1) && (ChessState[point.x-40*4][point.y-40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//右下
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x+40*1][point.y+40*1] == 1) && (ChessState[point.x+40*2][point.y+40*2] == 1) && (ChessState[point.x+40*3][point.y+40*3] == 1) && (ChessState[point.x+40*4][point.y+40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//右上
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x+40*1][point.y-40*1] == 1) && (ChessState[point.x+40*2][point.y-40*2] == 1) && (ChessState[point.x+40*3][point.y-40*3] == 1) && (ChessState[point.x+40*4][point.y-40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//左下
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x-40*1][point.y+40*1] == 1) && (ChessState[point.x-40*2][point.y+40*2] == 1) && (ChessState[point.x-40*3][point.y+40*3] == 1) && (ChessState[point.x-40*4][point.y+40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//左横
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x-40*1][point.y] == 1) && (ChessState[point.x-40*2][point.y] == 1) && (ChessState[point.x-40*3][point.y] == 1) && (ChessState[point.x-40*4][point.y] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//右横
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x+40*1][point.y] == 1) && (ChessState[point.x+40*2][point.y] == 1) && (ChessState[point.x+40*3][point.y] == 1) && (ChessState[point.x+40*4][point.y] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//上竖
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x][point.y-40*1] == 1) && (ChessState[point.x][point.y-40*2] == 1) && (ChessState[point.x][point.y-40*3] == 1) && (ChessState[point.x][point.y-40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		}
		//下竖
		else if((ChessState[point.x][point.y] == 1) && (ChessState[point.x][point.y+40*1] == 1) && (ChessState[point.x][point.y+40*2] == 1) && (ChessState[point.x][point.y+40*3] == 1) && (ChessState[point.x][point.y+40*4] == 1)){
			if(point.color == 0){
				alert('black win')
			} else{
				alert('white win')
			}
			me.clearChessBoard();
		} else{
			return false;
		}

	},

	ChessBoardEvent:function(){
		var me = this;

		me.$clear.on('click',function(){
			me.clearChessBoard();
		})
	},
//清空棋盘
	clearChessBoard:function(){
		var me = this;

		me.paper.clear();
		//清空变量
		me.choosedArray = [];
		me.drawChessBoard();
	},


	createChessPiece:function(){
		var me = this;

		if(me.clickState != 0){
			if (me.config.color == 1){
				me.config = {
					'color':0
				};
				me.paper.image("img/black.png",me.clickP.x-16,me.clickP.y-16,32,32);
			} else{
				me.config = {
					'color':1
				};
				me.paper.image("img/white.png",me.clickP.x-16,me.clickP.y-16,32,32);
			}
		}
	}
}

var arr = new wuziqi({
	color:1
});//决定黑白先

