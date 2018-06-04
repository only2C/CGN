function closeWin(){
	summer.closeWin();
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	
}
function changePass(){
	var info = {};
    info['old_password'] = $('#oldPass').val();
    info['new_password'] = $('#newPass').val();
    info['confirm_password'] = $('#repeatPass').val();
    var bb = p_params_dataj_ent_enc(info);
	p_async_post(ip+'/ieop_base_mobile/mfrontmalluser/modifypwd', bb,'modifypwd');
}
function modifypwd(data){
	if(data.status==1){
		summer.toast({
             "msg" : "密码修改成功" 
        })
	}else{
		summer.toast({
             "msg" : data.msg 
        })
	}
}
