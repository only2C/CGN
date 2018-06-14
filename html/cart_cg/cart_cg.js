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

var cartTypeList = [{id:0,name:'预约库'},{id:1,name:'采购库'}]

summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var viewModel = {
		operateText:ko.observable('编辑'),
		deleteOrChange:ko.observable(summer.getStorage('cartType')==1?'去下单':'预约'),
        cartType:ko.observable(),
		checkedAll:ko.observable(false),
		defaultOrg:ko.observable(summer.getStorage("ufn")),
		totalPrice:ko.observable(),
		chooseNum:ko.observable(0),
		ufn:ko.observable(summer.getStorage("ufn")),
		item:ko.observableArray([]),
		stype:ko.observable(summer.getStorage("stype")),
		orgItem:ko.observable([]),
		ents:ko.observable([]),
		organizationArr:ko.observableArray([]),
		cartList:ko.observableArray([]),
		isAndriod:ko.observable($summer.os=='android'),
        cartTypeArr:ko.observableArray([]),
		edit:function(){
			if(summer.getStorage('cartType')==1){
				this.deleteOrChange()=='去下单'?this.deleteOrChange('删除'):this.deleteOrChange('去下单');
			}else{
				this.deleteOrChange()=='预约'?this.deleteOrChange('删除'):this.deleteOrChange('预约');
			}
			this.operateText()=='完成'?this.operateText('编辑'):this.operateText('完成');
		},
		minus:function(item){
			if(item.materialTAmount()<=1){
				summer.toast({
                     "msg" : "至少调拨一件"
                })
                return;
			}
			var p_conditions = {};
	        p_conditions['id'] = item.id;
	        p_conditions['suStoreCode'] = item['suStoreCode'];
	        p_conditions['ieopEnterpriseCode'] = item['ieopEnterpriseCode'];
	        p_conditions['materialCode'] = item['materialCode'];
	        if(summer.getStorage("cartType")==1){
	        	p_conditions['buyStoreSwitch'] = '0';
	        }else{
	        	p_conditions['buyStoreSwitch'] = '1';
	        }
	        p_conditions['addAmount'] = '-1';
	        var bb = p_params_con_dataj_enc(p_conditions);
	        viewModel.item([item]);
	        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/save', bb,'minus');
            
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
			if(item.materialTAmount()>=item.stock){
				summer.toast({
                     "msg" : "调拨数量不能大于库存"
                })
                return;
			}
			var p_conditions = {};
	        p_conditions['id'] = item.id;
	        p_conditions['suStoreCode'] = item['suStoreCode'];
	        p_conditions['ieopEnterpriseCode'] = item['ieopEnterpriseCode'];
	        p_conditions['materialCode'] = item['materialCode'];
	        if(summer.getStorage("cartType")==1){
	        	p_conditions['buyStoreSwitch'] = '0';
	        }else{
	        	p_conditions['buyStoreSwitch'] = '1';
	        }
	        p_conditions['addAmount'] = '1';
	        var bb = p_params_con_dataj_enc(p_conditions);
	        viewModel.item([item]);
	        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/save', bb,'addNum');
		},
		chooseToggle:function(item){
			var flag = 0;
			var num = 0;
			var cartList = viewModel.cartList();
			var totalPrice=0;
			for(var i =0;i<cartList.length;i++){
				if(!cartList[i].choose()){
					flag = 1;
					updatesta(cartList[i].id,'0');
				}else{
					num++;
					totalPrice += Number(Number(cartList[i].sumallTPrice).toFixed(2));
					updatesta(cartList[i].id,'1');
				}
			}
			viewModel.totalPrice(totalPrice);
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
				var totalPrice=0;
				for(var i =0;i<len;i++){
					cartList[i].choose(true);
					totalPrice += Number(Number(cartList[i].sumallTPrice).toFixed(2));
					updatesta(cartList[i].id,'1');
				}
				viewModel.totalPrice(totalPrice);
				viewModel.chooseNum(len);
			}else{
				for(var i =0;i<len;i++){
					cartList[i].choose(false);
					updatesta(cartList[i].id,'0');
				}
				viewModel.totalPrice(0);
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
				        p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/delete', enc_conditions,'deleteCart');
				        
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
    			
		},
        chooseType:function(){
			$("#cart-type-list").fadeToggle();
		},
        setCartType:function(id,type){
			viewModel.cartType(type);
			if(id==1&&viewModel.deleteOrChange()!='删除'){
				viewModel.deleteOrChange('去下单');
			}else if(id==0&&viewModel.deleteOrChange()!='删除'){
				viewModel.deleteOrChange('预约');
			}
			summer.setStorage("cartType",id);
            $("#cart-type-list").fadeToggle();
            query_action();
        }
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	viewModel.cartTypeArr(cartTypeList);
    if(summer.getStorage("cartType")){
    	viewModel.cartType(cartTypeList[summer.getStorage("cartType")]["name"]);
	}

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
		p_conditions['ids'] = id;
		p_conditions['buyStoreStatus'] = status;
		var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
		p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/updatestas', enc_conditions,'updatesta');
		
    }
    //获取列表
	
}
function query_action(){
	    //查询仓库列表
	    //区分预约和采购
	if(summer.getStorage("cartType")==1){
		var p_conditions = {"borrowStoreSwitch":"0"};
	}else{
		var p_conditions = {"buyStoreSwitch":"1"};
	}
	var page_params={"pageIndex":1,"pageSize":1000};  //分页
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/querypage', enc_conditions,'queryCarts');
	      
}
function queryCarts (data){
		var cartType = summer.getStorage("cartType");   //0  预约库 ， 1 采购库
		if(data.status==1){
	    	var ents = data.retData.ents;
	    	if(ents.length==0){
	    		viewModel.cartList(ents);
	    		return;
	    	}
	    	var len = ents.length;
	    	var ieopEnterpriseName = "";
	        var suMCodes = "";
	        var suStoreCodes = "";
	        var ieopEnterpriseCodes = "";
	    	viewModel.ents(ents);
	    	for(var i = 0; i < len; i++){
                ent = ents[i];
                suMCodes += ent.materialCode + "#";
                suStoreCodes += ent.suStoreCode + "#";
                ieopEnterpriseCodes += ent.ieopEnterpriseCode + "#";
            }
            suMCodes = suMCodes.substring(0,suMCodes.length-1);
            suStoreCodes = suStoreCodes.substring(0,suStoreCodes.length-1);
            ieopEnterpriseCodes = ieopEnterpriseCodes.substring(0,ieopEnterpriseCodes.length-1);
            var p_conditions = {};
            p_conditions['suMCodes'] = suMCodes;
            p_conditions['suStoreCodes'] = suStoreCodes;
            p_conditions['ieopEnterpriseCodes'] = ieopEnterpriseCodes;
		    var page_params={"pageIndex":1,"pageSize":20};  //分页
		    var sortItem = {};
		    var data1 = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
		    p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescodes', data1,'getpriceandstock');
	    	
	    }else {
	    	summer.toast({
	             "msg" : data.msg 
	        })
	    } 
}
function getpriceandstock(ret){
	if(ret.status==0){
		summer.toast({
             "msg" : ret.msg
        })
        return;
	}
	var retData = ret.retData.ents;
	var ents = viewModel.ents();
	var num = 0;
	var mds = {};
	for(var i=0;i<retData.length;i++){
	    var key = retData[i].cgnFCode+','+retData[i].cgnMCode;
		mds[key] = retData[i];
	}
	var tmpArr = [];
	var totalPrice=0;
	for(var i=0;i<ents.length;i++){
	   //ents[i].materialImgUrl = summer.getStorage("imgBaseUrl") + ents[i].materialImgUrl; 		
	   //if(ents[i].borrowFactoryName==viewModel.defaultOrg()){
	      var choose = ents[i].buyStoreStatus ==1?true:false;
		  //var key = ents[i].supplyFactoryCode+','+ents[i].materialCode;
		  ents[i].suPrice = Number(ents[i].sumallTPrice).toFixed(2);
		  if(choose){
		  	totalPrice += Number(ents[i].suPrice);
		    num++;
		  }
		  ents[i].materialTAmount = parseInt(ents[i].materialTAmount);
		  if(parseInt(ents[i].suMarStock)){
        	  ents[i].stock = parseInt(ents[i].suMarStock);
	      }else{
	          ents[i].stock = '-'; 
	      }
		  ents[i].choose = ko.observable(choose);
		  ents[i].materialTAmount = ko.observable(ents[i].materialTAmount);
		 // ents[i].mallTAmount = ko.observable(ents[i].mallTAmount);
	      tmpArr.push(ents[i]);
	   //}
	}
	viewModel.totalPrice(Number(totalPrice).toFixed(2));
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
       var tmp =parseInt(item.materialTAmount())-1;
       item.materialTAmount(tmp);
            	
    }else {
       summer.toast({
           "msg" : data.msg 
       })
    }
}
function addNum(data){
	if(data.status == 1){
		var item = viewModel.item()[0];
        var tmp = parseInt(item.materialTAmount())+1;
        item.materialTAmount(tmp);
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