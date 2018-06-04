function closeWin() {
	summer.closeWin();
};
summerready = function(){
	var stype = summer.getStorage('stype');
	var historyArr;
	var linkUrl;
	if(stype==1){
		 historyArr= summer.getStorage("historyArr")?summer.getStorage("historyArr"):[];
		 linkUrl = 'html/list/list.html'
	}else{
		historyArr = summer.getStorage("cgHistoryArr")?summer.getStorage("cgHistoryArr"):[];
		linkUrl = 'html/list_cg/list_cg.html'
	}
	var $historyList = $('#historyList');
	var tmpArr=[];
	for(var i=0,len=historyArr.length;i<len;i++){
		tmpArr.push('<li class="um-border-bottom">'+historyArr[i]+'</li>');
	}
	$historyList.html(tmpArr.join(''));
	$('#clearBtn').on('click',function(){
		//请求删除历史记录
		if(stype==1){
			summer.setStorage("historyArr",[]);
		}else {
			summer.setStorage("cgHistoryArr",[]);
		}
		$historyList.html('');
		$('#clearBtn').hide();
	})
	$(document).on('keyup',function(e){
		if(e.keyCode==13){
			var kwords = $('#kwds').val();
			if(kwords!=''&&historyArr.indexOf(kwords)==-1){
				historyArr.push(kwords);
				if(stype==1){
					summer.setStorage("historyArr", historyArr);
				}else {
					summer.setStorage("cgHistoryArr", historyArr);
				}
				
				$('#clearBtn').show();
			}
			summer.openWin({
                "id" : "list",
                "url" : linkUrl,
                "pageParam" : {
                    "options" : {
                    	kwords:kwords
                    },
					flag:summer.pageParam.flag
                }
            });
		}
	})
	$historyList.on('click','li',function(){
		var $this = $(this);
		var kwords = $this.html();
		summer.openWin({
           "id" : "list",
           "url" : linkUrl,
           "pageParam" : {
                "options" : {
                	kwords:kwords
            	}
           }
        });
	})
}
