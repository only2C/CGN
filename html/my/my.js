var turn = 0;
var systemList =[{name: "去采购", code: 0}, {name: "去调拨", code: 1}];
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
    if(viewModel.stype()==0&&winId=='attention'){
		winId='attention_cg';
	}
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


var stype = summer.getStorage("stype")?summer.getStorage("stype"):0;
var stypeText = stype==1?'去调拨':'去采购';

summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var userInfo = JSON.parse(summer.getStorage("userInfo"));
    var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    var viewModel = {
        userName:ko.observable(userInfo.username),
        ufn:ko.observable(summer.getStorage('ufn')),
        isAndriod:ko.observable($summer.os=='android'),
        systemType: ko.observable(stypeText),
        stype:ko.observable(summer.getStorage("stype")),
        systemArr: ko.observableArray([]),
        systemFlag:ko.observable(stype),
        isCG:ko.observable(true),    //采购
        isDB:ko.observable(false),  // 调拨
        isSupplier:ko.observable(isSuppliers), // 供应商
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
        },
        chooseSystem:function(){
            viewModel.systemArr(systemList);
            $('.system-list').fadeIn();
        },
        chooseSystemArr:function (item) {
            viewModel.systemType(item.name);
            $('.system-list').fadeOut();
            summer.setStorage('stype',item.code);
            if(item.code == 0){
                viewModel.isCG(true);
                viewModel.isDB(false);
            }else{
                viewModel.isCG(false);
                viewModel.isDB(true);
            }
        }


    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(!isSuppliers){  //供应商
        viewModel.isCG(false);
        viewModel.isDB(false);
    }else{
        if(stype == 0){
            viewModel.isCG(true);
            viewModel.isDB(false);
        }else{
            viewModel.isCG(false);
            viewModel.isDB(true);
        }
    }



    var  $drop2 = $(".drop2");
    $drop2.on('click', function () {
       // $('.system-list').slideToggle();
       // $drop2.fadeToggle();
    })
}