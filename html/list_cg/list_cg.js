function closeWin() {
    summer.closeWin()
}

function nofind(_this, type) {
    src = "../static/mall/images/default_small.png"
    _this.src = src
    _this.onerror = null;
}

function cloneObjectFn(obj) { // 对象复制
    return JSON.parse(JSON.stringify(obj))
}

summerready = function () {
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var thirdMenu = summer.pageParam.thirdMenu ? summer.pageParam.thirdMenu : [];
    window.pageSize = 1;
    window.myScroll = undefined;
    var initParams = cloneObjectFn(summer.pageParam);

    var viewModel = {
        listArr: ko.observableArray([]),
        cgnFName: ko.observableArray([]),
        cgnMApplyModelName: ko.observableArray([]),
        cgnMApplyPositionName: ko.observableArray([]),
        cgnMBrandName: ko.observableArray([]),
        cgnMFieldsName: ko.observableArray([]),
        cgnMProductName: ko.observableArray([]),
        mgCName: ko.observableArray([]),
        cgnSuName: ko.observableArray([]),
        cgnFNameItem: ko.observable(''),
        totalPage: ko.observable(''),
        thirdMenu: ko.observableArray(thirdMenu),
        isDBVisible:ko.observable(true),
        isCGVisible:ko.observable(false),
        openWin: function (options, data) {
        	console.log(options);
            summer.openWin({
                "id": "detail",
                "url": "html/detail_cg/detail_cg.html",
                "pageParam": {
                    options: options
                }
            });
        },
        openSearch: function () {
            summer.openWin({
                "id": "search",
                "url": "html/search/search.html"
            });
        },
        filterSearch: function () {
            queryPage(1);
            $('.filter-wp').hide();
            $('.drop').hide();
        },
        toggleF: function () {
            $('.filter-wp').toggle();
            $('.drop').toggle();

        },
        clearChoosen: function () {
            summer.pageParam = cloneObjectFn(initParams);
            $('.filter-wp li').removeClass('on');
        },
        changeFilters: function (data, obj, event) {
            for (i in data) {
                summer.pageParam.options[i] = data[i];
            }
            if ($(event.target).hasClass('on')) {
                summer.pageParam.options[i] = '';
                $(event.target).removeClass('on');
                return;
            }
            $(event.target).addClass('on').siblings('li').removeClass('on');
        }
    }
    window.viewModel = viewModel;
    $('.pull_icon').addClass('loading');
    $('.more span').text('加载中...');
    $('.drop').on('click', function () {
        var $this = $(this);
        $this.next().removeClass('limith');
    })
    ko.applyBindings(viewModel);
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
            console.log('scroll');
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
            if (pageSize >= viewModel.totalPage()) {
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
            pageSize++;
            if (pageSize < viewModel.totalPage()) {
                queryPage(pageSize);
            } else {

            }
        }

        if ($('.scroller').height() < $('#swrapper').height()) {
            $('.more').hide();
        }
    }
    $('.pull_icon').addClass('flip').addClass('loading');
    $('.more span').text('加载中...');

    //window.updateFilter = true;
    function queryPage(pageSize, category) {
        if (pageSize) {
            window.pageSize = pageSize;
        }
        if (category) {
            summer.pageParam.options['mgCName'] = category.mgCName;
            viewModel.cgnFNameItem(category.mgCName);
        }

        url = '/ieop_base_mobile/mfrontsusolr/getsumaterial';
        callback  = 'getsumaterial';


        var enc_conditions = p_page_params_con_dataj_enc(summer.pageParam.options, {
            "pageIndex": pageSize,
            "pageSize": 12
        }, {});
        p_async_post(ip + url, enc_conditions, callback );

    }

    queryPage(pageSize, thirdMenu[0]);
    $('#changeView').on('click', function () {
        $('#smallPic').toggle();
        $('#bigPic').toggle();
        mycall();
        myScroll.scrollTo(0, 0, 200, 'easing');

    })
    $('#thirdMenu').on('click', '.item', function () {
        var $this = $(this);
        queryPage(1, {mgCName: $this.html()});
        myScroll.scrollTo(0, 0, 200, true);
        $this.addClass('on').siblings().removeClass('on');
    })
    $('.drop').on('click', function () {
        $('.filter-wp').hide();
        $('.drop').hide();
    })
    $('.filter-item .fr').on('click', function () {
        var $this = $(this);
        $this.parent().next().toggleClass('limith');
    })
}
var myScrollMenu;


