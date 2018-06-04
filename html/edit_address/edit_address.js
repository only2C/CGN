function closeWin (){
	var pageLoad = 'pageLoad();';
	summer.execScript({
	    winId: 'address',
	    script: pageLoad
	});
	summer.closeWin();
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.ip = summer.getStorage("ip");
	var item = summer.pageParam.item;
	var evaluationStatus = item.evaluationStatus=='1'?true:false;
	var viewModel = {
		receiveName:ko.observable(item.receiveName),
		receivePhone:ko.observable(item.receivePhone),
		receiveArea:ko.observable(item.receiveArea),
		receiveAddr:ko.observable(item.receiveAddr),
		setDefault:ko.observable(evaluationStatus),
		saveEdit:function(){
			//编辑保存
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(viewModel.receivePhone()))){
				summer.toast({
                     "msg" : "请输入正确手机号" 
                })
			}
			var info = {};
            info['id']=item.id;
            info['receiveName']=viewModel.receiveName();
            info['receiveArea']=viewModel.receiveArea();
            info['receiveAddr']=viewModel.receiveAddr();
            info['receivePhone']=viewModel.receivePhone();
            var bb = p_params_dataj_ent_enc(info);
            p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/update', bb,'update');
            
           
		},
		deleteAddr:function(){
			//删除收货人
			var info = {};
            info['id']=item.id
            var bb = p_params_dataj_ent_enc(info);
            p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/delete', bb,'deleteAddr');
            
		}
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	var nameEl = document.getElementById('sel_city');
	var first = []; /* 省，直辖市 */
	var second = []; /* 市 */
	var third = []; /* 镇 */
	
	var selectedIndex = [0, 0, 0]; /* 默认选中的地区 */
	
	var checked = [0, 0, 0]; /* 已选选项 */
	
	function creatList(obj, list){
	  obj.forEach(function(item, index, arr){
	  var temp = new Object();
	  temp.text = item.name;
	  temp.value = index;
	  list.push(temp);
	  })
	}
	
	creatList(city, first);
	
	if (city[selectedIndex[0]].hasOwnProperty('sub')) {
	  creatList(city[selectedIndex[0]].sub, second);
	} else {
	  second = [{text: '', value: 0}];
	}
	
	if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
	  creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
	} else {
	  third = [{text: '', value: 0}];
	}
	
	var picker = new Picker({
	    data: [first, second, third],
	  selectedIndex: selectedIndex,
	    title: '地址选择'
	});
	
	picker.on('picker.select', function (selectedVal, selectedIndex) {
	  var text1 = first[selectedIndex[0]].text;
	  var text2 = second[selectedIndex[1]].text;
	  var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
	
	    viewModel.receiveArea(text1 + ' ' + text2 + ' ' + text3);
	});
	
	picker.on('picker.change', function (index, selectedIndex) {
	  if (index === 0){
	    firstChange();
	  } else if (index === 1) {
	    secondChange();
	  }
	
	  function firstChange() {
	    second = [];
	    third = [];
	    checked[0] = selectedIndex;
	    var firstCity = city[selectedIndex];
	    if (firstCity.hasOwnProperty('sub')) {
	      creatList(firstCity.sub, second);
	
	      var secondCity = city[selectedIndex].sub[0]
	      if (secondCity.hasOwnProperty('sub')) {
	        creatList(secondCity.sub, third);
	      } else {
	        third = [{text: '', value: 0}];
	        checked[2] = 0;
	      }
	    } else {
	      second = [{text: '', value: 0}];
	      third = [{text: '', value: 0}];
	      checked[1] = 0;
	      checked[2] = 0;
	    }
	
	    picker.refillColumn(1, second);
	    picker.refillColumn(2, third);
	    picker.scrollColumn(1, 0)
	    picker.scrollColumn(2, 0)
	  }
	
	  function secondChange() {
	    third = [];
	    checked[1] = selectedIndex;
	    var first_index = checked[0];
	    if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
	      var secondCity = city[first_index].sub[selectedIndex];
	      creatList(secondCity.sub, third);
	      picker.refillColumn(2, third);
	      picker.scrollColumn(2, 0)
	    } else {
	      third = [{text: '', value: 0}];
	      checked[2] = 0;
	      picker.refillColumn(2, third);
	      picker.scrollColumn(2, 0)
	    }
	  }
	
	});
	
	picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
	  console.log(selectedVal);
	  console.log(selectedIndex);
	});
	
	nameEl.addEventListener('click', function () {
	    picker.show();
	});
}
function deleteAddr(data){
	if(1==data.status){
       summer.toast({
           "msg" : "删除成功" 
       });
       var jsfun = 'pageLoad();';
		summer.execScript({
		    winId: 'address',
		    script: jsfun
		});
		closeWin ();
       }else{
            summer.toast({
                "msg" : data.msg 
            });
       }
}
function updateStatus(data){
	if(data.status==1){
		summer.toast({
		    "msg" : "修改成功" 
	});
	closeWin ();
	}else{
		summer.toast({
	        "msg" : data.msg
	    })
	}
}
function update(data){
	 if(1==data.status){
	 	var item = summer.pageParam.item;
        if(viewModel.setDefault()){
            		//设为默认地址
		    var p_conditions = {};
			p_conditions['id'] = item.id;
			var page_params={"pageIndex":1,"pageSize":20};  //分页
			var sortItem = {};
			var bb = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
			p_async_post(ip+'/ieop_base_mobile/mfrontmallreceivingaddress/updateStatus', bb,'updateStatus');
			        
        }else{
            summer.toast({
		        "msg" : "修改成功" 
		    });
		    var jsfun = 'pageLoad();';
			summer.execScript({
			    winId: 'address',
			    script: jsfun
			});
			closeWin ();
        }
    }else{
        summer.toast({
             "msg" : data.msg
        })
    }
}
