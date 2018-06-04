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

    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);

}