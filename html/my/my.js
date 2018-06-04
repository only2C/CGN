var turn = 0;

function keyBack(){
    turn++;
    if(turn==2){
        clearInterval(intervalID);
        summer.exitApp()
    }else{
        summer.toast({"msg":"再按一次返回键退出!"});
    }
    var intervalID = setInterval(function() {
        clearInterval(intervalID);
        turn=0;
    }, 3000);
}
function openWin (winId){
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            subType:"from_right", //动画子类型（详见动画子类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        statusBarStyle:'dark',
        "addBackListener":"true"
    });
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
    var userInfo = JSON.parse(summer.getStorage("userInfo"));
    var isSupplier = summer.pageParam.isSupplier ;
    if(isSupplier){
        $("#footer").hide();
    }


    var viewModel = {
        userName:ko.observable(userInfo.username),
        ufn:ko.observable(summer.getStorage('ufn')),
        isAndriod:ko.observable($summer.os=='android'),
        openList:function(type,enter){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/order_list/order_list.html",
                "pageParam" : {
                    type:type,
                    enter:enter
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openList2:function(status){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/order_list/order_list.html",
                "pageParam" : {
                    status:status
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openStore:function(){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/my_store/my_store.html",
                "pageParam" : {
                    status:status
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openIframeCode:function(){
            summer.openWin({
                "id" : "iframeCode",
                "url" : "html/iframe_code/iframe_code.html",
                "animation":{
                type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
            }
            });
        },
        toPersonInfo:function(){
            summer.openWin({
                "id" : "personInfo",
                "url" : "html/person_info/person_info.html",
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                }
            });
        }
    }
    ko.applyBindings(viewModel);
}