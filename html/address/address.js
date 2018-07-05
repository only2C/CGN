function closeWin(){
	var initAddress = 'initAddress();';
	var stype=summer.getStorage("stype");
	var fromPage = summer.pageParam.fromPage;
	if(fromPage!='my'){
		if(stype==0){
			summer.execScript({
		    	winId: 'confirm_order_cg',
		    	script: initAddress
			});
		}else{
			summer.execScript({
		    	winId: 'confirm_order',
		    	script: initAddress
			});
		}
	}
	summer.closeWin();
}
function keyBack(){
	closeWin();
}
var ip = summer.getStorage("ip");
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	
	var viewModel = {
		addressList:ko.observableArray(),
		setDefaultAdd:function(id){
			var p_conditions = {};
	        p_conditions['id'] = id;
	        var page_params={"pageIndex":1,"pageSize":20};  //分页
	        var sortItem = {};
	        var bb = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
	        p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/updateStatus', bb,'updateStatus');
		},
		editAddress:function(item){
			summer.openWin({
                "id" : "edit_address",
                "url" : "html/edit_address/edit_address.html",
                "pageParam" : {
                    item:item
                }
            });
		},
		openWin:function(winId){
			summer.openWin({
		        "id" :winId,
		        "url" : "html/"+winId+"/"+winId+".html",
		        
		    });
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	
    pageLoad();
}
function updateStatus(data){
	if(data.status==1){
		pageLoad();
		summer.toast({
             "msg" : "更改成功" 
        })
	}else{
		summer.toast({
             "msg" : data.msg 
        })
	}
}
function pageLoad(){
	//收获地址列表
	var info = {};
    var bb = p_params_dataj_ent_enc(info);
    p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/querymutiple', bb,'queryAddress');
}
function queryAddress(data){
	if(data.status==1){
    	var ents = data.retData.ents;
    	for(var i=0,len=ents.length;i<len;i++){
    		ents[i].receiveArea = ents[i].receiveArea.replace(/#/g," ");
    	}
    	viewModel.addressList(ents);
    }else{
    	summer.toast({
             "msg" : data.msg 
        })
    }
}
function keyBack(){
    closeWin();
}