function getsumaterial(responseJSON) {
	if(responseJSON.status==0){
		summer.toast({
             "msg" : responseJSON.msg
        })
		return;
	}
    window.data = responseJSON.retData.data;
    if(data.length==0){
    	summer.toast({
             "msg" : "无数据"
        })
        $('.pull_icon').hide();
    	$('.more span').text('无数据');
        return;
    }
    var navigation = responseJSON.retData.navigation;
    
    var tmpArr = [];
    for (var i = 0, len = navigation.mgCName.length; i < len; i++) {
        if (navigation.mgCName[i] != '') {
            tmpArr.push({mgCName: navigation.mgCName[i]});
        }
    }
    viewModel.thirdMenu(tmpArr);
    viewModel.cgnFName(navigation.ieopEnterpriseName);
    viewModel.cgnMApplyModelName(navigation.suMApplyModelName);
    viewModel.cgnMApplyPositionName(navigation.suMApplyPositionName);
    viewModel.cgnMBrandName(navigation.suMBrandName);
    viewModel.cgnMFieldsName(navigation.suMFieldsName);
    viewModel.cgnMProductName(navigation.suMProductName);
    viewModel.mgCName(navigation.mgCName);
    //viewModel.cgnSuName(navigation.mgCName);
    if (!myScrollMenu) {
        myScrollMenu = new JRoll('#menu', {
            scrollX: true,
            click: true
        });
    } else {
        //myScrollMenu.refresh();
        $('#thirdMenu').css('transform', 'translate(0, 0)')
    }
    //window.updateFilter = false;
    viewModel.totalPage(responseJSON.pageParams.totalPage);
   	var ids="";
    for(var i= 0;i<data.length;i++){
    	data[i]['suMSmallimg'] = data[i]['suMSmallimgs'][0]?data[i]['suMSmallimgs'][0]:'../static/mall/images/default_small.png';
    	var id = data[i].id;//物料id
		ids += id + "#";
    }
	ids = ids.substring(0,ids.length-1);
	var info = {};
    info['ids'] = ids;
    var bb = p_params_con_dataj_enc(info);
    var ret = p_async_post(ip + '/ieop_base_mobile/mfrontsustorematerial/querybyids', bb, 'querybyids');

}
function querybyids(res){
	if(res.status==1){
		var ents = res.retData.ents;
    	for(var i =0;i<data.length;i++){
    		for(var k =0;k<ents.length;k++){
    			if(data[i].id==ents[k].id){
    				data[i]['suPrice'] = ents[k]['suPrice'];
    				data[i]['suMarStock'] = ents[k]['suMarStock'];
    			}
    		}
    		data[i]['suPrice'] = data[i]['suPrice']?data[i]['suPrice']:'';
    		data[i]['suMarStock'] = data[i]['suMarStock']?data[i]['suMarStock']:'';
    	}
    	if (pageSize == 1) {
	        viewModel.listArr(data);
	        if (myScroll) {
	            myScroll.refresh();
	        }
	        if (data.length <= 0) {
	            summer.toast({
	                "msg": "暂无内容"
	            })
	        }
	
	        $('#smallPic').removeClass('noshow');
	
	    } else {
	        viewModel.listArr(viewModel.listArr().concat(data));
	        myScroll.refresh();
	    }
	    if (!myScroll) {
	        mycall();
	    }
    }else{
        summer.toast({
             "msg" : res.msg
        })
    }
}
