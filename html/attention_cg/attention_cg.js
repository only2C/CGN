var turn = 0;
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
    src = "../static/mall/images/default_small.png"
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
                "id" : "detail",
                "url" : "html/detail/detail.html",
                "pageParam" : {
                    options:options
                },
                "addBackListener":"true"
            });
		},
		addToCart:function(data){
			var mCode = data.mCode;
	        var fCode = data.fCode;
	        var fName = data.fName;
	        if(data.stock=='-'){
	        	summer.toast({
                     "msg" : "库存为零" 
                })
	        	return;
	        }
	        var p_conditions = {};
	        p_conditions['amount'] = 1;
	        p_conditions['fcode'] = fCode;
	        p_conditions['mcode'] = mCode;
	        p_conditions['cartstype'] = '1';
	        var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
	        p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/save', enc_conditions,'addToCart');
	       
		},
		chooseOrg:function(item){
				var p_conditions = {
                    fcode:item.cgnFCode
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
    $('#searchInput').on('keyup',function(e){
    	if(e.keyCode==13){
    		viewModel.searchAttention();
    	}
    })
}
function initPage (keyW){
		if(keyW){
			var p_conditions = {
				queryString:keyW
			};
		}else{
			var p_conditions = {};
		}
		
	    var page_params={"pageIndex":1,"pageSize":20};  //分页
	    var sortItem = {};
	    var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	    p_async_post(ip+'/ieop_base_mobile/mfrontmallmaterialfavorites/querypage', paramData,'querypage');
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
	 //获取库存
    var tmpList = res.retData.ents;
    viewModel.mList(res);
	var cgnFCodes = '';
	var cgnMCodes = '';
	for(var i =0,len=tmpList.length;i<len;i++){
		cgnFCodes = cgnFCodes+tmpList[i].factoryCode+'#';
		cgnMCodes = cgnMCodes+tmpList[i].materialCode+'#';
	}     
	var p_conditions = {"fCodes":cgnFCodes.substring(0,cgnFCodes.length-1)};  //条件
	p_conditions["mCodes"] = cgnMCodes.substring(0,cgnMCodes.length-1);
	var page_params={"pageIndex":1,"pageSize":20};  //分页
	var sortItem = {};
	var data1 = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontmalltransferorder/getpriceandstock', data1,'getpriceandstock');
	
}
function getpriceandstock(ret){
	var retData = ret.retData.ents;
	var mds = {};
    for(var i=0;i<retData.length;i++){
    	var key = retData[i].cgnFCode+','+retData[i].cgnMCode;
		mds[key] = retData[i];
    }
    if(viewModel.mList().status==1){
    	var attentionList = viewModel.mList().retData.ents;
    	for(var i =0;i<attentionList.length;i++){
    		var key = attentionList[i].factoryCode+','+attentionList[i].materialCode;
    		if(attentionList[i].materialImgUrl){
    			attentionList[i].materialImgUrl = summer.getStorage("imgBaseUrl")+attentionList[i].materialImgUrl;
    		}
    		if(mds[key]){
    			attentionList[i].stock = parseInt(mds[key].labst)
    		}else {
    			attentionList[i].stock = '-';
    		}
    	}
    	viewModel.attentionList(attentionList);
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
function addToCart(data){
	 if(data.status==1){
	    openWin1('cart');
	 }else{
	    summer.toast({
            "msg" : "加入仓库失败" 
        })
	 }
}