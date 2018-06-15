function closeWin (){
    summer.openWin({
        "id" : "supplier",
        "url" : "html/list_supplier/list_supplier.html",
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            subType:"from_right", //动画子类型（详见动画子类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        "pageParam" : {
            status:summer.pageParam.status
        },
    });
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        tabIndex:ko.observable(0),
        mallLCompanyCode:ko.observable(),
        mallLCompany:ko.observable(),
        changeTab:function (index,data) {
            viewModel.tabIndex(index);
        },
        sendExpress:function () {
            var tabIndex = viewModel.tabIndex();
            var param ={};


            if(tabIndex == 1){
                param ={
                    mallLCode:$("#expressId").val(),
                    mallLCompanyCode:viewModel.mallLCompanyCode()?viewModel.mallLCompanyCode():'youzhengguonei',
                    mallLCompany:viewModel.mallLCompany()?viewModel.mallLCompany():'邮政包裹/平邮',
                    mallLCost:$("#expressCost").val(),
                    mallLCostType:  $("input[name='expressCost']:checked").val() ?   $("input[name='expressCost']:checked").val() :1,
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

            p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/uswfreceipt', p_params_con_dataj_enc(param),'sendExpressCallback');
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
    }else{
        summer.toast({
            "msg":res.msg,
            "duration":"short"
        });
    }
}
