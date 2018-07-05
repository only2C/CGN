function closeWin (){
    summer.closeWin()
}
window.ip = summer.getStorage("ip");
var pageSize = 1;
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
function openWin1 (winId){
    //var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
    var statusBarStyle = 'dark';
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        isKeep:false,
        statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}

summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var isSuppliers = summer.getStorage("isSupplier");

    var viewModel = {
        isAndriod:ko.observable($summer.os=='android'),
        iframeList:ko.observableArray([]),
        isSupplier:ko.observable(isSuppliers),
        totalPage: ko.observable(''),
        openDetailWin:function(suFaCode){
            summer.openWin({
                "id" : "iframeDetail",
                "url" : "html/iframe_detail/iframe_detail.html",
                "pageParam":{
                    "title":"框架协议",
                    "suFaCode":suFaCode
                }
            });
         }
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    queryIframe();
}

//查询框架列表
function queryIframe(){
    var param = p_page_params_con_dataj_enc({ "pageIndex":pageSize,"pageSize":5});
    var url = 'mfrontsuframeworkagreement/querypage';
    if(summer.getStorage("isSupplier") == "01"){
        url = 'mfrontsuframeworkagreement/querysupage' ;
    }
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'iframeCallback');

}
function iframeCallback(res) {
    var ents = res.retData.ents;
    viewModel.totalPage(res.pageParams.totalCount);
    var isSupplier =  viewModel.isSupplier() != "01" ;
    ents.forEach(function(v){
        v.isSupplier =  isSupplier;
    })
    if (pageSize == 1) {
        viewModel.iframeList(ents);
        if (myScroll) {
            myScroll.refresh();
        }
        if (ents.length <= 0) {
        	$('.more').hide();
            summer.toast({
                "msg": "暂无内容"
            })
        }

        $('#smallPic').removeClass('noshow');
        if(pageSize==viewModel.totalPage()){  
        	$('.more i').hide();
            $('.more span').text('没有更多了');//显示没有更多了
        }

    } else {
    	viewModel.iframeList(viewModel.iframeList().concat(ents));
        myScroll.refresh();
    }
    if (!myScroll) {
        mycall();
    }
}
$('.pull_icon').addClass('loading');
$('.more span').text('加载中...');
window.myScroll = undefined;
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
        if (pageSize >= viewModel.totalPage()) {
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
        pageSize++;
        if (pageSize < viewModel.totalPage()) {
            queryIframe(pageSize);
        } else {

        }
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');