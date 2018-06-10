function closeWin (){
    summer.closeWin()
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        viewList:ko.observableArray([])
    };
    window.viewModel = viewModel;
    getDocument();
    ko.applyBindings(viewModel);
}
function getDocument() {
    var id = summer.pageParam.orderId;
    var param ={
        id:id
    }
    var params = p_params_con_dataj_enc(param);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysingle', params,'getDocumentCallback');
}
function getDocumentCallback(data){

    if(data.status == 1){
        data.retData.ent;
        getDocumentList();
    }

}
function getDocumentList() {
    var id = summer.pageParam.orderId;
    // var param = {
    //     suMallorderTid:id,
    //     pageIndex:1,
    //     pageSize:10
    // }
    var params = p_page_params_con_dataj_enc({suMallorderTid:id},{pageIndex:1,pageSize:10});
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorderattachments/querypage', params,'getDocumentListCallback');
}
function getDocumentListCallback(data) {
    var result = [];
    if(data.status==1){
        result =data.retData.ents;
    }
    viewModel.viewList(result);
}