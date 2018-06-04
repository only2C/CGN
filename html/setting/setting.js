function closeWin(){
	summer.closeWin();
}
function keyBack(){
	closeWin();
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var viewModel = {
		logOut:function(){
			var info = {};
	        info['language_type']='0';
	        var bb = p_params_con_dataj_enc(info);
	        p_async_post(ip+'/ieop_base_mobile/mfrontmalluserlogin/logout', bb,'logout');
	        
		},
		openWin:function(winId){
			if(winId == 'suggest'){
				summer.toast({
                     "msg" : "正在开发中(●'◡'●)..." 
                })
				return;
			}
			summer.openWin({
		        "id" :winId,
		        "url" : "html/"+winId+"/"+winId+".html",
		        "animation":{
				    type:"none", //动画类型（详见动画类型常量）
				    subType:"from_right", //动画子类型（详见动画子类型常量）
				    duration:0 //动画过渡时间，默认300毫秒
		        },
		    });
		},
		changePass:function(){
			summer.openWin({
		        "id" :"modifypwd",
		        "url" : "html/modifypwd/modifypwd.html",
		        "animation":{
				    type:"none", //动画类型（详见动画类型常量）
				    subType:"from_right", //动画子类型（详见动画子类型常量）
				    duration:0 //动画过渡时间，默认300毫秒
		        },
		    });
		}
	}
	ko.applyBindings(viewModel);
}
function logout(data){
	if(data.status==1){
		summer.setStorage("userInfo", "");
		summer.closeWin({id:'home'});
		summer.openWin({
	        "id" : "login",
	        "url" : "html/login.html",
	        isKeep:false,
	        "addBackListener":"true"
	    });	        
	}else{
		summer.toast({
	         "msg" : data.msg 
	    })
	}
}