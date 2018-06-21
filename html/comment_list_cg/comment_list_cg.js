function keyBack(){
    turn++;
    if(turn==2){
        clearInterval(intervalID); 
        summer.exitApp()
    }else{
        summer.toast({"msg":"再按一次返回键退出!"});
    }
    var intervalID = setInterval(function() {
        clearInterval(intervalID);
        turn=0;
    }, 3000);
}
function closeWin(){
	summer.closeWin();
}
function nofind(_this,type){  
    src = "../static/mall/images/default_small.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	window.ip = summer.getStorage("ip");
	var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    window.viewModel = {
    	tabIndex:ko.observable(isSuppliers?1:2),
    	giveList:ko.observableArray(),
    	fromList:ko.observableArray(),
    	isSuppliers:ko.observable(isSuppliers),
        tmpArr:ko.observableArray(),
    	changeTab:function(index){
    		viewModel.tabIndex(index);
    		getList();
    	}
    }
    ko.applyBindings(viewModel);
    function getList(){
    	var p_conditions = {
            
        };
        var bb = p_page_params_con_dataj_enc(p_conditions,{},{});
        if(viewModel.tabIndex()==2){
        	if(viewModel.isSuppliers()){
        		baseUrl = '/ieop_base_mobile/mfrontsumaterialorderevaluation/queryfrom';
        	}else{
        		baseUrl = '/ieop_base_mobile/mfrontsumaterialorderevaluation/querybuyto';
        	}
        }else {
        	if(viewModel.isSuppliers()){
        		baseUrl = '/ieop_base_mobile/mfrontsumaterialevaluation/querysellto';
        	}else{
        		baseUrl = '/ieop_base_mobile/mfrontsumaterialevaluation/queryfrom'
        	}
        }
        p_async_post(ip+baseUrl, bb,'queryfromBack');
    }
    getList();
}﻿ 
var s_map = {};
function queryfromBack(data){
	var tmpArr = data.retData.ents;
    var spaInfos = data.retData.spaInfos;
    var tmpObj = {};
    if(tmpArr.length>0){
        if(viewModel.tabIndex()!=2&&spaInfos!=undefined){
            for(var i=0;i<spaInfos.length;i++){
                tmpObj = spaInfos[i];
                key = tmpObj.orderId+","+tmpObj.orderCid;
                if(null == s_map[key] || s_map[key] == undefined){
                    tArr = [];
                }else{
                    tArr = s_map[key];
                }
                tArr.push(tmpObj);
                s_map[key] = tArr;
            }
        }
    }
    if(tmpArr.length!=0){
        var suMCodes ="";
        var suStoreCodes ="";
        var ieopEnterpriseCodes ="";
        for(var i = 0; i < tmpArr.length; i++){
            var ent = tmpArr[i];
            suMCodes += ent.suMaterialCode + "#";
            suStoreCodes += ent.suStoreCode + "#";
            ieopEnterpriseCodes += ent.suCompanyCode + "#";
        }
        suMCodes = suMCodes.substring(0,suMCodes.length-1);
        suStoreCodes = suStoreCodes.substring(0,suStoreCodes.length-1);
        ieopEnterpriseCodes = ieopEnterpriseCodes.substring(0,ieopEnterpriseCodes.length-1);
        viewModel.tmpArr(tmpArr);
        var info = {};
        info['suMCodes'] = suMCodes;
        info['suStoreCodes'] = suStoreCodes;
        info['ieopEnterpriseCodes'] = ieopEnterpriseCodes;
        var bb = p_params_con_dataj_enc(info);
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescodes', bb , 'querybymescodesBack');
    }
    
}
function querybymescodesBack(data){
    if(data.status==1){
        var refents = data.retData.ents;
        var refObj = {};
        for(var j=0;j<refents.length;j++){
            var ent = refents[j];
            var key = ent.suMCode+"#"+ent.suStoreCode+"#"+ent.ieopEnterpriseCode;
            refObj[key] = ent;
        }
        var ods = [];
        for(var i=0;i<viewModel.tmpArr().length;i++){
            var od = viewModel.tmpArr()[i];
            var key = od.suMaterialCode+"#"+od.suStoreCode+"#"+od.suCompanyCode;
            var refm = refObj[key];
            if(refm!=undefined){
                od['suMRefCode'] = refm['suMRefCode'];
            }
            key = od.orderId+","+od.orderCid;
            if(null != s_map[key] && s_map[key] != undefined){
                tArr = s_map[key];
                for(var j=0;j<tArr.length;j++){
                    var son = tArr[j];
                    od['addComment'] = son; //追评只有一次，所以存了obj，多次追评时需修改为数组
                }
            }else {
            	od['addComment'] = undefined;
            }
            ods.push(od);
        }
        viewModel.tmpArr(ods);
        if(viewModel.tabIndex()==(viewModel.isSuppliers()?1:2)){
        	if(viewModel.isSuppliers()){
        		viewModel.giveList(viewModel.tmpArr());
        	}else{
        		viewModel.fromList(viewModel.tmpArr());
        	}
            console.log(viewModel.tmpArr());
        }else {
        	if(viewModel.isSuppliers()){
        		viewModel.fromList(viewModel.tmpArr());
        	}else{
        		viewModel.giveList(viewModel.tmpArr());
        	}
            console.log(viewModel.tmpArr());
        }
    }else{
        summer.toast({
            "msg":data.msg
        })
    }
}