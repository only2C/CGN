function closeWin (){
    summer.closeWin()
}
function nofind(_this, type) {
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror = null;
}
var billStatus = {
    0:'待审核',  //显示审核按钮 买方
    1:'待发货',
    2:'未通过',  //显示确认按钮 买方
    3:'未审批取消',
    5:'已审批取消', //已发货前 买方
    6:'待签收',
    7:'已签收',
    8:'拒收',
    9:'待验收',
    10:'待结算',
    11:'已结算',
    12:'验收未通过',
    15:'其他',
    20:'待评价'
};
var curPage =1;
var turn = 0 ;
function keyBack() {
    turn++;
    if (turn == 2) {
        clearInterval(intervalID);
        summer.exitApp()
    } else {
        summer.toast({"msg": "再按一次返回键退出!"});
    }
    var intervalID = setInterval(function () {
        clearInterval(intervalID);
        turn = 0;
    }, 3000);
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        supplierList:ko.observableArray([]),
        status:ko.observable(),
        kwd:ko.observable(),
        totalPage:ko.observable(),
        tabIndex:ko.observable(summer.pageParam.status),
        getType:function(status){
        	curPage=1;
            getData(status);
            viewModel.tabIndex(status);
            myScroll.scrollTo(0, 0, 200, 'easing');
        },
        openComment:function(orderId){
        	summer.openWin({
                "id" : "comment_su",
                "url" : "html/comment_su/comment_su.html",
                "pageParam" : {
                    "orderId" : orderId
                }
            });
        },
        viewDocument:function (data) {
            summer.openWin({
                "id" :"supplier_view_document",
                "url" : "html/supplier_view_document/supplier_view_document.html",
                "pageParam" : {
                    'orderId':data.mainEnt.id,
                    'status':viewModel.tabIndex()
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:true,
                "addBackListener":"true"
            });
        },
        sendExpress:function (data) {
            summer.openWin({
                "id" :"supplier_view_document",
                "url" : "html/list_supplier_express/list_supplier_express.html",
                "pageParam" : {
                    'expressObj':data.mainEnt,
                    'status':viewModel.tabIndex()
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:true,
                "addBackListener":"true"
            });
        },
        getPageDetail:function (data) {
            summer.openWin({
                "id" :"order_detail_supplier",
                "url" : "html/order_detail_supplier/order_detail_supplier.html",
                "pageParam" : {
                    'mainId':data.mainEnt.id,
                    'status':viewModel.tabIndex()
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:true,
                "addBackListener":"true"
            });
        },
        payBill:function (data) {
            UM.confirm({
                title: '确认结算',
                text:'确认已经收到货款，将订单状态变成已结算？',
                btnText: ["取消", "确定"],
                overlay: true,
                ok: function () {
                    var param ={
                        id:data.mainEnt.id,
                        status:'11'
                    };
                    var params =  p_params_con_dataj_enc(param);
                    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/ussettlemented', params,'payBillCallback');
                },
                cancle: function () {

                }
            })
        },
        changeShow:function (index) {
            $('#switchWp'+index()).siblings('.order-total').find('.switch-btn').toggleClass('slide');
            $('#switchWp'+index()).slideToggle();
        }
    };
    window.viewModel = viewModel;
    getData();
    ko.applyBindings(viewModel);
    $('#searchInput').on('keyup',function(e){
		if(e.keyCode==13){
			getData(viewModel.tabIndex(),$(this).val());
			document.getElementById('searchInput').blur();
		}
	})
}
function evaluationBack(){
	viewModel.getType('20');
}
function getData(status,kwd,curPage){
	viewModel.status(status);
	viewModel.kwd(kwd);
    var param ={

    }
    var pageParam ={
        pageIndex:curPage,
        pageSize:5
    }
    
	if(status==20 ||!status && summer.pageParam.status==20){
		param.sellEvaluationSta = '0';
	}else if(!status&&summer.pageParam.status&&summer.pageParam.status != -1){
        param.queryStatus = summer.pageParam.status;
    }else if(status&&status != -1){  //status == -1  查看全部
        param.queryStatus = status?status:summer.pageParam.status;
    }
	if(kwd){
		param['queryString'] = kwd;
	}
    var params = p_page_params_con_dataj_enc(param,pageParam);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysupplymutiple', params,'getDataCallback');
}

function  getDataCallback(res) {
    var data =[];
    if(res.status==1){
        //allStatus
        data = res.retData.aggEnts;
        viewModel.totalPage(res.pageParams.totalPage);
        data.forEach(function (value) {
            value.mainEnt.allStatusName = billStatus[value.mainEnt.allStatus];
            value.children.su_mall_order_infos.forEach(function(v){
                v.materialImgUrl = v.materialImgUrl ? summer.getStorage("imgBaseUrl") +  v.materialImgUrl:''
            })
        })
    }
    
    if(curPage==1){
        viewModel.supplierList(data);
        if (!myScroll) {
	        mycall();
	    }
        //if (myScroll) {
           setTimeout(function(){
            	myScroll.refresh();
           },100)
        //}
       	if(viewModel.supplierList().length<=0 || viewModel.totalPage()==1){
            $('.more').hide();
        }
    }else{
    	viewModel.supplierList(viewModel.supplierList().concat(data));
        setTimeout(function(){
        	myScroll.refresh();
        },100)
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
            getData(viewModel.status(),viewModel.kwd(),curPage);
        } else {

        }
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');
function payBillCallback(data){
    if(data.status==1){
        UM.toast({
            title: '结算成功',
            duration: 3000
        });
        getData();
    }else{
        UM.toast({
            title: data.msg,
            duration: 3000
        });
    }

}