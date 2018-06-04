// var ip =   "http://192.168.10.156:8170" ;   //GYQ
var ip = "http://123.207.175.212:8170";  //TX
var pub_key ="";
summerready = function(){
    //if(summer.getStorage("userInfo")!=''){
    //summer.openWin({
    // "id" : "home",
    //"url" : "html/home/home.html"
    //});
    //}
    var imgBaseUrl = "http://www.lalala123.cn";
    //var imgBaseUrl = "http://parts.cgnne.com"; //线上
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
        var flag = true;
        $('#loginBtn').on('click',function(){
            var info = {};
            var username = $('#username').val();
            var pwd = $('#password').val();
            summer.setStorage('username',username);
            summer.setStorage('pwd',pwd);

            get_enc_key(username);
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(pub_key);

            info['usercode']=username;
           // info['pwd']=p_json_enc(pwd);
            info['pwd']=encrypt.encrypt(pwd)
            info['language_type']='0';
            var bb = p_params_con_dataj_enc(info);
            if(flag){
                p_async_post(ip+'/ieop_base_mobile/mfrontmalluserlogin/login', bb,'logon_after_process');
            }

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

        if(ent.ieopUserIsInner=="1"){
            summer.openWin({
                id : 'home',
                url : 'html/home/home.html',
                isKeep: false,
                "addBackListener":"true"
            });
        }else if(ent.ieopUserIsInner=="0"&&ent.ieopUserIsSu=="1"){
            summer.openWin({
                id : 'home',
                url : 'html/my/my.html',
                isKeep: false,
                "addBackListener":"true",
				"pageParam":{
                	isSupplier:true
				}
            });
        }else{
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
function  get_enc_key_callback (data ){
	pub_key = data.retData["pub_key"] ;

}
