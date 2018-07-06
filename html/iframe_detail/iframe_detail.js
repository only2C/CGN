function closeWin (){
    summer.closeWin()
}
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
    var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    var viewModel = {
		title:ko.observable( summer.pageParam.title),
        isAndriod:ko.observable($summer.os=='android'),
        isSupplier:ko.observable(isSuppliers),
        totalPage:ko.observable(''),
        tabIndex:ko.observable(0),
        detailArr:ko.observableArray([]),
        rangArr:ko.observableArray([]),
        docArr:ko.observableArray([]),
        nullDataVisible:ko.observable(false),
        changeItem:function (index) {
            $(".iframe-nav-li").removeClass("active");
            $(".iframe-nav-li").eq(index).addClass("active");
            $(".iframe-item").addClass("hide");
            $(".iframe-item").eq(index).removeClass("hide");
            viewModel.tabIndex(index);
			pageSize =1;
            if(index == 1){
            	queryRang();
            }else  if(index == 2){
                queryDoc();
            }else  if(index == 0){
            	queryDeatil();
            }
            myScroll.scrollTo(0, 0, 200, 'easing');
        },
        downFile:function (url) {
            var platform = $summer.os;
            if(platform == "android"){
                // 执行android特殊代码
                var params = ["android.permission.READ_EXTERNAL_STORAGE","android.permission.WRITE_EXTERNAL_STORAGE",
                    "android.permission.READ_PHONE_STATE"];
                summer.getPermission(params,  function(args){
                    summer.openWebView({
                        url:url
                    })
                }, function(args){
                })
            } else {
               /* var xlsxFile = url.split(".");
                if (url && xlsxFile[xlsxFile.length-1] == 'xlsx') {   //iphone 手机浏览器不支持xlsx格式
                    UM.confirm({
                        title: '提示：',
                        text: 'iphone浏览器不支持xlsx格式，请在浏览器中选择其他应用打开。可使用wps打开此类文件。',
                        btnText: ["取消", "继续打开"],
                        overlay: true,
                        ok: function () {
                            summer.openWebView({
                                url: url
                            })
                        },
                        cancle: function () {
                        }
                    });
                }else{*/
                    summer.openWebView({
                        url: url
                    })
                // }


            }
        }
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    queryDeatil();
    
    
}

var isSupplier = summer.getStorage("isSupplier") == "01";
function queryDeatil(){
    var url = 'mfrontsufamaterialref/querypage';
    if(isSupplier){
       url ='mfrontsufamaterialref/queryrefpage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":pageSize,"pageSize":10,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryDetailCallback');
}

function queryRang(){
    var url = 'mfrontsufaapplication/querypage';
    if(isSupplier){
        url ='mfrontsufaapplication/querypage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":pageSize,"pageSize":10,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryRangCallback');
}
function queryDoc(){
    var url = 'mfrontsufaattachments/querypage';
    if(isSupplier){
        url ='mfrontsufaattachments/querysupage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":pageSize,"pageSize":10,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryDocCallback');
}

function queryDetailCallback(res) {
	if(res.status!=1){
		summer.toast({
             "msg" : res.msg
        })
	}
	viewModel.totalPage(res.pageParams.totalPage);
    var ents = res.retData.ents;
    if (!myScroll) {
        mycall();
    }
    if (pageSize == 1) {
        viewModel.detailArr(ents);
        if (myScroll) {
            myScroll.refresh();
        }
        if (ents.length <= 0) {
        	$('.more').hide();
            summer.toast({
                "msg": "暂无内容"
            })
        }
        if(pageSize==viewModel.totalPage()){  
        	$('.more i').hide();
            $('.more span').text('没有更多了');//显示没有更多了
        }

    } else {
    	viewModel.detailArr(viewModel.detailArr().concat(ents));
        myScroll.refresh();
    }
}
function queryRangCallback(res){
	if(res.status!=1){
		summer.toast({
             "msg" : res.msg
        })
	}
    var ents = res.retData.ents;
    viewModel.totalPage(res.pageParams.totalPage);
    if (!myScroll) {
        mycall();
    }
    if (pageSize == 1) {
        viewModel.rangArr(ents);
        if (myScroll) {
            myScroll.refresh();
        }
        if (ents.length <= 0) {
        	$('.more').hide();
            summer.toast({
                "msg": "暂无内容"
            })
        }

        if(pageSize==viewModel.totalPage()){  
        	$('.more i').hide();
            $('.more span').text('没有更多了');//显示没有更多了
        }

    } else {
    	viewModel.rangArr(viewModel.rangArr().concat(ents));
        myScroll.refresh();
    }
}
function queryDocCallback(res){
	if(res.status!=1){
		summer.toast({
             "msg" : res.msg
        })
	}
    var ents = res.retData.ents;
    viewModel.totalPage(res.pageParams.totalPage);
    ents.forEach(function(val){
        if(val.suFaaFileAddr){
            var xlsxFile = val.suFaaFileAddr.split("."),file = xlsxFile[xlsxFile.length-1].toLowerCase() ;
            var className = 'iframe-doc';
            if( file == 'xlsx' || file == 'xls') {
                className = 'iframe-xls'
            }
            if( file == 'doc' || file == 'docx') {
                className = 'iframe-doc'
            }
            if( file == 'pdf'){
                className = 'iframe-pdf'
            }
            val.className = className;
            val.suFaaFileAddr = summer.getStorage("imgBaseUrl")+ val.suFaaFileAddr ;
        }
    })
    if (!myScroll) {
        mycall();
    }
    if (pageSize == 1) {
        viewModel.docArr(ents);
        if (myScroll) {
            myScroll.refresh();
        }
        if (ents.length <= 0) {
        	$('.more').hide();
            summer.toast({
                "msg": "暂无内容"
            })
        }

        if(pageSize==viewModel.totalPage()){  
        	$('.more i').hide();
            $('.more span').text('没有更多了');//显示没有更多了
        }

    } else {
    	viewModel.docArr(viewModel.docArr().concat(ents));
        myScroll.refresh();
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
        if (pageSize <= viewModel.totalPage()) {
        	if(viewModel.tabIndex()==0){
        		queryDeatil(pageSize);
        	}else if(viewModel.tabIndex()==1){
        		queryRang(pageSize);
        	}else if(viewModel.tabIndex()==2){
        		queryDoc(pageSize);
        	}
        } else {

        }
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');
