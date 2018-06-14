function closeWin (){
    summer.closeWin()
}
function nofind(_this, type) {
    src = "../static/mall/images/default_small.png"
    _this.src = src
    _this.onerror = null;
}
var auditStatus = {
    0:'待审核',  //显示审核按钮 买方1
    1:'审核通过',
    2:'审核未通过',  //显示确认按钮 买方
};
var billStatus = { 
    0:'待审核',  //显示审核按钮 买方1
    1:'待发货',
    2:'未通过',  //显示确认按钮 买方
    3:'未审批取消', 
    5:'已审批取消',
    6:'待签收', //已发货前 买方
    7:'已签收',
    8:'拒收',
    9:'待验收',
    10:'待结算',
    11:'已结算',
    12:'验收未通过',
    15:'其他'
};
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    
    window.ip = summer.getStorage("ip");
    var viewModel = {
    	orderList:ko.observableArray(),
    	status:ko.observable(),
    	id:ko.observable(),
    	changeShow:function(index){
    		console.log(index());
    		$('#switchWp'+index()).siblings('.order-total').find('.switch-btn').toggleClass('slide');
    		$('#switchWp'+index()).slideToggle();
    	},
		queryByStatus:function(status,data,event){
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			viewModel.status(status);
			queryOrder(status);
		},
		openWin:function(winId,orderId){
			var pageParam = {
				"orderId":orderId
			};
			if(winId=='supplier_view_document'){
				pageParam = {
					"mainId":orderId
				};
			}
			summer.openWin({
                "id" :winId,
		        "url" : "html/"+winId+"/"+winId+".html",
		        "animation":{
		            type:"none", //动画类型（详见动画类型常量）
		            subType:"from_right", //动画子类型（详见动画子类型常量）
		            duration:0 //动画过渡时间，默认300毫秒
		        },
		        "statusBarStyle":'dark',
		        "addBackListener":"true",
		        "pageParam":pageParam
            });
		},
		saveClick:function(id,valiOrderCode){
			viewModel.id(id);
			UM.prompt({
			    title: '请输入支付单号',
			    inputValue:valiOrderCode,
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function (data) {
			        var id = viewModel.id();
				    var valiOrderCode = data;
				    if(data==""||data==null){
				    	summer.toast({
                             "msg" : "请输入支付单号！" 
                        })
				        return;
				    }
				    var info = {};
				    info['id'] = id;
				    info['valiOrderCode'] = data;
				    var bb = p_page_params_con_dataj_enc(info,{},{});
				    var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/savevaliordercode', bb ,'savevaliordercode');
				    
			    },
			    cancle: function (data) {
			        
			    }
			})
		},
        openWin:function(winId,orderId){
            var pageParam = {
                "orderId":orderId
            };
            summer.openWin({
                "id" :winId,
                "url" : "html/"+winId+"/"+winId+".html",
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                "statusBarStyle":'dark',
                "addBackListener":"true",
                "pageParam":pageParam
            });
        },
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(summer.pageParam.status==-1 || summer.pageParam.status===undefined){
    	queryOrder();
    }else {
    	queryOrder(summer.pageParam.status);
    }
    viewModel.status(summer.pageParam.status);
}
//初始化
function queryOrder(status,kwd){
	var queryObj;
	if(status=="20"){
    	var p_conditions = status?{suEvaluationStatus:'0'}:{};
    }else{
        var p_conditions = status===undefined?{}:{queryStatus:status};
    }
	if(kwd){
		p_conditions['queryString'] = kwd;
	}
	var page_params={"pageIndex":1,"pageSize":100};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysettlemutiple', enc_conditions,'queryBack');
}
function savevaliordercode(data){
	if(data.status==1){
        queryOrder(viewModel.status()); 
        summer.toast({
             "msg" : "保存成功！" 
        })
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function queryBack(res){
	console.log(res);
	var orderList = res.retData.aggEnts;
	var tmpArr = []; 
    var refObj = {};
    var suMCodes = "";
    var suStoreCodes = "";
    var ieopEnterpriseCodes = "";
    if(orderList.length>0){
    	for(var i=0;i<orderList.length;i++){
            var mainEnt = orderList[i].mainEnt;
            var children = orderList[i].children.su_mall_order_infos;
            mainEnt.auditStatus = auditStatus[mainEnt.auditStatus];
            mainEnt.billStatus = billStatus[mainEnt.allStatus];
        }
        viewModel.orderList(orderList);
        return;
        for(var i=0;i<orderList.length;i++){
            var children = orderList[i].children.su_mall_order_infos;
            for(var j=0;j<children.length;j++){
                var child = children[j];
                suMCodes += child.materialCode + "#";
                suStoreCodes += child.suStoreCode + "#";
                ieopEnterpriseCodes += child.ieopEnterpriseCode + "#";
            }
        }
        suMCodes = suMCodes.substring(0,suMCodes.length-1);
        suStoreCodes = suStoreCodes.substring(0,suStoreCodes.length-1);
        ieopEnterpriseCodes = ieopEnterpriseCodes.substring(0,ieopEnterpriseCodes.length-1);
        var info = {};
        info['suMCodes'] = suMCodes;
        info['suStoreCodes'] = suStoreCodes;
        info['ieopEnterpriseCodes'] = ieopEnterpriseCodes;
        var bb = p_params_con_dataj_enc(info);
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescodes', bb,'querybymescodes');
	}else{
		
	}
}
function querybymescodes(data){
	if(data.status==1){
        var refents = data.retData.ents;
    
        
    }else{
       
    }
}