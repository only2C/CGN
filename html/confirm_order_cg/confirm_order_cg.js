function closeWin(){
	summer.closeWin();
}
function keyBack(){
    closeWin();
}
function openWin (winId){
	summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        addBackListener : "true",
    });
}
function nofind(_this,type){  
    src = "../static/mall/images/default_small.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var viewModel = {
		pLevel:ko.observable(''),
		ufn:ko.observable(summer.getStorage("ufn")),
		yyDate:ko.observable(''),
		cartType:ko.observable(summer.getStorage("cartType")),
		totalPrice:ko.observable(),
		mList:ko.observableArray([]),
		addressList:ko.observableArray([]),
		sendOrder:function(){
			//var p_receive_info = get_context_info('p_receive_info');
			//if(p_receive_info == null || p_receive_info.length == 0){
			    //summer.toast({
                     //"msg" : '请添加收货地址' 
                //});
			    //return;
			//}
			//  验证能否下单
			var user_carts_materials_ids= '';
			for(var i=0;i<viewModel.mList().length;i++){
				user_carts_materials_ids = user_carts_materials_ids+viewModel.mList()[i].id+'#';
			}
			var info = {};
	        info['userCartIds'] = user_carts_materials_ids;
	        var bb = p_params_con_dataj_enc(info);
	        //p_params_con_dataj_enc
	        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/valicarts', bb,'valiCarts');
		},
		openWin:function(winId){
			summer.openWin({
                "id" : winId,
                "url" : "html/"+winId+"/"+winId+".html",
                addBackListener : "true"
            });
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	//获取我的订单列表
    query_action();
    //获取收货地址列表
    initAddress();
    
    
	
	$('.scroller-date').scroller('destroy').scroller({
        preset: 'date',
        theme: "ios7",
        mode: "scroller",
        display: "bottom",
        animate: ""
    });
}
//获取订单列表
function query_action(){
    var cartType = viewModel.cartType();
    if(cartType == 1){
    	var p_conditions = {"buyStoreSwitch":"0"};
    }else{
    	var p_conditions = {"buyStoreSwitch":"1"};
    }
    var page_params={"pageIndex":1,"pageSize":1000};  //
    var sortItem = {};
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/queryorderpage', enc_conditions,'queryorderpage');
    
}
function valiCarts(res){
	if(res.status!=1){
		summer.toast({
             "msg" : res.msg
        })
		return;
	}
	var user_carts_materials_ids= '';
	var receiveId = viewModel.addressList()[0].id;
	var p_conditions = {};
	for(var i =0;i<viewModel.mList().length;i++){
		user_carts_materials_ids = user_carts_materials_ids+viewModel.mList()[i].id+'#';
	}
	p_conditions['userCartIds'] = user_carts_materials_ids;
	p_conditions['receiveId'] = receiveId;
	if(viewModel.cartType()=="1"){
       	p_conditions['buyStoreSwitch'] = '0'; 
    }else{
        var orderedExpectDate = viewModel.yyDate();
        p_conditions['buyStoreSwitch'] = '1'; 
        p_conditions['orderedExpectDate'] = orderedExpectDate;
    }
			
	var page_params={"pageIndex":1,"pageSize":10};  //
	var sortItem = {};
	var enc_conditions = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/saveaggs', enc_conditions,'saveAgg');
}
function initAddress(){
	viewModel.addressList([]);
	var flag = true;
    var info = {};
    var bb = p_params_dataj_ent_enc(info);
    p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/querymutiple', bb,'queryAddress');
}
function saveAgg(data){
	if(data.status==1){
		summer.openWin({
            "id" : "order_success",
            "url" : "html/order_success_cg/order_success_cg.html"
        });
	}else{
		summer.toast({
           "msg" : data.msg 
        })
	}
}
function queryorderpage(data){
	if(data.status == 1){
	    var ents = data.retData.ents;
	    var tmpArr = [];
	    var totalPrice = 0;
	    for(var i=0;i<ents.length;i++){
	        //if(ents[i].buyFactoryName==viewModel.ufn()){  todo，待确定
	        totalPrice += Number(Number(ents[i].sumallTPrice).toFixed(3));
            ents[i].mallTPrice  = Number(Number(ents[i].mallTPrice).toFixed(3));
            ents[i].materialImgUrl = ents[i].materialImgUrl ? summer.getStorage("imgBaseUrl")+ents[i].materialImgUrl:'';
	        tmpArr.push(ents[i]);
	        //}
	    }
	    ents = tmpArr;
	    viewModel.totalPrice(totalPrice);
	    viewModel.mList(ents);
	}else{
	    summer.toast({
             "msg" : data.msg 
        });
	}
}
function queryAddress(data){
	if(data.status==1){
    	var ents = data.retData.ents;
    	if(ents.length<=0){
    		UM.confirm({
			    title: '友情提示：',
			    text: '收货人地址为空，是否添加？',
			    btnText: ["取消", "确认"],
			    overlay: true,
			    ok: function () {
			        summer.openWin({
                        "id" : "add_address",
                        "url" : "html/add_address/add_address.html",
                        "pageParam":{
                        	"confirm":"confirm"
                        }
                    });
			    },
			    cancle: function () {
			        
			    }
			});
			return;
    	}
    	for(var i=0,len=ents.length;i<len;i++){
    		if(ents[i].evaluationStatus=="1"){
    			ents = [ents[i]];
    			break;
    		}
    	}
    	if(ents.length>1){
    		ents = [ents[0]];
    	}
    	ents[0].receiveArea = ents[0].receiveArea.replace(/#/g," ");
    	viewModel.addressList(ents);
    }else{
    	summer.toast({
             "msg" : data.msg 
        })
    }
}
