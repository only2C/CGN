function closeWin() {
	summer.closeWin();
};
summerready = function(){
	var historyArr = summer.getStorage("historyArr")?summer.getStorage("historyArr"):[];
	var $historyList = $('#historyList');
	var tmpArr=[];
	for(var i=0,len=historyArr.length;i<len;i++){
		tmpArr.push('<li class="um-border-bottom">'+historyArr[i]+'</li>');
	}
	$historyList.html(tmpArr.join(''));
	$('#clearBtn').on('click',function(){
		//请求删除历史记录
		summer.setStorage("historyArr",[]);
		$historyList.html('');
		$('#clearBtn').hide();
	})
	$(document).on('keyup',function(e){
		if(e.keyCode==13){
			var kwords = $('#kwds').val();
			if(kwords!=''&&historyArr.indexOf(kwords)==-1){
				historyArr.push(kwords);
				summer.setStorage("historyArr", historyArr);
				$('#clearBtn').show();
			}
			summer.openWin({
                "id" : "list",
                "url" : "html/list/list.html",
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
           "url" : "html/list/list.html",
           "pageParam" : {
                "options" : {
                	kwords:kwords
            	}
           }
        });
	})
}