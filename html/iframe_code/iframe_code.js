function closeWin (){
    summer.closeWin()
}

function openDetailWin(){
	 summer.openWin({
                "id" : "iframeDetail",
                "url" : "html/iframe_detail/iframe_detail.html",
                "pageParam":{
                		  "title":"框架协议"
                }
              
            });
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {};
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
}	