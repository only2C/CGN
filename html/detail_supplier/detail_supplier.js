function closeWin (){
    summer.closeWin()
}
function keyBack(){
    closeWin();
}
function nofind(_this,type){
    src = "../../img/default_img.png"
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
        detailData: ko.observableArray([]),
        sumescodeObj:ko.observable()

    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    getSumescode();
}

function getDetail() {
    var obj = summer.pageParam.options;
    var condition ={
        materialCode:obj.materialCode,
        suStoreCode:obj.suStoreCode ,
    };
    var pageInfo ={"pageIndex":1,"pageSize":100};
    var param = p_page_params_con_dataj_enc(condition,pageInfo);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumaterial/queryaggsingle', param,'getDetailCallback');

}


function getDetailCallback(ret) {
    if(ret.status==0){
        UM.alert({
            title: ret.msg,
            overlay: true,
            ok: function () {
                closeWin();
            }
        });
        return;
    }
    var retData = ret.retData.aggEnt.mainEnt;
    retData.suPrice =  viewModel.sumescodeObj().suPrice;
    retData.suMRefCode = viewModel.sumescodeObj().suMRefCode;
    retData.suStoreName = viewModel.sumescodeObj().suStoreName;
    retData.suInvStock = parseInt(viewModel.sumescodeObj().suInvStock);
    viewModel.detailData([retData])

    var picArr = retData.suMSmallimgs.split("#");
    var list = [];
    for(var i=0;i<picArr.length;i++){
        picArr[i] = summer.getStorage("imgBaseUrl")+picArr[i];
        list.push({content:picArr[i]});
    }
    var islider = new iSlider({
        type: 'pic',
        data: list,
        dom: document.getElementById("iSlider-wrapper"),
        isLooping: true,
        animateType: 'default',
        isAutoplay: true,
        animateTime: 800
    });
    islider.addDot();

}



function getSumescode() {
    var obj = summer.pageParam.options;
    var condition ={
        suMCode:obj.materialCode,
        suStoreCode:obj.suStoreCode ,
    };
    var param = p_params_con_dataj_enc(condition);
    p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybysumescode', param,'sumesCallback');

}

function sumesCallback(data) {
    if(data.retData.ents.length==0){
        UM.alert({
            title: '物料已下架',
            btnText: ["确定"],
            overlay: true,
            ok: function () {
                closeWin();
            }
        });
        return;
    }
    if(data.status==1){
        viewModel.sumescodeObj(data.retData.ents[0]);
        getDetail();
    }
}