function closeWin (){
    summer.closeWin()
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
    var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    var viewModel = {
		title:ko.observable( summer.pageParam.title),
        isAndriod:ko.observable($summer.os=='android'),
        isSupplier:ko.observable(isSuppliers),
        detailArr:ko.observableArray([]),
        rangArr:ko.observableArray([]),
        docArr:ko.observableArray([]),
        nullDataVisible:ko.observable(false),
        changeItem:function (index) {
            $(".iframe-nav-li").removeClass("active");
            $(".iframe-nav-li").eq(index).addClass("active");
            $(".iframe-item").addClass("hide");
            $(".iframe-item").eq(index).removeClass("hide");

            if(index == 1 && viewModel.rangArr() <= 0){
                viewModel.nullDataVisible(true);
            }else  if(index == 2 && viewModel.docArr() <= 0){
                viewModel.nullDataVisible(true);
            }else  if(index == 0 && viewModel.detailArr() <= 0){
                viewModel.nullDataVisible(true);
            }else{
                viewModel.nullDataVisible(false);
            }
        },
        downFile:function (url) {
            summer.openWebView({
                url:url
            })

            /*
            var params = ["android.permission.READ_EXTERNAL_STORAGE","android.permission.WRITE_EXTERNAL_STORAGE","android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE"];
            summer.getPermission(params,  function(args){
            }, function(args){
            })*/

        }
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    queryDeatil();
    queryRang();
    queryDoc()
}

var isSupplier = summer.getStorage("isSupplier") == "01";
function queryDeatil(){
    var url = 'mfrontsufamaterialref/querypage';
    if(isSupplier){
       url ='mfrontsufamaterialref/queryrefpage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":1,"pageSize":100,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryDetailCallback');
}

function queryRang(){
    var url = 'mfrontsufaapplication/querypage';
    if(isSupplier){
        url ='mfrontsufaapplication/querypage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":1,"pageSize":100,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryRangCallback');
}
function queryDoc(){
    var url = 'mfrontsufaattachments/querypage';
    if(isSupplier){
        url ='mfrontsufaattachments/querysupage';
    }
    var param = p_page_params_con_dataj_enc({ "pageIndex":1,"pageSize":100,"suFaCode":summer.pageParam.suFaCode});
    p_async_post(ip + '/ieop_base_mobile/'+url, param, 'queryDocCallback');
}

function queryDetailCallback(res) {
    var ents = res.retData.ents;
    viewModel.detailArr(ents);
    if(!ents || ents.length<=0){
        viewModel.nullDataVisible(true);
    }
}
function queryRangCallback(res){
    var ents = res.retData.ents;
    viewModel.rangArr(ents);
}
function queryDocCallback(res){
    var ents = res.retData.ents;
    ents.forEach(function(val){
        val.suFaaFileAddr = summer.getStorage("imgBaseUrl")+ val.suFaaFileAddr  ;
    })
    viewModel.docArr(ents);
}