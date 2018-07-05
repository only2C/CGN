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
	window.viewModel = {
    	logisticsList:ko.observableArray([]),
    	retLogistData:ko.observableArray(summer.pageParam.retLogistData.ents),
    	evaluation_status:ko.observable(),
    	tabIndex:ko.observable(1),
    	evaluationText:ko.observable(' '),
    	mList:ko.observableArray(summer.pageParam.mainOrder),
    	changeLog:function(cur){
    		viewModel.tabIndex(cur);
    		var curItem = viewModel.retLogistData()[cur-1];
    		//queryStatus(curItem.mallLCompanyCode,curItem.mallLCode);
    		queryLog(curItem.mallLCode);
    	}
    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
	
    var curItem = viewModel.retLogistData()[0];
    //queryStatus(curItem.mallLCompanyCode,curItem.mallLCode); 
    queryLog(curItem.mallLCode);
}

function queryStatus(mallLCompanyCode,mallLCode){
	var url = ip+'/ieop_base_mobile/mfrontmalllogisticsprocess/inqueryLogistics';
	var p_conditions = {};
    //p_conditions['mallCompanyCode'] = 'yunda';
    //p_conditions['mallLCode'] = '3831619356742' ;
    p_conditions['mallCompanyCode'] = mallLCompanyCode;
    p_conditions['mallLCode'] = mallLCode;
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
    p_async_post(url, enc_conditions,'inqueryLogistics');
}
function queryLog(mallLCode){
	//查询物流信息
    var p_conditions = {};
    p_conditions['mallLCode'] = mallLCode;
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
    p_async_post(ip+'/ieop_base_mobile/mfrontmalllogisticsinfos/querylogisticsInfos', enc_conditions,'querylogisticsInfos');
}
function querylogisticsInfos(data){
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
	}else{
		summer.toast({
             "msg" : data.msg
        })
	}
}
function inqueryLogistics(data){
    UM.hideLoadingBar();
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
		

	}else{
		summer.toast({
             "msg" : data.msg 
        })
	}
}