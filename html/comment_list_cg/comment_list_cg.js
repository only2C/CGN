var curPage = 1;
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
function closeWin(){
	summer.closeWin();
}
function nofind(_this,type){  
    src = "../static/mall/images/default_img.png"
    _this.src = src
    _this.onerror=null;
}
summerready = function(){
	window.ip = summer.getStorage("ip");
	var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    window.viewModel = {
    	tabIndex:ko.observable(isSuppliers?1:2),
    	giveList:ko.observableArray(),
    	fromList:ko.observableArray(),
    	totalPage:ko.observable(),
    	isSuppliers:ko.observable(isSuppliers),
        tmpArr:ko.observableArray(),
    	changeTab:function(index){
    		curPage=1;
    		viewModel.tabIndex(index);
    		getList();
    		myScroll.scrollTo(0, 0, 200, 'easing');
    	},
        openPageDetail:function (data) {
    	    if(summer.getStorage("isSupplier") == "01"){
                var options ={
                    suStoreCode:data.suStoreCode,
                    materialCode:data.suMaterialCode
                };
                summer.openWin({
                    "id": "detail",
                    "url": "html/detail_supplier/detail_supplier.html",
                    "pageParam": {
                        options: options
                    }
                });
            }else{
                var options ={
                    ieopEnterpriseCode:data.suCompanyCode,
                    suMCode:data.suMaterialCode,
                    suStoreCode:data.suStoreCode
                };
                summer.openWin({
                    "id": "detail",
                    "url": "html/detail_cg/detail_cg.html",
                    "pageParam": {
                        options: options
                    }
                });
            }

        }
    }
    ko.applyBindings(viewModel);
    getList();
}﻿ 
function getList(curPage){
	var p_conditions = {
        
    };
    var bb = p_page_params_con_dataj_enc(p_conditions,{"pageIndex":curPage,"pageSize":10},{});
    if(viewModel.tabIndex()==2){
    	if(viewModel.isSuppliers()){
    		baseUrl = '/ieop_base_mobile/mfrontsumaterialorderevaluation/queryfrom';
    	}else{
    		baseUrl = '/ieop_base_mobile/mfrontsumaterialorderevaluation/querybuyto';
    	}
    }else {
    	if(viewModel.isSuppliers()){
    		baseUrl = '/ieop_base_mobile/mfrontsumaterialevaluation/querysellto';
    	}else{
    		baseUrl = '/ieop_base_mobile/mfrontsumaterialevaluation/queryfrom'
    	}
    }
    p_async_post(ip+baseUrl, bb,'queryfromBack');
}
$('.pull_icon').addClass('loading');
$('.more span').text('加载中...');
$('.drop').on('click', function () {
    var $this = $(this);
    $this.next().removeClass('limith');
})
myScroll = null;
window.mycall = function () {
    window.myScroll = new JRoll('#swrapper', {
        preventDefault: false,
        mouseWheel: true,
        momentum: true,
        fadeScrollbars: true,
        useTransform: true,
        useTransition: true,
        click: true,
        tap: true
    })
    myScroll.on('scrollStart', function () {
        console.log('scrollStart');
    })
    myScroll.on('scroll', function () {
        console.log('scroll'+this.y+'-'+this.maxScrollY);
        if (this.y < (this.maxScrollY)) {
            $('.pull_icon').addClass('flip');
            $('.pull_icon').removeClass('loading');
            $('.more span').text('释放加载...');
        } else {
            $('.pull_icon').removeClass('flip loading');
            $('.more span').text('上拉加载...')
        }
    })
    myScroll.on('scrollEnd', function () {
        console.log('scrollEnd');
        if (curPage >= viewModel.totalPage()) {
            $('.more i').hide();
            $('.more span').text('没有更多了');
            return;
        }
        if ($('.pull_icon').hasClass('flip')) {
            $('.pull_icon').addClass('loading');
            $('.more span').text('加载中...');
            console.log('pullupA')
            pullUpAction();
        }
    })
    myScroll.on('refresh', function () {
        if ($('.scroller').height() < $('#swrapper').height()) {
            $('.more').hide();
        }
        $('.more').removeClass('flip loading');
        $('.more span').text('上拉加载...');
    })

    function pullUpAction() {
        console.log('请求')
        curPage++;
        if (curPage <= viewModel.totalPage()) {
            getList(curPage);
        } else {

        }
    }

    if ($('.scroller').height() < $('#swrapper').height()) {
        $('.more').hide();
    }
}
$('.pull_icon').addClass('flip').addClass('loading');
$('.more span').text('加载中...');
var s_map = {};
function queryfromBack(data){
	var tmpArr = data.retData.ents;
    var spaInfos = data.retData.spaInfos;
    viewModel.totalPage(data.pageParams.totalPage);
    var tmpObj = {};
    if(tmpArr.length>0){
        if(viewModel.tabIndex()!=2&&spaInfos!=undefined){
            for(var i=0;i<spaInfos.length;i++){
                tmpObj = spaInfos[i];
                key = tmpObj.orderId+","+tmpObj.orderCid;
                if(null == s_map[key] || s_map[key] == undefined){
                    tArr = [];
                }else{
                    tArr = s_map[key];
                }
                tArr.push(tmpObj);
                s_map[key] = tArr;
            }
        }
    }
    if(tmpArr.length!=0){
        var suMCodes ="";
        var suStoreCodes ="";
        var ieopEnterpriseCodes ="";
        for(var i = 0; i < tmpArr.length; i++){
            var ent = tmpArr[i];
            suMCodes += ent.suMaterialCode + "#";
            suStoreCodes += ent.suStoreCode + "#";
            ieopEnterpriseCodes += ent.suCompanyCode + "#";
        }
        suMCodes = suMCodes.substring(0,suMCodes.length-1);
        suStoreCodes = suStoreCodes.substring(0,suStoreCodes.length-1);
        ieopEnterpriseCodes = ieopEnterpriseCodes.substring(0,ieopEnterpriseCodes.length-1);
        viewModel.tmpArr(tmpArr);
        var info = {};
        info['suMCodes'] = suMCodes;
        info['suStoreCodes'] = suStoreCodes;
        info['ieopEnterpriseCodes'] = ieopEnterpriseCodes;
        var bb = p_params_con_dataj_enc(info);
        var data = p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescodes', bb , 'querybymescodesBack');
    }
    
}
function querybymescodesBack(data){
    if(data.status==1){
        var refents = data.retData.ents;
        var refObj = {};
        for(var j=0;j<refents.length;j++){
            var ent = refents[j];
            var key = ent.suMCode+"#"+ent.suStoreCode+"#"+ent.ieopEnterpriseCode;
            refObj[key] = ent;
        }
        var ods = [];
        for(var i=0;i<viewModel.tmpArr().length;i++){
            var od = viewModel.tmpArr()[i];
            var key = od.suMaterialCode+"#"+od.suStoreCode+"#"+od.suCompanyCode;
            var refm = refObj[key];
            if(refm!=undefined){
                od['suMRefCode'] = refm['suMRefCode'];
            }
            key = od.orderId+","+od.orderCid;
            if(null != s_map[key] && s_map[key] != undefined){
                tArr = s_map[key];
                for(var j=0;j<tArr.length;j++){
                    var son = tArr[j];
                    od['addComment'] = son; //追评只有一次，所以存了obj，多次追评时需修改为数组
                }
            }else {
            	od['addComment'] = undefined;
            }
            ods.push(od);
        }
        ods.forEach(function (value) {
            value.evaluationUrls = value.evaluationUrls ?summer.getStorage("imgBaseUrl")+value.evaluationUrls:''
        })
        viewModel.tmpArr(ods);
        if(viewModel.tabIndex()==(viewModel.isSuppliers()?1:2)){
        	if(viewModel.isSuppliers()){
                giveList();
        	}else{
        		fromList();
        	}
        }else {
        	if(viewModel.isSuppliers()){
        		fromList();
        	}else{
        		giveList();
        	}
        }
    }else{
        summer.toast({
            "msg":data.msg
        })
    }
}
function giveList(){
    if(curPage==1){
        viewModel.giveList(viewModel.tmpArr());
        if (myScroll) {
            setTimeout(function(){
                myScroll.refresh();
            },100)
        }
        if(viewModel.tmpArr().length<=0){
            $('.more').hide();
        }
    }else{
        viewModel.giveList(viewModel.giveList().concat(viewModel.tmpArr()));
        setTimeout(function(){
            myScroll.refresh();
        },100)
    }
    if (!myScroll) {
        mycall();
    }
}
function fromList(){
    if(curPage==1){
        viewModel.fromList(viewModel.tmpArr());
        if (myScroll) {
            setTimeout(function(){
                myScroll.refresh();
            },100)
        }
        if(viewModel.tmpArr().length<=0){
            $('.more').hide();
        }
    }else{
        viewModel.fromList(viewModel.fromList().concat(viewModel.tmpArr()));
        setTimeout(function(){
            myScroll.refresh();
        },100)
    }
    if (!myScroll) {
        mycall();
    }
}