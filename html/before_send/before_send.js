function closeWin(){
	summer.closeWin();
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	var ip = summer.getStorage("ip");
	var options = summer.pageParam.options
	var viewModel = {
		type:ko.observable(0),
		pingCode:ko.observable(""),
		logisticComCode:ko.observable("youzhengguonei"),
		logistiCode:ko.observable(""),
		changeType:function(type){
			viewModel.type(type);
		},
		confirmSend:function(){
			if(!viewModel.pingCode()){
				summer.toast({
                     "msg" : "请填写凭证号" 
                })
                return;
			}
			if(viewModel.type()==0){
				if(!$("#logisticsCompany").find("option:selected").text()){
					summer.toast({
	                     "msg" : "请填写物流公司" 
	                })
	                return;
				}
				if(!viewModel.logistiCode()){
					summer.toast({
	                     "msg" : "请填写物流单号" 
	                })
	                return;
				}
				var info = {};
				info['mallCompany'] = $("#logisticsCompany").find("option:selected").text();;
				info['mallCompanyCode'] = viewModel.logisticComCode();
				info['mallCode'] = viewModel.logistiCode();
				info['voucherCode'] = viewModel.pingCode();
				info['id'] = summer.pageParam.options.id;
				info['status'] = summer.pageParam.options.status;
				
			}else{
				var info = {};
				info['voucherCode'] = viewModel.pingCode();
				info['id'] = summer.pageParam.options.id;
				info['status'] = summer.pageParam.options.status;
			}
			var bb = p_params_con_dataj_enc(info);
    		p_async_post(ip+'/ieop_base_mobile/mfrontmalltransferorder/updatestatus', bb,'updateStatus');
    		
		},
		cancel:function(){
			closeWin();
		}
	}
	ko.applyBindings(viewModel);
}
function updateStatus(data){
	if(data.status==1){
		summer.toast({
	         "msg" : "已发货" 
	    })	
	    summer.openWin({
	        "id" : "order_detail",
	        "url" : "html/order_detail/order_detail.html",
	        "pageParam" : {
	            "mainId" : summer.pageParam.options.id,
	            "type":'outallocate'
	        }
	    });
	}else{
		summer.toast({
	         "msg" : data.msg 
	    })	
	}
}