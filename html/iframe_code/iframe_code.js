function closeWin (){
    summer.closeWin()
}
window.ip = summer.getStorage("ip");

function keyBack() {
    turn++;
    if (turn == 2) {
        clearInterval(intervalID);
        summer.exitApp()
    } else {
        summer.toast({"msg": "再按一次返回键退出!"});
    }
    var intervalID = setInterval(function () {
        clearInterval(intervalID);
        turn = 0;
    }, 3000);
}
function openWin1 (winId){
    //var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
    var statusBarStyle = 'dark';
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        isKeep:false,
        statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}

summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        isAndriod:ko.observable($summer.os=='android'),
        iframeList:ko.observableArray([]),
        openDetailWin:function(suFaCode){
            summer.openWin({
                "id" : "iframeDetail",
                "url" : "html/iframe_detail/iframe_detail.html",
                "pageParam":{
                    "title":"框架协议",
                    "suFaCode":suFaCode
                }
            });
         }
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    queryIframe();
}

//查询框架列表
function queryIframe(){
    var param = p_page_params_con_dataj_enc({ "pageIndex":1,"pageSize":100});
    p_async_post(ip + '/ieop_base_mobile/mfrontsuframeworkagreement/querypage', param, 'iframeCallback');
    //suFaSta   1 启用  0 禁用
}
function iframeCallback(res) {
    var ents = res.retData.ents;
    viewModel.iframeList(ents);

}