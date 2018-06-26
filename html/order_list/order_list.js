function closeWin(){
	summer.closeWin();
}
function nofind(_this,type){  
    src = "../static/mall/images/default_img.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	var ip = summer.getStorage("ip");
	var type = summer.pageParam.type;
	var enter = summer.pageParam.enter;
	var url;
	if(type=='inallocate'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/queryborrowmutiple';
		title = '借用方调拨单';
	}else if(type=='outallocate'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/querysuppliermutiple';
		title = '发货方调拨单';
	}else if(type=='send_back'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/querysuppliercompletemutiple';
		title = '发货方归还单';
	}else if(type=='borrow_back'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/queryborrowcompletemutiple';
		title = '借用方归还单';
	}else if(type=='prev_audit'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/queryauditmutiple';
		title = '待审核调拨单';
	}else if (type=='comment'){
		url = ip+'/ieop_base_mobile/mfrontmalltransferorder/queryevamutiple';
		title = '评价列表';
	}
	if(enter=='back'){
		//url =ip+'/ieop_base_mobile/mfrontmalltransferorder/querysuppliermutiple';
		//title = '已退回调拨单';
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/queryborrowmutiple';
		title = '已退回调拨单';
	}
	if(enter=='signIn'){
		url =ip+'/ieop_base_mobile/mfrontmalltransferorder/queryborrowmutiple';
		title = '待签收调拨单';
	}
	var viewModel = {
		orderList:ko.observableArray([]),
		type:ko.observable(type),
		title:ko.observable(title),
		status:ko.observable(),
		queryByStatus:function(status,data,event){
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			viewModel.status(status);
			queryOrder(status);
		},
		openDetail:function(mainId,type){
			summer.openWin({
                "id" : "order_detail",
                "url" : "html/order_detail/order_detail.html",
                "pageParam" : {
                    "mainId" : mainId,
                    "type":type,
                    enter:enter
                }
            });
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	$('#searchInput').on('keyup',function(e){
		if(e.keyCode==13){
			queryOrder(viewModel.status(),$(this).val());
			
		}
	})
	function queryOrder(status,kwd){
		var queryObj;
		if(type=='inallocate' || type=='outallocate' || type=='send_back' || type=='borrow_back' || enter=='back' || enter=='signIn'){
			queryObj = {queryStatus:status};
		}
		var p_conditions = status===undefined||status===''?{}:queryObj;
		if(type=='prev_audit'){
			p_conditions = {queryStatus:0};
		}
		if(kwd){
			p_conditions['queryString'] = kwd;
		}
		var page_params={"pageIndex":1,"pageSize":20};  //分页
	    var sortItem = {};
	    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	    p_async_post(url, enc_conditions,'queryBack');
		
	}
	var enter = summer.pageParam.enter;
	if(typeof(enter)=='string'){
		if(enter=='hasSend'){
			$('#hasSend').click();
		}else if(enter=='prevSend'){
			$('#prevSend').click();
		}else if(enter=='back'){
			viewModel.status(10);
			queryOrder(10);
		}
		else if(enter=='signIn'){
			viewModel.status(6);
			queryOrder(6);
		}
	}else{
		queryOrder();
	}
}
function queryBack(res){
	var ents = res.retData.ents;
	if(summer.pageParam.type=='prev_audit'){
		for(var i =0;i<ents.length;i++){
			ents[i].mallTDt = ents[i].createTime;
			ents[i].materialImgUrl = summer.getStorage("imgBaseUrl") + ents[i].materialImgUrl; 
		}
	}
	viewModel.orderList(ents);
}