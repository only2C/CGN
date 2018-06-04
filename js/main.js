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
	function openTab (type){   
	    var footer = $summer.byId('footer');
	    var footerPos = $summer.offset(footer); 
	    var width = $summer.winWidth();//==320
	    //var y = type=='home'?88:48;  
		//y = type == 'my'?0:y;
		//var y = 88;
	    var height = $summer.winHeight()-footerPos.h-y;//gct:计算frame的高  
	    // var types = ['my','attention','categroy','warehouse','home'];
	    var types = ['my','attention','categroy','home'];
	    var len = types.length;
	    if(type=='init'){
	    	for(var i =0;i<len;i++){
		    	var y = types[i]=='home'?88:48;  
				y = types[i] == 'my'?0:y;
		    	summer.openFrame({
	                "id" : types[i],
	                "url" : "html/"+types[i]+"/"+types[i]+".html",
	                "position" : {
	                    "left" : 0,
	                    "right" : 0,
	                    "top" : y,
	                    "bottom" : 45
	                }
	            });
	        } 
	        setTimeout(function(){
	        	for(var i =0;i<len;i++){
			    	summer.setFrameAttr({
							id:types[i],
							hidden:true
					})
			    }
			    summer.setFrameAttr({
					id:'home',
					hidden:false
				})
	        },2000)
	    }else{
	    	for(var i =0;i<len;i++){
		    	summer.setFrameAttr({
						id:types[i],
						hidden:true
				})
		    }
		    /*if(type=='my'){
		    	summer.setFrameAttr({
					id:type,
					hidden:false,
					rect:{
						x:0, //左上角x坐标
					    y:-88, //左上角y坐标
					    w:'auto', //宽度，若传'auto'，页面从x位置开始自动充满父页面宽度
					    h: $summer.winHeight()-footerPos.h//高度，若传'auto'，页面从y位置开始自动充满父页面高度
					}
				}) 
		    }*/
		    summer.setFrameAttr({
					id:type,
					hidden:false,
			})
		    
	    }
	}
	summerready = function(){
		openTab('init');
		/*var top = 48;
		var bottom = 45;
		summer.openFrameGroup({
	        id: 'group1',
	        background: '#ffffff',
	        scrollEnabled: false,
	        position: {
	            top: top,
	            bottom: bottom,
	            left: 0,
	            right: 0,
	        },
	        index: 0,
	        frames: [{
	            id: 'home',
	            url: 'html/home/home.html',
	            bgColor: '#ffffff',
	            hidden: false
	        }, {
	            id: 'attention',
	            url: 'html/attention/attention.html',
	            bgColor: '#ffffff',
	            hidden: true
	        }, {
	            id: 'categroy',
	            url: 'html/categroy/categroy.html',
	            bgColor: '#ffffff',
	            hidden: true
	        }, {
	        	id :'warehouse',
	        	url: 'html/warehouse/warehouse.html',
	            bgColor: '#ffffff',
	            hidden: true
	        },
	        {
	            id: 'my',
	            url: 'html/my/my.html',
	            bgColor: '#ffffff',
	            hidden: true
	        }],
	        callback:function(ret,err){
	        	var index = ret.index;
	        	alert(index);
	        }
	    }, function(ret, err) {
	        var index = ret.index;
	        alert(index);
	    });
	    */
	   	var jsfun = 'funcGoto();';
    	var $drop = $('.drop');
        $(".um-input-clear").click(function() {
                $(this).prev("input").val("");
        }) 
        $('#searchBtn').on('click',function(){
        	summer.openWin({
        		id:'search',
        		url:'html/search/search.html'
        	})
        })
        $('#changeOrgBtn').on('click',function(){
              var $this = $(this);
              $this.siblings('.org-list').slideToggle();
              summer.execScript({
			    winId: 'main',
			    frameId: 'home',
			    script: jsfun
			});
              $drop.fadeToggle();
        })
        $drop.on('click',function(){
      		$('#changeOrgBtn').click();
        })	
	}﻿ 