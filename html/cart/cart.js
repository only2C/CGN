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
function openWin (winId){
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
    });
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
        //statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}


summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var viewModel = {
		operateText:ko.observable('编辑'),
		deleteOrChange:ko.observable('调拨'),
		checkedAll:ko.observable(false),
		defaultOrg:ko.observable(summer.getStorage("ufn")),
		chooseNum:ko.observable(0),
		ufn:ko.observable(summer.getStorage("ufn")),
		item:ko.observableArray([]),
		stype:ko.observable(summer.getStorage("stype")),
		orgItem:ko.observable([]),
		ents:ko.observable([]),
		organizationArr:ko.observableArray([]),
		cartList:ko.observableArray([]),
		isAndriod:ko.observable($summer.os=='android'),
		edit:function(){
			this.deleteOrChange()=='调拨'?this.deleteOrChange('删除'):this.deleteOrChange('调拨');
			this.operateText()=='完成'?this.operateText('编辑'):this.operateText('完成');
		},
		minus:function(item){
			if(item.mallTAmount()<=1){
				summer.toast({
                     "msg" : "至少调拨一件"
                })
                return;
			}
			var p_conditions = {};
			p_conditions['amount'] = -1;
            p_conditions['fcode'] = item['supplyFactoryCode'];
            p_conditions['mcode'] = item['materialCode'];
            var page_params={"pageIndex":1,"pageSize":20};  //分页
            var sortItem = {};
            var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
            viewModel.item([item]);
            p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/save', enc_conditions,'minus');
            
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
		addNum:function(item){
			if(item.mallTAmount()>=item.stock){
				summer.toast({
                     "msg" : "调拨数量不能大于库存"
                })
                return;
			}
			var p_conditions = {};
			p_conditions['amount'] = 1;
            p_conditions['fcode'] = item['supplyFactoryCode'];
            p_conditions['mcode'] = item['materialCode'];
            var page_params={"pageIndex":1,"pageSize":20};  //分页
            var sortItem = {};
            var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
            viewModel.item([item]);
            p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/save', enc_conditions,'addNum');
            
		},
		chooseToggle:function(item){
			var flag = 0;
			var num = 0;
			var cartList = viewModel.cartList();
			for(var i =0;i<cartList.length;i++){
				if(!cartList[i].choose()){
					flag = 1;
					updatesta(cartList[i].id,0);
				}else{
					num++;
					updatesta(cartList[i].id,1);
				}
			}
			viewModel.chooseNum(num);
			if(flag == 1){
				viewModel.checkedAll(false);
			}else{
				viewModel.checkedAll(true);
			}
			return true;
		},
		checkAll:function(data){
			var cartList = viewModel.cartList(),
				len = cartList.length;
			if(viewModel.checkedAll()){
				for(var i =0;i<len;i++){
					cartList[i].choose(true);
					updatesta(cartList[i].id,1);
				}
				viewModel.chooseNum(len);
			}else{
				for(var i =0;i<len;i++){
					cartList[i].choose(false);
					updatesta(cartList[i].id,0);
				}
				viewModel.chooseNum(0);
			}
			viewModel.cartList(cartList);
			return true;
		},
		openWin:function(winId){
			if(viewModel.deleteOrChange()=='删除'){
				var cartList = viewModel.cartList();
				for(var i =0,len=cartList.length;i<len;i++){
					if(cartList[i].choose()){
						var p_conditions = {};
			        	p_conditions['id'] = cartList[i].id;
				        var page_params={"pageIndex":1,"pageSize":20};  //分页
				        var sortItem = {};
				        var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
				        p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/delete', enc_conditions,'deleteCart');
				        
					}
				}
				return;
			}
			if(viewModel.chooseNum!=0){
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
			    });
			}else{
				summer.toast({
                     "msg" : "请选择" 
                })
			}
		},
		chooseOrg:function(item){
				var p_conditions = {
                    ccode:item.cgnFCode
                };
                var page_params={"pageIndex":1,"pageSize":100};  //分页
                var sortItem = {};
                var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
                viewModel.orgItem([item]);
                p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/setuserfactory', paramData,'setOrg');
    			
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);

	query_action();
	
	$('#changeOrgBtn').on('click',function(){
          var $this = $(this);
          if(viewModel.organizationArr().length<=0){
          	  var enc_conditions = p_page_params_con_dataj_enc({},{"pageIndex":1,"pageSize":100},{});
        	  p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/queryuserfactories', enc_conditions,'queryF');
              
          }
          $('.org-list').slideToggle();
          $('.drop').fadeToggle();
    })  
    //确认订单
    function updatesta(id,status){
    	var p_conditions = {};
		p_conditions['id'] = id;
		p_conditions['confirmStatus'] = status;
		var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
		p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/updatesta', enc_conditions,'updatesta');
		
    }
    //获取列表
	
}
function query_action(){
	    //查询仓库列表
	var p_conditions = {};
	var page_params={"pageIndex":1,"pageSize":1000};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontmallusercarts/querypage', enc_conditions,'queryCarts');
	      
}
function queryCarts (data){
		if(data.status==1){
	    	var ents = data.retData.ents;
	    	viewModel.ents(ents);
	    	var cgnMCodes = '';
	    	var cgnFCodes = '';
	    	for(var i=0,len=ents.length;i<len;i++){
	    		cgnMCodes = cgnMCodes + ents[i].materialCode+"#";
	    		cgnFCodes = cgnFCodes +ents[i].supplyFactoryCode+"#";
	    	}
	    	var p_conditions = {"fCodes":cgnFCodes.substring(0,cgnFCodes.length-1)};  //条件
		    p_conditions["mCodes"] = cgnMCodes.substring(0,cgnMCodes.length-1);
		    var page_params={"pageIndex":1,"pageSize":20};  //分页
		    var sortItem = {};
		    var data1 = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
		    p_async_post(ip+'/ieop_base_mobile/mfrontmalltransferorder/getpriceandstock', data1,'getpriceandstock');
	    	
	    }else {
	    	summer.toast({
	             "msg" : data.msg 
	        })
	    } 
}
function getpriceandstock(ret){
	var retData = ret.retData.ents;
	var ents = viewModel.ents();
	var num = 0;
	var mds = {};
	for(var i=0;i<retData.length;i++){
	    var key = retData[i].cgnFCode+','+retData[i].cgnMCode;
		mds[key] = retData[i];
	}
	var tmpArr = [];
	for(var i=0;i<ents.length;i++){
	   ents[i].materialImgUrl = summer.getStorage("imgBaseUrl") + ents[i].materialImgUrl; 		
	   if(ents[i].borrowFactoryName==viewModel.defaultOrg()){
	      var choose = ents[i].borrowStoreStatus ==1?true:false;
		  if(choose){
		    num++;
		  }
		  var key = ents[i].supplyFactoryCode+','+ents[i].materialCode;
		  if(mds[key]){
		    	ents[i].stock = parseInt(mds[key].labst)
		  }else {
		    	ents[i].stock = '-';
		  }
		  ents[i].choose = ko.observable(choose);
		  ents[i].mallTAmount = ko.observable(ents[i].mallTAmount);
	      tmpArr.push(ents[i]);
	   }
	}
	ents = tmpArr;
	if(num==ents.length){
	    viewModel.checkedAll(true);
	}
	viewModel.chooseNum(num);
	viewModel.cartList(ents);
}
function minus(data){
	if(data.status == 1){
		var item = viewModel.item()[0];
       var tmp =parseInt(item.mallTAmount())-1;
       item.mallTAmount(tmp);
            	
    }else {
       summer.toast({
           "msg" : data.msg 
       })
    }
}
function addNum(data){
	if(data.status == 1){
		var item = viewModel.item()[0];
        var tmp = parseInt(item.mallTAmount())+1;
         item.mallTAmount(tmp);
    }else {
         summer.toast({
             "msg" : data.msg 
         })
    }
}
function updatesta(data){
	if(data.status == 1){
		
	}else{
		summer.toast({
            "msg" : data.msg 
        });
	}
}
function deleteCart (data){
	if(data.status == 1){
		query_action();
	}else{
		summer.toast({
	        "msg" : data.msg 
	    });
	}
}
function queryF(res){
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
function setOrg(result){
	if(result.status==1){
		var item = viewModel.orgItem()[0];
    	summer.setStorage("ufn", item.cgnFName);
    	viewModel.defaultOrg(item.cgnFName);
    	query_action();
    }else{
    	summer.toast({
            "msg" : result.msg
        })
    }
    $('.org-list').slideUp();
    $('.drop').hide();
}