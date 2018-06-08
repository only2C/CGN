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

function closeWin (){
    summer.closeWin()
}

summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    window.ip = summer.getStorage("ip");
    var viewModel = {
        userInfo: ko.observableArray([]),
        saveUserInfo:function(){
            var  info = viewModel.userInfo();
            var param ={
                ieopUserCode:info[0].ieopUserCode,
                ieopUserMail:info[0].ieopUserMail,
                ieopUserName:info[0].ieopUserName,
                ieopUserPhone:info[0].ieopUserPhone,
                ieopUserSex:info[0].ieopUserSex,
                ieopUserTel:info[0].ieopUserTel,
            }
            var params = p_page_params_con_dataj_enc(param);
            p_async_post(ip + '/ieop_base_mobile/mfrontmalluser/update', params, 'saveCallback');
        }

    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    getUserInfo();
}
function getUserInfo(){
    var param = p_page_params_con_dataj_enc({});
    p_async_post(ip + '/ieop_base_mobile/mfrontmalluser/querysingle', param, 'userInfoCallback');
}
function userInfoCallback(res){
    var data = res.retData.ent;
    var list =[];
    list.push(data);
    viewModel.userInfo(list);
}

function saveCallback(res){
    if(res.status==1){
        UM.toast({
            text: '保存成功！',
            duration: 3000
        });
    }else{
        UM.toast({
            text: '保存失败！',
            duration: 3000
        });
    }

}