function closeWin (){
    summer.closeWin()
}
function keyBack(){
    closeWin();
}
function nofind(_this,type){
    src = "../static/mall/images/default_small.png"
    _this.src = src
    _this.onerror=null;
}

function openWin1 (winId){
    var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
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
summerready = function() {
    $summer.fixStatusBar($summer.byId('header'));
    var ufn = summer.getStorage("ufn");
    window.ip = summer.getStorage("ip");
    var platform = $summer.os;
    if (platform == "android") {
        $('.um-border-bottom').css({'border-width': '0 0 1px 0', 'border-style': 'solid'});
        $('.um-border-top').css({'border-width': '1px 0 1px 0', 'border-style': 'solid'});
        $('.um-border-left').css({'border-width': '0 0 0 1px', 'border-style': 'solid'});
        $('.um-border-right').css({'border-width': '0 1px 0 0', 'border-style': 'solid'});
    } else if (platform == "ios") {
        $('.um-border-top.um-border-bottom').css({'border-width': '1px 0 1px 0'});
    } else if (platform == "pc") {
        // 执行pc特殊代码
    }
    var viewModel = {

    }
    window.viewModel = viewModel;
    getDetail();
    ko.applyBindings(viewModel);
}

function getDetail() {
    var obj = summer.pageParam.expressObj;
    var condition ={
        materialCode:obj.materialCode,
        suStoreCode:obj.suStoreCode ,
    };
    var pageInfo ={"pageIndex":1,"pageSize":20};
    var param = p_page_params_con_dataj_enc(condition,pageInfo);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumaterial/queryaggsingle', param,'getDetailCallback');

}
function getDetailCallback(data) {

    data ;
}