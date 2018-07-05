function closeWin(){
	summer.closeWin();
}
function keyBack(){
	summer.closeWin();
}
function nofind(_this,type){  
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	UM.showLoadingBar({
	    text: "加载中",
	    icons: 'ti-loading',
	})
	window.ip = summer.getStorage("ip");
	$summer.fixStatusBar($summer.byId('header'));
	var viewModel = {
    	logisticsList:ko.observableArray([]),
    	evaluation_status:ko.observable(),
    	evaluationText:ko.observable(' '),
    	mList:ko.observableArray(summer.pageParam.mainOrder),
    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
	var url = ip+'/ieop_base_mobile/mfrontmalllogisticsprocess/inqueryLogistics';
	var mainOrder = summer.pageParam.mainOrder;
	var p_conditions = {};
    p_conditions['mallCompanyCode'] = mainOrder[0].mallLCompanyCode;
    p_conditions['mallLCode'] = mainOrder[0].mallLCode;
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
    p_async_post(url, enc_conditions,'inqueryLogistics');
    //查询物流信息
    var p_conditions = {};
    p_conditions['mallLCode'] = mainOrder[0].mallLCode;
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
    p_async_post(ip+'/ieop_base_mobile/mfrontmalllogisticsinfos/querylogisticsInfos', enc_conditions,'querylogisticsInfos');
    
}
function querylogisticsInfos(data){
	if(data.status==1){
		
	}else{
		summer.toast({
             "msg" : data.msg
        })
	}
}
function inqueryLogistics(data){
	if(data.status==1){
		var logisticsList = data.retData.ents;
		for(var i=0;i<logisticsList.length;i++){
			logisticsList[i].date = logisticsList[i].mallLChildDt.split(" ")[0];
			logisticsList[i].hour = logisticsList[i].mallLChildDt.split(" ")[1];
		}
		viewModel.logisticsList(logisticsList);
		var evaluation_status = data.retData.evaluation_status;
		viewModel.evaluation_status(evaluation_status);
		if(evaluation_status==3){
			viewModel.evaluationText('已签收');
		}
		if(evaluation_status==2){
			viewModel.evaluationText('疑难');
		}
		if(evaluation_status==4){
			viewModel.evaluationText('退签');
		}
		if(evaluation_status==6){
			viewModel.evaluationText('退回');
		}
		
		UM.hideLoadingBar();
	}else{
		summer.toast({
             "msg" : data.msg 
        })
	}
}