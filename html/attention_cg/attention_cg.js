var turn = 0;
var curPage =1;
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
function nofind(_this,type){  
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror=null;
}
function openWin1 (winId){
	//var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
	var statusBarStyle = 'dark';
	if(viewModel.stype()==0&&winId=='attention'){
		winId='attention_cg';
	}
	summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        "animation":{
		    type:"none", //动画类型（详见动画类型常量）
		    subType:"from_right", //动画子类型（详见动画子类型常量）
		    duration:0 //动画过渡时间，默认300毫秒
        },
        isKeep:false,
        statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}
summerready = function(){
	
	window.ip = summer.getStorage("ip");
	var viewModel = {
		attentionList:ko.observableArray([]),
		defaultOrg:ko.observable(summer.getStorage("ufn")),
		organizationArr:ko.observableArray([]),
		item:ko.observableArray([]),
		attentionListTmp:ko.observableArray([]),
		totalPage:ko.observable(),
		kwd:ko.observable(),
		stype:ko.observable(summer.getStorage("stype")),
		mList:ko.observableArray([]),
		searchWord:ko.observable(),
		isAndriod:ko.observable($summer.os=='android'),
		searchAttention:function(){
			initPage(viewModel.searchWord());
		},
		openWin:function(winId){
			summer.openWin({
                "id" : winId,
                "url" : "html/"+winId+"/"+winId+".html",
            });
		},
		openWin2:function(options,data){
			summer.openWin({
                "id" : "detail_cg",
                "url" : "html/detail_cg/detail_cg.html",
                "pageParam" : {
                    options:options,
                    fromPage:"attention_cg"
                },
                "addBackListener":"true"
            });
		},
		addToCg:function(item){
	        var favm = item;
	        var p_conditions = {};
	        p_conditions['suStoreCode'] = favm['suStoreCode'];
	        p_conditions['ieopEnterpriseCode'] = favm['ieopEnterpriseCode'];
	        p_conditions['materialCode'] = favm['materialCode'];
	        p_conditions['buyStoreSwitch'] = '0';
	        p_conditions['addAmount'] = '1';
	        var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
	        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/save', enc_conditions , 'addUserCart');
		},
		chooseOrg:function(item){
				var p_conditions = {
                    ccode:item.cgnFCode
                };
                var page_params={"pageIndex":1,"pageSize":100};  //分页
                var sortItem = {};
                var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
                viewModel.item([item]);
                p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/setuserfactory', paramData,'setuserfactory');
    			
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	$summer.fixStatusBar($summer.byId('header'));
   	initPage();
    $('#changeOrgBtn').on('click',function(){
          var $this = $(this);
          if(viewModel.organizationArr().length<=0){
          	  var enc_conditions = p_page_params_con_dataj_enc({},{"pageIndex":1,"pageSize":100},{});
        	  p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/queryuserfactories', enc_conditions,'queryuserfactories');
              
          }
          $('.org-list').slideToggle();
          $('.drop').fadeToggle();
    })  
    $(".um-input-clear").click(function() {
          $(this).prev("input").val("");
    }) 
    /*$('#searchInput').on('keyup',function(e){
    	if(e.keyCode==13){
    		viewModel.searchAttention();
    		$('#searchInput').blur();
    	}
    })*/
}
function initPage (keyW,curPage){
	if(keyW){
		viewModel.kwd(keyW);
		var p_conditions = {
			queryString:keyW
		};
	}else{
		var p_conditions = {};
	}
	
    var page_params={"pageIndex":curPage?curPage:1,"pageSize":10};  //分页
    var sortItem = {};
    var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallmaterialfavorites/querypage', paramData,'querypage');
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
        //if (curPage < viewModel.totalPage()) {
            initPage(viewModel.kwd(),curPage);
        //} else {

        //}
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');
function addUserCart(data){
	if(data.status == 1){
		summer.setStorage("cartType", 1);
        summer.openWin({
            "id" : "cart_cg",
            "url" : "html/cart_cg/cart_cg.html"
        });
    }else{
        summer.toast({
            "msg":data.msg
        })
    }
}
function queryuserfactories(res){
	var factories = res;
    if(factories.status==1){
        var organizationArr = factories.retData.ents;
        viewModel.organizationArr(organizationArr);
    }else{
        summer.toast({
            "msg" : '查询失败'
        })
    }
}
function querypage(res){
	if(res.status==1){
        var orderData = res.retData.ents;
        viewModel.totalPage(res.pageParams.totalPage);
        var suMCodes = "";
        var suStoreCodes = "";
        var ieopEnterpriseCodes = "";
        if(orderData.length<=0){
        	viewModel.attentionList(orderData);
        	return;
        }
		for(var i = 0; i < orderData.length; i++){
            var ent = orderData[i];
            ent.showAdd = true;
            suMCodes += ent.materialCode + "#";
            suStoreCodes += ent.suStoreCode + "#";
            ieopEnterpriseCodes += ent.ieopEnterpriseCode + "#";
            orderData[i]['materialImgUrl'] = orderData[i]['materialImgUrl']?summer.getStorage("imgBaseUrl")+orderData[i]['materialImgUrl']:'../../img/default_small.png';
        }
        suMCodes = suMCodes.substring(0,suMCodes.length-1);
        suStoreCodes = suStoreCodes.substring(0,suStoreCodes.length-1);
        ieopEnterpriseCodes = ieopEnterpriseCodes.substring(0,ieopEnterpriseCodes.length-1);
        var info = {};
        info['suMCodes'] = suMCodes;
        info['suStoreCodes'] = suStoreCodes;
        info['ieopEnterpriseCodes'] = ieopEnterpriseCodes;
        var bb = p_params_con_dataj_enc(info);
        console.log(res.retData.ents)
		viewModel.attentionListTmp(orderData);
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescodes2', bb ,'querybymescodes');
    }else {
        summer.toast({
            "msg":res.msg
        })
    }
}
function querybymescodes(data){
     if(data.status==1){
        var refents = data.retData.ents;
        var refObj = {};
        for(var j=0;j<refents.length;j++){
            var ent = refents[j];
            var key = ent.suMCode+"#"+ent.suStoreCode+"#"+ent.ieopEnterpriseCode;
            refObj[key] = ent;
        }
        var attentionList = viewModel.attentionListTmp();
        for(var i=0;i<attentionList.length;i++){
            var key = attentionList[i].materialCode+"#"+attentionList[i].suStoreCode+"#"+attentionList[i].ieopEnterpriseCode;
            var refm = refObj[key];
            if(refm!=undefined){
                attentionList[i]['suMRefCode'] = refm.suMRefCode;
            }
            if(refm==undefined){
                attentionList[i].showAdd = false;
            }else{
                attentionList[i].showAdd = true;
            }
        }
        if (!myScroll) {
            mycall();
        }
        if(curPage==1){
            viewModel.attentionList(attentionList);
            if (myScroll) {
            	setTimeout(function(){
            		myScroll.refresh();
            	},100)
            }
            if(attentionList.length<=0 || viewModel.totalPage()==1){
            	$('.more').hide();
            }
        }else{
        	viewModel.attentionList(viewModel.attentionList().concat(attentionList));
            setTimeout(function(){
            	myScroll.refresh();
            },100)
        }
    }else{
        summer.toast({
            "msg":data.msg
        })
    }
}
function setuserfactory(result){
	var item = viewModel.item()[0];
	if(result.status==1){
    	summer.setStorage("ufn", item.cgnFName);
    	viewModel.defaultOrg(item.cgnFName);
    }else{
    	summer.toast({
            "msg" : result.msg
        })
    }
    $('.org-list').slideUp();
    $('.drop').hide();
}