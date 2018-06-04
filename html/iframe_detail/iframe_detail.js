
function closeWin (){
    summer.closeWin()
}


summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {
		title:ko.observable( summer.pageParam.title)
    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
}	