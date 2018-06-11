function closeWin (){
    summer.closeWin()
}
var billStatus = {
    0:'待审核',  //显示审核按钮 买方
    1:'待发货',
    2:'未通过',  //显示确认按钮 买方
    3:'未审批取消',
    5:'已审批取消', //已发货前 买方
    6:'待签收',
    7:'已签收',
    8:'拒收',
    9:'待验收',
    10:'待结算',
    11:'已结算',
    12:'验收未通过',
    15:'其他',
    20:'待评价'
};
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        supplierList:ko.observableArray([]),
        getType:function(status){
            getData(status);
        },
        viewDocument:function (data) {
            summer.openWin({
                "id" :"supplier_view_document",
                "url" : "html/supplier_view_document/supplier_view_document.html",
                "pageParam" : {
                    'orderId':data.mainEnt.id
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:false,
                "addBackListener":"true"
            });
        }
    };
    window.viewModel = viewModel;
    getData();
    ko.applyBindings(viewModel);
}
function getData(status){
    var param ={
        pageIndex:1,
        pageSize:100
    }
    if(status != -1){  //status == -1  查看全部
        param.queryStatus = status?status:summer.pageParam.status;
    }

    var params = p_page_params_con_dataj_enc(param);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysupplymutiple', params,'getDataCallback');
}

function  getDataCallback(res) {
    var data =[];
    if(res.status==1){
        //allStatus
        data = res.retData.aggEnts;
        data.forEach(function (value) {
            value.mainEnt.allStatusName = billStatus[value.mainEnt.allStatus];
        })
    }
    viewModel.supplierList(data);
}