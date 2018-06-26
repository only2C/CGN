function closeWin (){
    summer.openWin({
    	"id":"my",
    	"url":"html/my/my.html",
    });
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
    15:'其他',
};
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.curPage=1;
    window.ip = summer.getStorage("ip");
    var viewModel = {
    	orderList:ko.observableArray(),
    	childOrders:ko.observableArray(),
    	status:ko.observable(),
    	kwd:ko.observable(),
    	totalPage:ko.observable(''),
    	showFlag:ko.observable(0),
    	id:ko.observable(),
        tabIndex:ko.observable(),
    	changeShow:function(index){
    		$('#switchWp'+index()).siblings('.order-total').find('.switch-btn').toggleClass('slide');
    		$('#switchWp'+index()).slideToggle();
    	},
		queryByStatus:function(status,data,event){
			curPage = 1;
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			viewModel.tabIndex(status);
			queryOrder(status);
			myScroll.scrollTo(0, 0, 200, 'easing');
		},
		openWin:function(winId,materialImgUrl,orderId,materialCode,addComment){
			var pageParam = {
				"orderId":orderId
			};
			if(winId == 'supplier_view_document'){
				pageParam.backWinParam ={
					page:'order_list_cg',
                    status:viewModel.status()
				}
			}
			if(winId =='order_detail_supplier'){
				pageParam = {
					"mainId":orderId
				};
			}
			if(materialCode&&toString.call(materialCode)!='[object Object]'){
				pageParam = {
					"mainId":orderId,
					"materialCode":materialCode,
					"addComment":addComment,
					"materialImgUrl":materialImgUrl
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
			viewModel.id(id);
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
				    	/*暂时不校验验证码
				        var info = {};
				        info['ieopVsmBillId'] = id;
				        info['ieopVsmValiCode'] = ver;
				        info['ieopVsmPurpose'] = '1';
				        var bb = p_page_params_con_dataj_enc(info,{},{});
				        var data = p_async_post(ip+'/ieop_base_mobile/mfrontieopvalisortmsg/valcodesms', bb ,'accessVal');*/
				        var info = {};
				        info['id'] = viewModel.id();
				        info['status'] = '10';
				        var bb = p_page_params_con_dataj_enc(info,{},{});
				        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/ussettlement', bb , 'ussettlement');
				        
				    }
			    },
			    cancle: function () {
			        var ver = $('#acceptanceVal').val();
				    if(ver==""||ver==null){
				        summer.toast({
				    		"msg":"请输入验证码！"
				    	})
				        return
				    }else{
				    	/* 暂时不校验验证码
				        var info = {};
				        info['ieopVsmBillId'] = viewModel.id();
				        info['ieopVsmValiCode'] = ver;
				        var bb = p_page_params_con_dataj_enc(info,{},{});
				        var data = p_async_post(ip+'/ieop_base_mobile/mfrontieopvalisortmsg/valcodesms', bb ,'noAccessBack');*/
				        var info = {};
				        info['id'] = viewModel.id();
				        info['status'] = '12';
				        info['checkContent'] = '验收不通过原因'
				        var bb = p_page_params_con_dataj_enc(info,{},{});
				        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usunchecked', bb ,'usunchecked');
				        
				    }
			    }
			});
		}
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(summer.pageParam && summer.pageParam.status != -1 ){
    	queryOrder(summer.pageParam.status);
    }else {
    	queryOrder();
    }
    viewModel.tabIndex(summer.pageParam.status)
    //初始化
    $('#searchInput').on('keyup',function(e){
		if(e.keyCode==13){
			queryOrder(viewModel.status(),$(this).val());
			document.getElementById('searchInput').blur();
		}
	})

}
function queryOrder(status,kwd,curPage){
	viewModel.status(status);
	viewModel.kwd(kwd);
	var queryObj;
	var p_conditions  ={} ;
	if(status=="20"){
    	p_conditions = status?{suEvaluationStatus:'0,2'}:{};
    }else{
        p_conditions = ( status===-1 || status == 'undefined') ?{}:{queryStatus:status};
    }
	if(kwd){
		p_conditions['queryString'] = kwd;
	}
	var page_params={"pageIndex":curPage,"pageSize":5};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	if(status=="20"){
		p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/queryevaluationmutiple', enc_conditions,'evaluationQueryBack');
	}else{
		p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querypurchasermutiple', enc_conditions,'queryBack');
	}
}
//分页
$('.pull_icon').addClass('loading');
$('.more span').text('加载中...');
$('.drop').on('click', function () {
    var $this = $(this);
    $this.next().removeClass('limith');
})
myScroll = null;
window.mycall = function () {
    window.myScroll = new JRoll('#swrapper', {
        preventDefault: false,
        mouseWheel: true,
        momentum: true,
        fadeScrollbars: true,
        useTransform: true,
        useTransition: true,
        click: true,
        tap: true
    })
    myScroll.on('scrollStart', function () {
        console.log('scrollStart');
    })
    myScroll.on('scroll', function () {
        console.log('scroll');
        if (this.y < (this.maxScrollY)) {
            $('.pull_icon').addClass('flip');
            $('.pull_icon').removeClass('loading');
            $('.more span').text('释放加载...');
        } else {
            $('.pull_icon').removeClass('flip loading');
            $('.more span').text('上拉加载...')
        }
    })
    myScroll.on('scrollEnd', function () {
        console.log('scrollEnd');
        if (curPage >= viewModel.totalPage()) {
            $('.more i').hide();
            $('.more span').text('没有更多了');
            return;
        }
        if ($('.pull_icon').hasClass('flip')) {
            $('.pull_icon').addClass('loading');
            $('.more span').text('加载中...');
            console.log('pullupA')
            pullUpAction();
        }
    })
    myScroll.on('refresh', function () {
        if ($('.scroller').height() < $('#swrapper').height()) {
            $('.more').hide();
        }
        $('.more').removeClass('flip loading');
        $('.more span').text('上拉加载...');
    })

    function pullUpAction() {
        curPage++;
        if (curPage <= viewModel.totalPage()) {
            queryOrder(viewModel.status(),viewModel.kwd(),curPage);
        } else {

        }
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');

//通过 校验回调
function accessVal(data){
	if(data.status==1){
        var info = {};
        info['id'] = viewModel.id();
        info['status'] = '10';
        var bb = p_page_params_con_dataj_enc(info,{},{});
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/ussettlement', bb , 'ussettlement');
        
    }else{
        summer.toast({
            	"mag":data.msg
            }) 
    }
}
//未通过校验回调
function noAccessBack(){
	if(data.status==1){
        var info = {};
        info['id'] = viewModel.id();
        info['status'] = '12';
        info['checkContent'] = '验收不通过原因'
        var bb = p_page_params_con_dataj_enc(info,{},{});
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usunchecked', bb ,'usunchecked');
        
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function usunchecked(data){
	if(data.status==1){
        queryOrder(viewModel.status());  
        summer.toast({
             "msg" : "验收未通过！" 
        })
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function ussettlement(data){
	if(data.status==1){
        queryOrder(viewModel.status()); 
        summer.toast({
        	"mag":"验收通过！"
        }) 
    }else{
    	summer.toast({
        	"mag":data.msg
        }) 
    }
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
	if(res.status != 1 ){
        summer.toast({
            "msg" : res.msg
        })
        return;
	}
	var orderList = res.retData.aggEnts;
	viewModel.totalPage(res.pageParams.totalPage);
	var tmpArr = []; 
    var refObj = {};
    var suMCodes = "";
    var suStoreCodes = "";
    var ieopEnterpriseCodes = "";
    if(orderList.length>0){
    	for(var i=0;i<orderList.length;i++){
            var mainEnt = orderList[i].mainEnt;
            var children = orderList[i].children.su_mall_order_infos;
            children.forEach(function (val) {
				val.materialImgUrl = val.materialImgUrl ? summer.getStorage("imgBaseUrl") + val.materialImgUrl:"";
            })
            mainEnt.auditStatus = auditStatus[mainEnt.auditStatus];
            mainEnt.billStatus = billStatus[mainEnt.allStatus];

        }
        if(curPage==1){
        	viewModel.orderList(orderList);
	        if (myScroll) {
		        setTimeout(function(){
            		myScroll.refresh();
            	},100)
		    }
        }else{
        	viewModel.orderList(viewModel.orderList().concat(orderList));
        	setTimeout(function(){
            	myScroll.refresh();
            },100)
        }
        if (!myScroll) {
	        mycall();
	    }
        return;
	}else{
		viewModel.orderList(orderList);
	}
	
}
function evaluationQueryBack(res){
	if(res.status != 1 ){
        summer.toast({
            "msg" : res.msg
        })
        return;
	}
	var childOrders = res.retData.ents;
	viewModel.totalPage(res.pageParams.totalPage);
	for(var i = 0;i<childOrders.length;i++){
		childOrders[i]['billStatus'] = billStatus[childOrders[i]['billStatus']];
	}
	if(curPage==1){
		viewModel.childOrders(childOrders); 
		if (myScroll) {
	       setTimeout(function(){
            	myScroll.refresh();
           },100)
	    }
	    //if(childOrders.length<=0){
	    	//$('.more').hide();
	    //}
	}else{
		viewModel.childOrders(viewModel.childOrders().concat(childOrders));
		setTimeout(function(){
            myScroll.refresh();
        },100)
	}
	if (!myScroll) {
	    mycall();
	}
}
function sendcodesms(id,receivePhone,receiveName){
	var info = {};
    info['ieopVsmBillId'] = id;
    info['ieopVsmPhoneNum'] = receivePhone;
    info['ieopUserName'] = receiveName;
    info['ieopVsmPurpose '] = '1';
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
function evaluationBack(){
	queryOrder('20');
}