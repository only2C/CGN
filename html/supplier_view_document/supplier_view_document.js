var turn =  0 ;
function closeWin (){
    summer.closeWin();
 /*   if(summer.pageParam.backWinParam){
        summer.openWin({
            "id" :summer.pageParam.backWinParam.page,
            "url" : "html/"+ summer.pageParam.backWinParam.page + "/"+summer.pageParam.backWinParam.page+".html",
            "animation":{
                type:"none", //动画类型（详见动画类型常量）
                subType:"from_right", //动画子类型（详见动画子类型常量）
                duration:0 //动画过渡时间，默认300毫秒
            },
            "pageParam" : {
                status:summer.pageParam.backWinParam.status?summer.pageParam.backWinParam.status:''
            },
        });

    }else{

    }*/
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
        viewList:ko.observableArray([]),
        orderId:ko.observable( summer.pageParam.orderId ? summer.pageParam.orderId : summer.pageParam.mainId),
        downFile:function (url,data) {
            var platform = $summer.os;
            if(platform == "android"){
                // 执行android特殊代码
                var params = ["android.permission.READ_EXTERNAL_STORAGE","android.permission.WRITE_EXTERNAL_STORAGE",
                    "android.permission.READ_PHONE_STATE"];
                summer.getPermission(params,  function(args){
                    summer.openWebView({
                        url:url
                    })
                }, function(args){
                })
            } else {
                var xlsxFile = url.split(".");
                if (url && xlsxFile[xlsxFile.length-1] == 'xlsx') {   //iphone 手机浏览器不支持xlsx格式
                    UM.confirm({
                        title: '提示：',
                        text: 'iphone浏览器不支持xlsx格式，请在浏览器中选择其他应用打开。可使用wps打开此类文件。',
                        btnText: ["取消", "继续打开"],
                        overlay: true,
                        ok: function () {
                            summer.openWebView({
                                url: url
                            })
                        },
                        cancle: function () {
                        }
                    });
                }else{
                    summer.openWebView({
                        url: url
                    })
                }
            }
        }
    };
    window.viewModel = viewModel;
    getDocument();
    ko.applyBindings(viewModel);
}
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


function getDocument() {
    var param ={
        id:viewModel.orderId()
    }
    var params = p_params_con_dataj_enc(param);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/querysingle', params,'getDocumentCallback');
}
function getDocumentCallback(data){
    if(data.status == 1){
        getDocumentList();
    }
}
function getDocumentList() {

    var params = p_page_params_con_dataj_enc({suMallorderTid:viewModel.orderId()},{pageIndex:1,pageSize:10});
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorderattachments/querypage', params,'getDocumentListCallback');
}
function getDocumentListCallback(data) {
    var result = [];
    if(data.status==1){
        result =data.retData.ents;
        result.forEach(function(val){
            val.suMoaFileAddr = summer.getStorage("imgBaseUrl")+ val.suMoaFileAddr;
        })
    }
    viewModel.viewList(result);
}