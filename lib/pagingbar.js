var Pagingbar = function(cpage,totalnum,domID){

	var me = this;
	me.cpage = cpage;
	me.totalnum = totalnum;
	me.$dom = $('#'+domID);
	me.outstr = '';
	// me.$('.btn-default').on('click',{scope:this,contents:pagesa},this.onclick)

	me.render();
}
Pagingbar.prototype = {

	render:function(){
		var me = this;
		var count;
		if(me.totalnum<=10){
			for(count=1;count<=me.totalnum;count++){
				if(count!=me.cpage){
					me.outstr = me.outstr + "<li class='btn btn-default pages' data-num="+ count +" >"+ count +"</li>";
				}
				else{
					me.outstr = me.outstr + "<li class='btn btn-default active pages' data-num="+ count +">"+ count +"</li>";
				}
			}
		}
		if(me.totalnum>10){
			//当页码小于10--1~9时
			if(parseInt((me.cpage-1)/10) == 0){
				for(count=1;count<=10;count++){
					if(count!=me.cpage){
						me.outstr = me.outstr + "<li class='btn btn-default pages' data-num="+ count +" >"+ count +"</li>";
					}
					else{
						me.outstr = me.outstr + "<li class='btn btn-default active pages' data-num="+ count +" >"+ count +"</li>";
					}
				}
				me.outstr = me.outstr + "<li class='btn btn-default' role='group' id='right' data-num="+ count +" ><i class='fa fa-angle-right'></i></li>";
			}
			//页码在页尾处
			else if (parseInt((me.cpage-1)/10) == parseInt(me.totalnum/10)){
				me.outstr = me.outstr + "<li class='btn btn-default' role='group' id='left' data-num="+ (parseInt((me.cpage-1)/10)*10) +"><i class='fa fa-angle-left'></i></li>";
				//填充total最右边的数
				for(count=parseInt(me.totalnum/10)*10+1;count<=me.totalnum;count++){
					if(count!=me.cpage){
						me.outstr = me.outstr + "<li class='btn btn-default pages' data-num="+ count +">"+ count +"</li>";
					}
					else{
						me.outstr = me.outstr + "<li class='btn btn-default active pages' data-num="+ count +">"+ count +"</li>";
					}
				}
			}
			//页码在中间
			else {
				me.outstr = me.outstr + "<li class='btn btn-default'  id='left' data-num="+ (parseInt((me.cpage-1)/10)*10) +"><i class='fa fa-angle-left'></i></li>";
				for(count=parseInt((me.cpage-1)/10)*10+1;count<=parseInt((me.cpage-1)/10)*10+10;count++){
					if(count!=me.cpage){
						me.outstr = me.outstr + "<li class='btn btn-default pages' data-num="+ count +">"+ count +"</li>";
					}
					else{
						me.outstr = me.outstr + "<li class='btn btn-default active pages' data-num="+ count +">"+ count +"</li>";
					}
				}
				me.outstr = me.outstr + "<li class='btn btn-default'  id='right' data-num="+ count +"><i class='fa fa-angle-right'></i></li>";
			}
		}
		me.$dom.html('<ul class="btn-group" role="group" id="setpages" >'+ me.outstr +'</ul>' + '<span id="pageset">共 '+ me.totalnum +' 页 | 第 ' + me.cpage + ' 页<\/span>')
		// me.outstr = '';
		// console.log(me.$dom)
		//重新渲染清空dom之后需要重新绑定dom
		me.onclick();
	},

	onclick:function(){
		var me = this;
		$('.btn-default').on('click',function(e){
			me.cpage = $(this).data('num')
			// me.render();
			me.changeURL(me.cpage,'?page='+me.cpage);
			$(me).triggerHandler('ajax-send',me.cpage)
		})
	},

	update:function(cpage,totalnum){

		var me = this;
			me.cpage = cpage;
			me.totalnum = totalnum;

		me.render();
	},

	changeURL:function(page,url){
		window.history.pushState({page:page},'',url)
	},

}
