summerready = function(){
	var map = new AMap.Map('container', {           //显示地图
    resizeEnable: true,                           //是否支持缩放
    zoom:10,                                      //缩放比例
    center: [116.29062,39.8233]                //地图中心
   });
   var markerIcon = '';
   new AMap.Marker({
        map: map,
        icon: markerIcon,
        position: [116.29062, 39.8233],
        offset: new AMap.Pixel(-12, -36)                              //偏移位置
    });
    $('.tab-item').on('click',function(){
    	var $this = $(this),
    		index = $this.index();
    	$this.addClass('on').siblings().removeClass('on');
    	$('.content').hide();
    	$('#content'+index).show();
    })
}