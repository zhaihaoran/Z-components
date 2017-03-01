var canvasPalace = function(id,options){
	var me = this;
	//dom
	me.$palace = $('#'+id);
	//parameters
	me.config = {
		'R':26,
		'OW':400,
		'OH':320,
		'OffsetX':30,
		'OffsetY':30,
		'password':[1,2,3,6,5,4,7,8,9]
	};
	me.PointLocationArr = [];
	me.init(options);
};
canvasPalace.prototype = {

	init:function(options){
		var me = this;

		me.config = $.extend(me.config , options || {});
		me.render();
	},

	CaculateNinePointLotion:function(diffX, diffY){
		var me = this;
		var Re = [];
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var Point = {
                    X: (me.config.OffsetX + col * diffX + ( col * 2 + 1) * me.config.R),
                    Y: (me.config.OffsetY + row * diffY + (row * 2 + 1) * me.config.R)
                };
                Re.push(Point);
            }
        }
        console.log(Re);
        return Re;//9个点的位置坐标
	},
	render:function(){
		var me = this;

		jQuery(document).ready(function($) {
			//这个为网页可见窗口的宽度
			var palace = me.$palace[0];
			console.log(palace);
			me.config.OW = document.body.offsetWidth;
			console.log(me.config.OW);
			//定义canvas宽高
			palace.width = me.config.OW;
			palace.height = me.config.OH;

			var cxt = palace.getContext("2d");
			//两个圆之间的外间距
			var X = (me.config.OW - 2 * me.config.OffsetX - me.config.R * 2 * 3) / 2;
			var Y = (me.config.OH - 2 * me.config.OffsetY - me.config.R * 2 * 3) / 2;

			me.PointLocationArr = me.CaculateNinePointLotion(X, Y);

			me.InitEvent(me.$palace,cxt);
			////OW=2*offsetX+R*2*3+2*X
			me.draw(cxt, me.PointLocationArr, [],null);
		});
	},
	draw:function(cxt,_PointLocationArr,_LinePointArr,touchPoint,LineColor){
		var me = this;

		if (_LinePointArr.length > 0) {
            cxt.beginPath();
            for (var i = 0; i < _LinePointArr.length; i++) {
                var pointIndex = _LinePointArr[i];
                cxt.lineTo(_PointLocationArr[pointIndex].X, _PointLocationArr[pointIndex].Y);
            }
            cxt.lineWidth = 10;
            cxt.strokeStyle = LineColor || "#627eed";
            cxt.stroke();
            cxt.closePath();
            if(touchPoint!==null)
            {
                var lastPointIndex=_LinePointArr[_LinePointArr.length-1];
                var lastPoint=_PointLocationArr[lastPointIndex];
                cxt.beginPath();
                cxt.moveTo(lastPoint.X,lastPoint.Y);
                cxt.lineTo(touchPoint.X,touchPoint.Y);
                cxt.stroke();
                cxt.closePath();
            }
        }
        
        for (var j = 0; j < _PointLocationArr.length; j++) {
            var Point = _PointLocationArr[j];
            cxt.fillStyle = "#627eed";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, me.config.R, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            //通过绘制2个圆来实现圆环
            cxt.fillStyle = "#ffffff";
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, me.config.R - 3, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            //包含有经过点时
            if(_LinePointArr.indexOf(j)>=0)
            {
                cxt.fillStyle = LineColor || "#627eed";
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, me.config.R -16, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
            }

        }
	},
	IsPointSelect:function(touches,LinePoint){
		var me = this;

        // console.log(LinePoint)
		for (var i = 0; i < me.PointLocationArr.length; i++) {
            var currentPoint = me.PointLocationArr[i];
            var xdiff = Math.abs(currentPoint.X - touches.pageX);
            var ydiff = Math.abs(currentPoint.Y - touches.pageY);
            var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            //math.pow返回x的y次幂；
            //dir返回是离圆心的直接距离
            // if (LinePoint.join('').indexof(i)>-1){
            // 	alert('数字')
            // }
            if (dir < me.config.R ) {
                if(LinePoint.indexOf(i) < 0){ LinePoint.push(i);}
                break;
            }
        }
	},
	InitEvent:function(canvasContainer,cxt){
		var me = this;

		var LinePoint = [];
        canvasContainer.on("touchstart", function (e) {

        	var touches = e.originalEvent.targetTouches[0];
        	//touch事件获取坐标的写法
        	//原生写法里直接用addEventListenner，e.touches[0]，可以直接获得触碰点坐标
        	//jquery写法等同如上
            me.IsPointSelect(touches,LinePoint);

        }).on("touchmove", function (e) {

            e.preventDefault();

            var touches = e.originalEvent.targetTouches[0];

            me.IsPointSelect(touches,LinePoint);
            cxt.clearRect(0,0,me.config.OW,me.config.OH);
            me.draw(cxt,me.PointLocationArr,LinePoint,{X:touches.pageX,Y:touches.pageY});

        }).on("touchend", function (e) {
        	var end = [];//密码对比后储存结果
        	var password = [];//用户输入的密码

            for(var i = 0;i<LinePoint.length;i++){
            	password[i] = LinePoint[i]+1;
            }
            console.log(password);
           	for(var j = 0;j<me.config.password.length;j++){
           		if(me.config.password[j]==password[j]){
           			end.push('1');
           		}
           		else{
           			end.push('0');
           		}
           	}
           	//开始判断
           	if(password.length<4){
           		cxt.clearRect(0,0,me.config.OW,me.config.OH);
	            me.draw(cxt,me.PointLocationArr,LinePoint,null,'#ff0000');
           		alert('密码至少要4位');
           	}
           	else if((end.join('').indexOf('0')>-1) && (password.length>3)){
           		cxt.clearRect(0,0,me.config.OW,me.config.OH);
	            me.draw(cxt,me.PointLocationArr,LinePoint,null,'#ff0000');
           		alert('密码错误');
           	}
           	else{
	            cxt.clearRect(0,0,me.config.OW,me.config.OH);
	            me.draw(cxt,me.PointLocationArr,LinePoint,null,'#00ff00');
           		alert('密码正确');
           	}
            LinePoint=[];
			// alert("密码结果是："+LinePoint.join("->"));

        });
	},
};



