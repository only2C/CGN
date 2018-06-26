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
var locked = false;
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
    		$('#switchWp'+index()).siblings('.order-total').find('.switch-btn').toggleClass('slide');
    		$('#switchWp'+index()).slideToggle();
    	},
    	noAccess:function(id){
    		UM.prompt({
			    title: '审核不通过',
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function (data) {
			        var info = {};
	                info['id'] = id;
	                info['status'] = '2';
	                info['auditedContent'] = data;
	                var bb = p_page_params_con_dataj_enc(info,{},{});
	                var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usunaudited', bb,'usunaudited');
			    },
			    cancle: function (data) {
			    }
			})
    	},
    	access:function(id){
    		UM.prompt({
			    title: '审核通过',
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function (data) {
			        var info = {};
	                info['id'] = id;
	                viewModel.id(id);
	                info['status'] = '1';
	                info['auditedContent'] = data;
	                var bb = p_page_params_con_dataj_enc(info,{},{});
	                var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usaudited', bb ,'usaudited');
	                
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
		queryByStatus:function(status,data,event){
			curPage = 1;
			$(event.currentTarget).addClass('on').siblings().removeClass('on');
			viewModel.status(status);
			queryOrder(status);
			myScroll.scrollTo(0, 0, 200, 'easing');
		},
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(summer.pageParam.status===undefined || summer.pageParam.status== -1 ){
    	queryOrder();
    }else{
    	queryOrder(summer.pageParam.status);
    }
    viewModel.status(summer.pageParam.status);

    //初始化
    $('#searchInput').on('keyup',function(e){
		if(e.keyCode==13){
			queryOrder(viewModel.status(),$(this).val());
			document.getElementById('searchInput').blur();
		}
	})
}
function usorderedsta(data){
	if(data.status==1){
		queryOrder(viewModel.status());
    	summer.toast({
             "msg" : "预约成功！" 
        })
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function usaudited(data){
	if(data.status==1){
        queryOrder(viewModel.status()); 
        summer.toast({
             "msg" : "审核通过！" 
        })
    }else if(data.status==3){
    	UM.confirm({
		    title: '是否预约下单',
		    text: data.msg,
		    btnText: ["取消", "确定"],
		    overlay: true,
		    ok: function () {
		        var info = {};
                info['id'] = viewModel.id();
                info['status'] = '1';
                var bb = p_page_params_con_dataj_enc(info,{},{});
                var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/usorderedsta', bb , 'usorderedsta');
                
		    },
		    cancle: function () {
		    }
		});
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function queryOrder(status,kwd,curPage){
    viewModel.status(status);
    viewModel.kwd(kwd);
	var queryObj;
    var p_conditions = status===undefined?{}:{queryStatus:status};
	if(kwd){
		p_conditions['queryString'] = kwd;
	}
	var page_params={"pageIndex":curPage,"pageSize":5};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/queryauditmutiple', enc_conditions,'queryBack');
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
        if (curPage >= viewModel.totalPage()) {
            $('.more i').hide();
            $('.more span').text('没有更多了');
            return;
        }
        if(locked){
            console.log('locked')
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
        if (curPage <= viewModel.totalPage()) {
            locked = true;
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
function usunaudited(data){
	if(data.status==1){
        queryOrder(viewModel.status()); 
        summer.toast({
             "msg" : "审核未通过！" 
        })
    }else{
    	summer.toast({
             "msg" : data.msg
        })
    }
}
function queryBack(res){
	if(res.status != 1 ){
        summer.toast({
            "msg" : res.msg
        })
        return ;
    }
	var orderList = res.retData.aggEnts;
    viewModel.totalPage(res.pageParams.totalPage);
	var tmpArr = []; 
    var refObj = {};
    var suMCodes = "";
    var suStoreCodes = "";
    var ieopEnterpriseCodes = "";
    locked = false;
    if(orderList.length>0){
    	for(var i=0;i<orderList.length;i++){
            var mainEnt = orderList[i].mainEnt;
            var children = orderList[i].children.su_mall_order_infos;
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
            if(orderList.length<=0){
            	$('.more').hide();
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
	}else{
		viewModel.orderList(orderList);
	}
}
