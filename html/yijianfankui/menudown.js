summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));	
	summer.toast({
         "msg" : "功能暂未开放" 
    })
	$(function(){
	    var v_width= $(document.body).width();
	    $(".select_textul").width(v_width);
	    $(".select_textdiv").click(function(){
	    	$(this).siblings(".select_textul").fadeToggle(500);
	    	//dianji();
	    })
	    
	    
	    
	    
	    $("#select_textdiv1").click(function(){
	    	if($("#menudown2").is(":hidden")){
	   			$("#menudown2").show();
	
	   			$(".mt10 mb10 um-time").show();
	   			$(".um-box-center").show();
	   			$(".btn").show();
	   		}else{
	   			$("#menudown2").hide();
	
	   			$(".mt10 mb10 um-time").hide();
	   			$(".um-box-center").hide();
	   			$(".btn").hide();
	   			$("#spzt").show();
	   		}
	    });	
	    
	    
	   	$("#select_textdiv1").click(function(){
	   		$("#xiala2").hide();
	   	})
	   	
	   	
	   	$("#select_textdiv2").click(function(){
	   		$("#xiala1").hide();
	   	})
	})
			
	function dianji(){
				var i =0;
				
				//alert("执行了"+i);
				i++;
				$(".select_first_ul>li>p").click(function(){
				$(this).parent("li").addClass("focus").siblings("li").removeClass("focus");
	        	var choose = $(this).text();
	        	var choose1 = $(this).find(".input1").val();
	        	//alert(choose+choose1);
				$(this).parents(".select_textul").siblings(".select_textdiv").find(".s_text").text(choose);
				$(this).parents(".select_textul").siblings(".select_textdiv").find(".input").val(choose1);
				
				//$(this).parents(".select_textul").siblings("input").val(choose);
				$(this).parents(".select_textul").fadeOut(300);
				$("#menudown2").show();
	
	   			$(".mt10 mb10 um-time").show();
	   			$(".um-box-center").show();
	   			$(".btn").show();
			    event.stopPropagation();
			});
	}
	
	
	function back(){
		summer.closeWin({});
	}
}



