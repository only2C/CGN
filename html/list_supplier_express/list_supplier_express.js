function closeWin (){
    summer.closeWin()
}
summerready = function(){
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var viewModel = {

    };
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
}
