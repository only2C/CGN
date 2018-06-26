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
function openWin1 (winId){
	//var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
	var statusBarStyle = 'dark';
	if(viewModel.stype()==0&&winId=='attention'){
		winId='attention_cg';
	}
	if(viewModel.stype()==0&&winId=='cart'){
		winId='cart_cg';
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
	var myscroll,
		myscroll2;
	var ip = summer.getStorage("ip");
	var h = $(window).height()-$('#wrapper').offset().top-$('#footer').height()-22;
	document.getElementById('wrapper').style.height=h+'px';
	document.getElementById('mainRight').style.height=h+'px';
	$summer.fixStatusBar($summer.byId('header'));
	var platform = $summer.os;
	if(platform == "android"){
		   $('.um-border-bottom').css({'border-width':'0 0 1px 0','border-style':'solid'});
		   $('.um-border-top').css({'border-width':'1px 0 1px 0','border-style':'solid'});
		   $('.um-border-left').css({'border-width':'0 0 0 1px','border-style':'solid'});
		   $('.um-border-right').css({'border-width':'0 1px 0 0','border-style':'solid'});
	} else if(platform == "ios"){
		   $('.um-border-top.um-border-bottom').css({'border-width':'1px 0 1px 0'});
	} else if(platform == "pc"){
		      // 执行pc特殊代码
	}	
	//处理菜单数据
	var menuData = get_menus();

	var firstMenu = [];
	var secondMenu = [];
	var thirdMenu = [];

	var sortFunction = function(a,b){
	    return a.mgCOrder - b.mgCOrder;
	}
	for (var i = 0,len=menuData.length;i<len;i++){
	    menuData[i].child=[];
	    if(menuData[i].mgCLv==1){
	        firstMenu.push(menuData[i])
	    }
	    if(menuData[i].mgCLv==2){
	        secondMenu.push(menuData[i])
	    }
	    if(menuData[i].mgCLv==3){
	        thirdMenu.push(menuData[i])
	    }
	}
	firstMenu.sort(sortFunction);
	secondMenu.sort(sortFunction);
	thirdMenu.sort(sortFunction);
	function makeData(child,parent){
	    for(var i=0;i<parent.length;i++){
	        for(var j = 0;j<child.length;j++){
	            if(child[j].mgCPid == parent[i].id){
	                parent[i].child.push(child[j])
	            }
	        }
	    }
	}
	makeData(thirdMenu,secondMenu);
	makeData(secondMenu,firstMenu);
	//处理菜单数据结束
	var viewModel = {
		menu:ko.observableArray(firstMenu),
		defaultOrg:ko.observable(summer.getStorage("ufn")),
		organizationArr:ko.observableArray([]),
		stype:ko.observable(summer.getStorage("stype")),
		item:ko.observableArray([]),
		isAndriod:ko.observable($summer.os=='android'),
		openWin:function(thirdMenu){
			var openUrl = 'html/list_cg/list_cg.html';
			if(summer.getStorage("stype")=='1'){
				openUrl = 'html/list/list.html';
			}
			summer.openWin({
                "id" : "list",
                "url" : openUrl,
                "pageParam" : {
                    thirdMenu:thirdMenu,
                    options:{}
                }
            });
		},
		openSearch:function(){
			summer.openWin({
                "id" : "search",
                "url" : "html/search/search.html"
            });
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
	function loaded(){
		myscroll=new IScroll("#wrapper",{
			vScroll:true, 
			hScrollbar:false, 
			vScrollbar:false,
			click:true
		});
		myscroll2=new IScroll("#mainRight",{
			vScroll:true, 
			hScrollbar:false, 
			vScrollbar:false,
			click:true
		});
	}
	loaded();
	$('#categroyList').find('li').on('click',function(){
		var $this = $(this),
			index = $this.index();
		myscroll.scrollToElement(this,500);
		$this.addClass('on').siblings().removeClass('on');
		$('#mainRight').find('.iscroll-box').eq(index).addClass('on').siblings().removeClass('on');
		myscroll2.destroy();
		myscroll2=new IScroll("#mainRight",{
			vScroll:true, 
			hScrollbar:false, 
			vScrollbar:false,
			click:true
		});
	})
	var $drop = $('.drop');
	$('#changeOrgBtn').on('click',function(){
      var $this = $(this);
      if(viewModel.organizationArr().length<=0){
      	  var enc_conditions = p_page_params_con_dataj_enc({},{"pageIndex":1,"pageSize":100},{});
    	  p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/queryuserfactories', enc_conditions,'queryuserfactories');
          
      }
      $('.org-list').slideToggle();
      $('.drop').fadeToggle();
	})
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
function setuserfactory(result){
	if(result.status==1){
	   var item = viewModel.item()[0];
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