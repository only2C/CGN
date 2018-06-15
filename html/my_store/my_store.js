function closeWin (){
    summer.closeWin()
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        storeData:ko.observableArray([]),

    };

    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    getStoreInfo();

}
function getStoreInfo(){
    var param = p_page_params_con_dataj_enc({});
    p_async_post(ip + '/ieop_base_mobile/mfrontsuieopsupplier/querysingle', param, 'queryStoreCallback');
}
function queryStoreCallback(res){
    var val = res.retData.ent;
    val.address = val.ieopSuCity + val.ieopSuCounty;
    val.ieopSuLogo =summer.getStorage("imgBaseUrl")+val.ieopSuLogo;
    var list  = [] ;
    list.push(val);
    viewModel.storeData(list)
}