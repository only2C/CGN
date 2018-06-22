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
var curPage =1;
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    
    window.ip = summer.getStorage("ip");
    var viewModel = {
    	orderList:ko.observableArray(),
    	status:ko.observable(),
    	kwd:ko.observable(),
    	totalPage:ko.observable(),
    	id:ko.observable(),
    	changeShow:function(index){
    		console.log(index());
    		$('#switchWp'+index()).siblings('.order-total').find('.switch-btn').toggleClass('slide');
    		$('#switchWp'+index()).slideToggle();
    	},
		queryByStatus:function(status,data,event){
			curPage = 1;
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			viewModel.status(status);
			queryOrder(status);
			myScroll.scrollTo(0, 0, 200, 'easing');
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
     $('#searchInput').on('keyup',function(e){
		if(e.keyCode==13){
			queryOrder(viewModel.status(),$(this).val());
		}
	})
}
//初始化
function queryOrder(status,kwd,curPage){
	viewModel.status(status);
	viewModel.kwd(kwd);
	var queryObj;
	if(status=="20"){
    	var p_conditions = status?{suEvaluationStatus:'0'}:{};
    }else{
        var p_conditions = status===undefined?{}:{queryStatus:status};
    }
	if(kwd){
		p_conditions['queryString'] = kwd;
	}
	var page_params={"pageIndex":curPage,"pageSize":5};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysettlemutiple', enc_conditions,'queryBack');
}
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
        console.log('scroll'+this.y+'-'+this.maxScrollY);
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
        console.log('请求')
        curPage++;
        if (curPage < viewModel.totalPage()) {
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
            mainEnt.auditStatus = auditStatus[mainEnt.auditStatus];
            mainEnt.billStatus = billStatus[mainEnt.allStatus];
            children.forEach(function (val) {
                val.materialImgUrl = summer.getStorage("imgBaseUrl") + val.materialImgUrl;
            })
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
		viewModel.orderList(orderList);
	}
}
function querybymescodes(data){
	if(data.status==1){
        var refents = data.retData.ents;
    
        
    }else{
       
    }
}