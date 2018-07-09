function closeWin (){
    summer.closeWin();
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        tabIndex:ko.observable(0),
        status:ko.observable(summer.pageParam.status),
        mallLCompanyCode:ko.observable(),
        mallLCompany:ko.observable(),
        remark:ko.observable(),
        changeTab:function (index,data) {
            viewModel.tabIndex(index);
        },
        sendExpress:function () {
            var tabIndex = viewModel.tabIndex();
            var param ={};


            if(tabIndex == 1 || summer.pageParam.status==9){
                param ={
                    mallLCodes:$("#expressId").val(),
                    mallLCompanyCodes:viewModel.mallLCompanyCode()?viewModel.mallLCompanyCode():'youzhengguonei',
                    mallLCompanys:viewModel.mallLCompany()?viewModel.mallLCompany():'邮政包裹/平邮',
                    mallLCosts:$("#expressCost").val(),
                    mallLCostTypes:  $("input[name='expressCost']:checked").val() ?   $("input[name='expressCost']:checked").val() :4,
                    mallLContents:$('#remark').val(),
                    status:'9',
                    id:summer.pageParam.expressObj.id
                }
            }else{
                param ={
                    'offlinedeliver':'1',
                    'status': '9',
                    'id':summer.pageParam.expressObj.id
                }
            }
			var postUrl = summer.pageParam.status == 9?'/ieop_base_mobile/mfrontsumallorder/uswfreceiptmutiple':'/ieop_base_mobile/mfrontsumallorder/uswfreceipt';
            p_async_post(ip+postUrl, p_params_con_dataj_enc(param),'sendExpressCallback');
        },
        selectChange:function (data,el) {
          var index = el.target.selectedIndex;
          viewModel.mallLCompany(el.target.options[index].text);
          viewModel.mallLCompanyCode(el.target.options[index].value);

        }
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
}

function sendExpressCallback(res){

    if(res.status ==1 ){
        summer.toast({
            "msg":"发货成功！",
            "duration":"short"
        });
        closeWin();
        var getDataStr = 'getData('+summer.pageParam.status+','+summer.pageParam.kwd+',1)';
        summer.execScript({
            winId: 'supplier',
            script: getDataStr
        })
    }else{
        summer.toast({
            "msg":res.msg,
            "duration":"short"
        });
    }
}
$(function () {
    $("#expressSelect").select2();
});
