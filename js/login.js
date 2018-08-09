//var ip =   "http://192.168.10.156:8170" ;   //GYQ
//var ip = "http://192.168.10.60:8170"
var ip = "http://123.207.175.212:8170";  //TX
//var ip = "http://parts.cgnne.com:8091" //正式
var pub_key ="";
var flag = true;
summerready = function(){
    //if(summer.getStorage("userInfo")!=''){
    //summer.openWin({
    // "id" : "home",
    //"url" : "html/home/home.html"
    //});
    //}
    var imgBaseUrl;
    if(ip == "http://123.207.175.212:8170"){
    	imgBaseUrl = "http://www.lalala123.cn";
    }else{
    	imgBaseUrl = "http://parts.cgnne.com"; //线上
    }
    summer.setStorage("ip", ip);
    summer.setStorage("imgBaseUrl", imgBaseUrl);
    if($summer.os=='ios'){
        $('#passwordBox').css({'margin-top':'40px'});
    }
    $(function() {
        $('#username').val(summer.getStorage("username"));
        $('#password').val(summer.getStorage("pwd"));
        // 设置输入框文字清除的事件监听
        $(".um-input-clear").click(function() {
            $(this).prev("input").val("");
        })
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        $(window).on('resize', function () {
            var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (clientHeight > nowClientHeight) {
                $('#main').css({'top':'50%','transform':'translate(0,-70%)','bottom':'auto'});
            }
            else {
                $('#main').css({'top':'0','transform':'translate(0,0%)','bottom':'0'});
            }
        });
        
        $('#loginBtn').on('click',function(){
            var username = $('#username').val();
            var pwd = $('#password').val();
            summer.setStorage('username',username);
            summer.setStorage('pwd',pwd);

            get_enc_key(username);
        })
        $('#changePassType').on('click',function(){
            var $this = $(this);
            var type = $('#password').attr('type')=='text'?'password':'text';
            $('#password').attr('type',type);
            $this.toggleClass('show-pass')
        })
    })
};
function logon_after_process(data){
    if(data.status==1){
        //data.retData = p_get_dec_jvals(data.retData);
        var ent = data.retData.ent;
        ent['username'] = ent.ieopUserName;
        var userInfo = JSON.stringify(ent);
        summer.setStorage("userInfo", userInfo);
        summer.setStorage("ufn",data.ufn);
		summer.setStorage("ufcn",data.ufcn);
        if(ent.ieopUserIsInner=="0"&&ent.ieopUserIsSu=="1"){
            summer.setStorage("isSupplier","01");
            summer.openWin({
                id : 'home',
                url : 'html/my/my.html',
                isKeep: false,
                "addBackListener":"true",
            });
        }else{
           summer.setStorage("isSupplier","");
            summer.openWin({
                id : 'home',
                url : 'html/home/home.html',
                isKeep: false,
                "addBackListener":"true"
            });
        }
    }else{
        summer.toast({
            "msg" : data.msg
        })
    }
};
// get encode key
function get_enc_key(usercode){
    var info = {};
    info['usercode']=usercode;
    info['language_type']='0';
    var bb = p_params_con_dataj_enc(info);
    p_async_post(ip+'/ieop_base_mobile/mfrontmalluserlogin/getenc', bb ,'get_enc_key_callback');
}
function  get_enc_key_callback (data){
	pub_key = data.retData["pub_key"] ;
	var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pub_key);
	var info = {};
    var username = $('#username').val();
    var pwd = $('#password').val();
    info['usercode']=username;
   // info['pwd']=p_json_enc(pwd);
    info['pwd']=encrypt.encrypt(pwd)
    info['language_type']='0';
    var bb = p_params_con_dataj_enc(info);
    p_async_post(ip+'/ieop_base_mobile/mfrontmalluserlogin/login', bb,'logon_after_process');
}