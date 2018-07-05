function closeWin(){
	summer.closeWin();
}
function nofind(_this,type){  
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	var options = summer.pageParam.options;
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var viewModel = {
		item:ko.observableArray([options.item]),
		retnum:ko.observable(),
		confirmBack:function(){
			if(!parseInt(this.retnum())||parseInt(this.retnum())>parseInt(options.item.mallTAmount - options.item.returnNum)){
				summer.toast({
                     "msg" : "归还数量不正确" 
                })
                return
			}
			var p_condition = {
				mainId:options.mainId,
				subId:options.item.id,
				retnum:this.retnum()
			}
			var bb = p_params_con_dataj_enc(p_condition);
			p_async_post(ip+'/ieop_base_mobile/mfrontmalltransferorder/retorder',bb,'retorder');
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	
	
}
function retorder(retData){
	if(retData.status ==1){
		summer.toast({
	         "msg" : "归还成功" 
	    })
	    var querySingle = 'querySingle();';
		summer.execScript({
		    winId: 'order_detail',
		    script: querySingle
		}); 
	    summer.closeWin();
	}else {
		summer.toast({
	         "msg" : "归还失败" 
	    })
	}
}
