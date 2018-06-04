function closeWin(){
	summer.closeWin();
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	var viewModel = {
		openWin:function(winId){
			summer.openWin({
                "id" : winId,
                "url" : "html/"+winId+"/"+winId+".html",
                "pageParam" : {
                    type:summer.pageParam.type,
                    mainId:summer.pageParam.mainId
                }
            });
		},
		openList:function(type){
						summer.openWin({
							"id" :"order_list",
					        "url" : "html/order_list/order_list.html",
					        "pageParam" : {
					            type:type
					        },
					        "animation":{
							    type:"none", //动画类型（详见动画类型常量）
							    subType:"from_right", //动画子类型（详见动画子类型常量）
							    duration:0 //动画过渡时间，默认300毫秒
					        },
						})
					},
	}
	ko.applyBindings(viewModel);
}