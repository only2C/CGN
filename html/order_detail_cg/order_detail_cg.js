function closeWin() {
    summer.closeWin();
}

function keyBack() {
    summer.closeWin();
}

function nofind(_this, type) {
    src = "../static/mall/images/default_img.png"
    _this.src = src
    _this.onerror = null;
}

summerready = function () {
    $summer.fixStatusBar($summer.byId('header'));
    window.ip = summer.getStorage("ip");
    var type = summer.pageParam.type;
    var userInfo = summer.getStorage("userInfo");
    var mainId = summer.pageParam.mainId||summer.pageParam.orderId;
    var viewModel = {
        mainOrder: ko.observableArray([]),
        billStatus: ko.observable(),
        mainId: ko.observable(),
        progressPic: ko.observable(),
        childOrders: ko.observableArray([]),
        ieopUserTransferSta: ko.observable(JSON.parse(userInfo).ieopUserTransferSta),
        senderList: ko.observableArray([]),
        accessFoptions: ko.observableArray([]),
        changeStatusOptions: ko.observableArray([]),
        type: ko.observable(type),
        enter: ko.observable(summer.pageParam.enter),
        nullDataTips:ko.observable(false),
        changeStatus: function (options) {
            var info = {};
            info['id'] = options.id;
            info['status'] = options.status;
            if (options.status == 10) {
                info['returnDisc'] = options.returnDisc;
            }
            var bb = p_params_con_dataj_enc(info);
            viewModel.changeStatusOptions([options]);
            p_async_post(ip + '/ieop_base_mobile/mfrontmalltransferorder/updatestatus', bb, 'updatestatus');

        },
        accessF: function (options) {
            var p_conditions = {
                userFCode: options.fcode
            }
            var page_params = {"pageIndex": 1, "pageSize": 20};  //分页
            var sortItem = {};
            var enc_conditions = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
            viewModel.accessFoptions([options]);
            p_async_post(ip + '/ieop_base_mobile/mfrontmalluser/querypage', enc_conditions, 'querypage');

        },
        chooseClick: function (item) {
            var senderList = viewModel.senderList();
            for (var i = 0, len = senderList.length; i < len; i++) {
                if (senderList[i].id == item.id) {
                    senderList[i].choose(true);
                } else {
                    senderList[i].choose(false);
                }
            }
        },
        sendGoods: function (options) {
            summer.openWin({
                "id": "before_send",
                "url": "html/before_send/before_send.html",
                "pageParam": {
                    options: options
                }
            });
        },
        goLogistics: function (mainOrder) {
            summer.openWin({
                "id": "logistics",
                "url": "html/logistics_supplier/logistics_supplier.html",
                "pageParam": {
                    mainOrder: mainOrder()
                }
            });
        },
        openWin: function (options, data) {
            summer.openWin({
                "id": "detail",
                "url": "html/detail_cg/detail_cg.html",
                "pageParam": {
                    options: options
                }
            });
        },
        goComment: function (mainOrder) {
            summer.openWin({
                "id": "comment",
                "url": "html/comment/comment.html",
                "pageParam": {
                    mainOrder: mainOrder
                }
            });
        },
        sendBack: function (options) {
            UM.prompt({
                title: '退回描述',
                btnText: ["取消", "退回"],
                overlay: true,
                ok: function (data) {
                    options['returnDisc'] = data;
                    viewModel.changeStatus(options);
                },
                cancle: function (data) {

                }
            })
        },
        confirmClick: function (item) {
            UM.prompt({
                title: '请输入解冻凭证号',
                btnText: ["取消", "确定"],
                ok: function (data) {
                    var p_conditions = {
                        mainId: item.mallTId,
                        subId: item.id,
                        infoId: item.mallTChildId,
                        voucherCode: data
                    };
                    var page_params = {};  //
                    var sortItem = {};
                    var enc_conditions = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
                    p_async_post(ip + '/ieop_base_mobile/mfrontmalltransferorder/retconfirm', enc_conditions, 'retconfirm');

                },
                cancle: function (data) {

                }
            })
        },
        backClick: function (item) {
            summer.openWin({
                "id": "confirm_back",
                "url": "html/confirm_back/confirm_back.html",
                "pageParam": {
                    options: {
                        mainId: mainId,
                        item: item
                    }
                }
            });
        },
        giveComment: function (item, mainId) {
            summer.openWin({
                "id": "comment",
                "url": "html/comment/comment.html",
                "pageParam": {
                    item: item,
                    mainId: mainId()
                }
            });
        },
        viewDocument:function (data) {
            summer.openWin({
                "id" :"supplier_view_document",
                "url" : "html/supplier_view_document/supplier_view_document.html",
                "pageParam" : {
                    'orderId':data.id
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:false,
                "addBackListener":"true"
            });
        },
        sendExpress:function (data) {
            summer.openWin({
                "id" :"supplier_view_document",
                "url" : "html/list_supplier_express/list_supplier_express.html",
                "pageParam" : {
                    'expressObj':data.mainEnt
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:false,
                "addBackListener":"true"
            });
        },
        getPageDetail:function (data) {
            summer.openWin({
                "id" :"order_detail_supplier",
                "url" : "html/order_detail_supplier/order_detail_supplier.html",
                "pageParam" : {
                    'mainId':data.mainEnt.id
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                isKeep:false,
                "addBackListener":"true"
            });
        },
        payBill:function (data) {
            UM.confirm({
                title: '确认结算',
                text:'确认已经收到货款，将订单状态变成已结算？',
                btnText: ["取消", "确定"],
                overlay: true,
                ok: function () {
                    var param ={
                        id:data.mainEnt.id,
                        status:'11'
                    };
                    var params =  p_params_con_dataj_enc(param);
                    p_async_post(ip+'/ieop_base_mobile/mfrontsumallorder/ussettlemented', params,'payBillCallback');
                },
                cancle: function () {

                }
            })
        }
    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);


    querySingle();
    $('.drop,.cancel').on('click', function () {
        $('.drop').hide();
        $('.box').hide();
    })
    $('.confirm').on('click', function () {
        var senderList = viewModel.senderList();
        var flag = false;
        for (var i = 0, len = senderList.length; i < len; i++) {
            if (senderList[i].choose()) {
                var options = JSON.parse($('.confirm').attr('options'));
                var info = {};
                info['id'] = options.id;
                info['status'] = options.status;
                info['supplierCode'] = senderList[i].ieopUserCode;
                info['supplierId'] = senderList[i].id;
                info['supplierName'] = senderList[i].ieopUserName;

                var bb = p_params_con_dataj_enc(info);
                flag = true;
                p_async_post(ip + '/ieop_base_mobile/mfrontmalltransferorder/updatestatus', bb, 'accessStatus');
            }
        }
        if (!flag) {
            summer.toast({
                "msg": "至少选择一个收货人"
            })
        }
    })
}

function querySingle() {
    var p_conditions = {
        id: summer.pageParam.mainId||summer.pageParam.orderId
    };
    var page_params = {"pageIndex": 1, "pageSize": 100};  //分页
    var sortItem = {};
    var enc_conditions = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
    p_async_post(ip + '/ieop_base_mobile/mfrontsumallorder/queryaggsingle', enc_conditions, 'queryaggsingle');

}

function queryaggsingle(res) {
    if(res.status!=1){
        summer.toast({
            "msg" : res.msg
        })
        return ;
    }
    if( res.retData.aggEnt == null ||  res.retData.aggEnt.length == 0){
        summer.toast({
            "msg" : "暂无数据"
        });
        viewModel.nullDataTips(true);
        return ;
    }
    var childOrder = res.retData.aggEnt.children.su_mall_order_infos;
    if (summer.pageParam.type == 'send_back') {
        childOrder = res.retData.aggEnt.children.mall_transfer_order_ret;
    }

    childOrder.forEach(function (val) {
        val.materialImgUrl = val.materialImgUrl ? summer.getStorage("imgBaseUrl")+val.materialImgUrl:"";
    })
    var mainEnt = res.retData.aggEnt.mainEnt;
    if (mainEnt.returnUrgent == '0') {
        mainEnt.returnUrgent = '低';
    } else if (mainEnt.returnUrgent == '1') {
        mainEnt.returnUrgent = '中';
    } else if (mainEnt.returnUrgent == '2') {
        mainEnt.returnUrgent = '高';
    }
    var progressPic;
    if(mainEnt.allStatus == 0){
        progressPic = '../../img/order_xiadanchenggong.png';
    }
    if(mainEnt.allStatus == 1){
        progressPic = '../../img/order_yishenhe.png';
    }
    if(mainEnt.allStatus == 9){
        progressPic = '../../img/order_yifahuo.png';
    }
    if(mainEnt.allStatus == 10){
        progressPic = '../../img/order_yiyanshou.png';
    }
    if(mainEnt.allStatus == 11){
        progressPic = '../../img/order_yijiesuan.png';
    }

    // if (mainEnt.billStatus == 0 || mainEnt.billStatus == 5) {
    //     progressPic = '../../img/status/order-success.png';
    // } else if (mainEnt.billStatus == 1 || mainEnt.billStatus == 2 || mainEnt.billStatus == 3 || mainEnt.billStatus == 10) {
    //     progressPic = '../../img/status/audit.png';
    // } else if (mainEnt.billStatus == 4 || mainEnt.billStatus == 6) {
    //     progressPic = '../../img/status/has-send.png';
    // } else if (mainEnt.billStatus == 7) {
    //     progressPic = '../../img/status/receive.png';
    // }
    // if (mainEnt.retrunStatus == 2) {
    //     progressPic = '../../img/status/back.png';
    // }
    viewModel.progressPic(progressPic);
    viewModel.mainId(mainEnt.id);
    viewModel.mainOrder([mainEnt]);
    viewModel.billStatus(mainEnt.allStatus);
    viewModel.childOrders(childOrder);
    var clipboard = new ClipboardJS('.btn.btn-sm', {
        text: function () {
            return '订单编号：' + mainEnt.id + '\n' +
                '创建时间：' + mainEnt.createTime + '\n' +
                '紧急程度：' + mainEnt.returnUrgent + '\n' +
                '预计归还时间：' + mainEnt.returnExpectDate;
        }
    });

    clipboard.on('success', function (e) {
        summer.toast({
            msg: '复制成功'
        })
    });

    clipboard.on('error', function (e) {
        summer.toast({
            msg: '复制失败'
        })
    });
}

function querypage(res) {
    var senderList = res.retData.ents;
    for (var i = 0, len = senderList.length; i < len; i++) {
        senderList[i].choose = ko.observable(false);
    }
    viewModel.senderList(senderList);
    $('.drop').show();
    $('.box').show();
    $('.confirm').attr('options', JSON.stringify(viewModel.accessFoptions()[0]));
}

function updatestatus(data) {
    if (data.status == 1) {
        var options = viewModel.changeStatusOptions()[0];
        querySingle();
        summer.toast({
            "msg": options.msg
        })
        if (options.status == 2) {
            summer.openWin({
                "id": "order_list",
                "url": "html/order_list/order_list.html",
                "pageParam": {
                    "type": "prev_audit"
                },
                isKeep: false
            });
        }
    } else {
        summer.toast({
            "msg": data.msg
        })
    }
}

function accessStatus(data) {
    if (data.status == 1) {
        summer.toast({
            "msg": "审核通过"
        })
        summer.openWin({
            "id": "order_list",
            "url": "html/order_list/order_list.html",
            "pageParam": {
                "type": "prev_audit"
            },
            isKeep: false
        });
    }
    flag = true;
}

function retconfirm(data) {
    if (data.status == 1) {
        summer.toast({
            "msg": "已确认"
        })
        querySingle();
    } else {
        summer.toast({
            "msg": data.msg
        })
    }
}