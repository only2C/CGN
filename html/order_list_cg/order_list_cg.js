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
		queryByStatus:function(status,data,event){
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			queryOrder(status);
		},
		openWin:function(winId,orderId){
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
		        "pageParam":{
		        	"orderId":orderId
		        }
            });
		},
		cancelClick:function(id){
			UM.confirm({
			    title: '取消订单',
			    text: '确定取消该订单？',
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function () {
			    	var info = {};
			    	info['id'] = id;
		            info['status'] = '3';
		            var bb = p_page_params_con_dataj_enc(info,{},{});
		            var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usunauditcanceled', bb,'usunauditcanceled');
			    },
			    cancle: function () {
			    }
			});
		},
		acceptance:function(id,receivePhone,receiveName){
			UM.confirm({
			    title: '验收',
			    text: '<span><button onClick="sendcodesms('+id+','+receivePhone+',\''+receiveName+'\')">获取验证码</button><input id="acceptanceVal" stype="text"/></span><div class="clearfix"></div>',
			    btnText: ["不通过", "通过"],
			    overlay: true,
			    ok: function () {
			        var ver = $('#acceptanceVal').val();
				    if(ver==""||ver==null){
				    	summer.toast({
				    		"msg":"请输入验证码！"
				    	})
				        return
				    }else{
				        var info = {};
				        info['ieopVsmBillId'] = id;
				        info['ieopVsmValiCode'] = ver;
				        var bb = p_page_params_con_dataj_enc(info,{},{});
				        var data = p_async_post(ip+'/ieop_base_mobile/mfrontieopvalisortmsg/valcodesms', bb);
				        if(data.status==1){
				            var info = {};
				            info['id'] = id;
				            info['status'] = '12';
				            info['checkContent'] = '验收不通过原因'
				            var bb = p_page_params_con_dataj_enc(info,{},{});
				            var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usunchecked', bb);
				            if(data.status==1){
				                queryStatus(viewModel.status()); 
				                summer.toast({
				                	"mag":"验收未通过！"
				                }) 
				            }else{
				            	summer.toast({
				                	"mag":data.msg
				                }) 
				            }
				        }else{
				            summer.toast({
				                	"mag":data.msg
				                }) 
				        }
				    }
			    },
			    cancle: function () {
			        
			    }
			});
		}
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(summer.pageParam){
    	queryOrder(summer.pageParam.status);
    }else {
    	queryOrder();
    }
    //初始化
}
function queryOrder(status,kwd){
	viewModel.status(status);
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
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querypurchasermutiple', enc_conditions,'queryBack');
}
function usunauditcanceled(res){
	if(res.data==1){
		summer.toast({
             "msg" : "取消成功" 
        })
	}else{
		summer.toast({
             "msg" : res.msg
        })
	}
	queryOrder(viewModel.status());
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
function sendcodesms(id,receivePhone,receiveName){
	var info = {};
    info['ieopVsmBillId'] = id;
    info['ieopVsmPhoneNum'] = receivePhone;
    info['ieopUserName'] = receiveName;
    var bb = p_page_params_con_dataj_enc(info,{},{});
    var data = p_async_post(ip+'/ieop_base_mobile/mfrontieopvalisortmsg/sendcodesms', bb,'sendcodesmsBack');
}
function sendcodesmsBack(res){
	if(res.status==1){
		summer.toast({
             "msg" : "发送成功！" 
        })
	}else{
		summer.toast({
             "msg" : res.msg
        })
	}
}

function querybymescodes(data){
	if(data.status==1){
        var refents = data.retData.ents;
    
        
    }else{
       
    }
}