var p_c_context_info = {};
var curr_msg;
$(document).ready(function(){
    page_init_context();
});
// 设置上下文信息
function set_context_info(key, value) {
    p_c_context_info[key] = value;
}
// 取得上下文信息
function get_context_info(key) {
    return p_c_context_info[key];
}

// judge the element is null
function p_is_ele_blank(key){
    return $("#"+key).val().length == 0;
}
// judge the element is null
function p_is_blank(val){
    return val == undefined || val.length == 0;
}
// judge the element is null
function p_is_ele_null(key){
    var ele = $("#"+key).val();
    return null == ele || ele == undefined;
}
// judge the class element is null
function p_is_ele_class_null(key){
    var ele = $("."+key);
    return null == ele || ele == undefined || ele.length <= 0;
}
// judge the element is not null
function p_is_ele_not_null(key){
    var ele = $("#"+key).val();
    return !(null == ele || ele == undefined);
}
// judge the element is null
function p_is_null(val){
    return null == val || val == undefined;
}
// judge the element is not null
function p_is_not_null(val){
    return !(null == val || val == undefined);
}
function p_g_c_msg(){
    return curr_msg;
}
// set page entity data infomation
function p_set_card_info(ent_model,data_info){
    set_context_info("c_data_info",data_info);
    var meta = ent_model._config.meta;
    for(var key in meta){
        if(p_is_ele_not_null(key)){
            $("#"+key).val(data_info[key]);
        }
    }
}
// set page ele readonly
function p_set_card_readonly(ent_model){
    var meta = ent_model._config.meta;
    for(var key in meta){
        $("#"+key).attr("readonly","readonly");
    }
}

// remove page ele readonly
function p_remove_card_readonly(ent_model){
    var meta = ent_model._config.meta;
    for(var key in meta){
        $("#"+key).removeAttr("readonly");
    }
}

// submit the post data and infomation
function p_post(url,data,page_function_name,operate_msg){
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
        ,success: function (ret_data) {
            var fun_eval = eval(page_function_name);
            if( null === operate_msg || operate_msg === undefined ) {
                new fun_eval(ret_data); 
            }else{
                new fun_eval(ret_data,operate_msg); 
            }
            // ret_data.retData = p_get_dec_jvals(ret_data.retData);
            // return ret_data;
        },
        error:function(XmlHttpRequest,textStatus, errorThrown) {
            var errStatus = XmlHttpRequest.status;
            if(errStatus == 200){
                return ;
            } else if(errStatus==500){
                alert("服务器异常，请与管理员联系！");
            } else if(errStatus>=400 && errStatus<=505){
                alert("服务器异常，请与管理员联系！");
            }
        }
    });
    // if(ret.status == 200){
    //  ret.retData = p_get_dec_jvals(ret.retData);
    // }else {
    // alert("服务器异常，请与管理员联系！");
    // }
    // return ret;
}

// submit the post data and infomation
function p_async_post(url,data,return_fun){
	if($summer.os=='ios'){
		data = JSON.parse(data);
			summer.post(url,
			data,
			{"Content-Type" : "application/json"},//application-x-www-form-urlencoded application/json
		                    
		    function(response){//成功回调
		         ret_response_infos(response.data,return_fun);
		    },
		    function(response){ //失败回调
		         $summer.alert(response.data.msg);
	        });
		
	}else{
		 var ret = $.ajax({
	        type: 'POST',
	        url: url,
	        data: data,
	        async : false,
	        dataType: 'json',
	        contentType: 'application/json;charset=utf-8'
	    });
	    if(ret.status == 200){
	    	ret_response_infos(ret.responseJSON,return_fun);
	    }else {
	    	$summer.alert(ret);
	        alert("服务器异常，请与管理员联系！");
	        return ;
	    }
	}
}
function ret_response_infos(responseJSON,return_fun){
	var msg;
	if($summer.os=='ios'){
		responseJSON = JSON.parse(responseJSON);
	}
	if(responseJSON.msg===undefined){
    	eval((return_fun+'(responseJSON)'));
    	return;
	}
    msg = responseJSON.msg;
    if(msg=='#errStart#参数异常，无法进行正常操作！#errEnd#'){
        responseJSON.msg='参数异常，无法进行正常操作！';
    }else if(msg == '#errStart#您没有登录或登录超时，请登录后重新操作！#errEnd#'){
        // msg = msg.replace('#errStart#','');
        // msg = msg.replace('#errEnd#','');
        // ret.responseJSON.msg=msg;
        // alert('您没有登录或登录超时，请登录后重新操作！');
		summer.toast(
			{"msg":"重新登录"}
		)
		var aa = summer.closeWin('home');
        summer.openWin({
        	"id" :'login',
    		"url" : "html/login.html",
    		"isKeep":false
        })
        
        //$(".unset").click()
        return '';
    }
    msg = msg.replace('#errStart#','');
    msg = msg.replace('#errEnd#','');
    responseJSON.msg=msg;
    responseJSON.retData = p_get_dec_jvals(responseJSON.retData);
    eval((return_fun+'(responseJSON)'));
}

// submit the post data and infomation
function p_async_simple_post(url,data,return_fun){
    var ret = $.ajax({
        type: 'POST',
        url: url,
        data: data,
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
    });
    if(ret.status == 200){
        return ret; 
    }else {
        alert("服务器异常，请与管理员联系！");
        return ;
    }
    return ret.responseJSON;
}
// set conditions infomation
function p_set_conditions(c_condition_info){
    set_context_info("c_condition_info",c_condition_info);
    // p_c_context_info["c_condition_info"] = c_condition_info;
}
// get conditions infomation
function p_get_conditions(){
    return get_context_info("c_condition_info");
}
// set other conditions infomation
function p_set_other_conditions(other_conditions_key,c_condition_info){
    set_context_info("c_condition_info,"+other_conditions_key,c_condition_info);
}
// get other conditions infomation
function p_get_other_conditions(other_conditions_key){
    return get_context_info("c_condition_info,"+other_conditions_key);
}
//取得多语属性
function get_lang_type(){
    //return 0;
    return get_context_info('lang_type');
}


function get_tip_msg(){
var tip_msg = 
    [{tip_info:'提示:<br>　　'
    ,cannot_null:'不能为空'
    ,outof_max_lenth:'超出最大长度'
    ,dialog_tip_info:'提示信息'
    ,confirm_del:'是否确认删除选择数据？'
    ,no_row_del:'没有选择记录，请选择记录后操作!'
    ,sel_row_opt:'请选择记录后操作!'
    ,operate_success:'操作成功!'
    ,operate_fail:'操作失败!'
    ,save_success:'保存成功!'
    ,save_failed:'保存失败!'
    ,confirm_return:'是否确认不保存,并返回列表？'
    ,confirm:'确认'
    ,cancel:'取消'
    ,delete_fail:'删除失败'
    ,delete_sucess:'删除成功'
    ,row_delete_fail:'操作行删除失败.'
    ,row_delete_sucess:'操作行删除成功.'
    ,tail_tip_info:'提示信息：'
    ,inconsistent:'不一致'
    ,logout:'退出'
    ,confirm_logout:'是否确认退出？'
    }
    ,{tip_info:'Notification:<br>&nbsp;&nbsp;&nbsp;&nbsp;'
    ,cannot_null:"Can't be null"
    ,outof_max_lenth:'Out of max length'
    ,dialog_tip_info:'Notification:'
    ,confirm_del:'Confirm delete selected row?'
    ,no_row_del:'No rows have been selected.Please select and then operate!'
    ,sel_row_opt:'Please be operate before select row!'
    ,operate_success:'Operate successed!'
    ,operate_fail:'Operate failed!'
    ,save_success:'Save successed!'
    ,save_failed:'Save failed!'
    ,confirm_return:'Do you want to return to the list page?'
    ,confirm:'Confirm'
    ,cancel:'Cancel'
    ,delete_fail:'Delete failed'
    ,delete_sucess:'Delete successed'
    ,row_delete_fail:'Delete failed of Operate row.'
    ,row_delete_sucess:'Delete successed of Operate row.'
    ,tail_tip_info:'&nbsp;Notification：'
    ,inconsistent:'Inconsistent'
    ,logout:'Logout'
    ,confirm_logout:'Do you want to logout？'
    }];
    return tip_msg;
}

// 取得多语信息
function get_curr_msg() {
    var lang_type = get_lang_type();
    var c_msg = get_tip_msg()[0];
    if (lang_type) {
        if (lang_type == '1') {
            c_msg = get_tip_msg()[1];
        } else if (lang_type == '2') {
            c_msg = get_tip_msg()[1];
        } else if (lang_type == '3') {
            c_msg = get_tip_msg()[1];
        }
    }else{
        c_msg = get_tip_msg()[0];
    }
    return c_msg;
}
// 输出错误信息
function page_show_err_msg_border(msg){
    if(!p_is_blank(msg)){
        alert(msg);
    }
}

// 取得字符长度
function get_str_len(str) {
    if(str instanceof Array){
        return str.length;
    }
    if (!str || str.length == 0) {
        return 0;
    }
    if(get_is_ie_eight()){
        return str.length;
    }
    return  str.replace(/[^\x00-\xff]/g,"_").length;
}
//是否为IE8
function get_is_ie_eight(){
    var isIE = !!window.ActiveXObject; 
    return  isIE && !!document.documentMode;
}

// 设置验证不成立input状态
function page_input_err_show(input_text_id, show_title_msg) {
    $("#" + input_text_id).addClass("border_color_style");
            //.removeClass("ui-widget-content");
    $("#" + input_text_id).attr("title", show_title_msg);
}
// 输入框去掉红色恢复到以前的状态
function page_input_show(input_text_id) {
    $("#" + input_text_id).removeClass("border_color_style");
    //.addClass("ui-widget-content")        
    $("#" + input_text_id).attr("title", "");
}

function page_init_context(){
    set_context_info('lang_type', '0');
    curr_msg = get_curr_msg();
    page_set_def_form_datetime();
}

function page_set_def_form_datetime(){
    if(!p_is_ele_class_null("form_datetime")){
        $('.form_datetime').datetimepicker({
            language:  'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: false
        });
    }
    if(!p_is_ele_class_null("form_date")){
        $('.form_date').datetimepicker({
            language:  'zh-CN',
            format: 'yyyy-mm-dd',
            minView: "month",
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: false
        });
    }
}


// validate page elements infomation
function page_vali_info(ent_model) {
    var vali_info = ent_model._config.valiInfo;;
    var fields_info = ent_model._config.fieldsName[get_lang_type()]; 
    var c_msg = '';
    var vali_flag = true;
    var f_num = 0;
    var b_key;
    for (var key in vali_info) {
        if(!vali_flag && f_num ==0){
            $("#"+b_key).focus(); 
            f_num++;
        }
        b_key = key;
        // 如果输入框的id未定义，不验证，继续向下走
        if (p_is_ele_null(key)) {
            continue;
        }
        var field = fields_info[key];
        // 非空校验
        if (vali_info[key].must_i && p_is_ele_blank(key)) {
            c_msg = c_msg + '[' + field + ']'
                    + p_g_c_msg()['cannot_null'] + ';';
            page_input_err_show(key, p_g_c_msg()['cannot_null']);
            vali_flag = false;
            continue;
        }else{
            page_input_show(key);
        }
        // 长度校验
        if (!page_vali_input_length(key, vali_info[key].max_len)) {
            c_msg = c_msg + '[' +field + ']'
                    + p_g_c_msg()['outof_max_lenth'] + vali_info[key].max_len
                    + ';';
            vali_flag = false;
            continue;
        }
    }
    if (!vali_flag) {
        c_msg = p_g_c_msg()['tip_info'] + c_msg;
        page_show_err_msg_border(c_msg);
    } else {
        page_show_err_msg_border('');
    }
    return vali_flag;
}

//replace html code infomations
function replace_html_code(val){
    if(null == val ){
        return val;
    }else if(typeof val=='string'){
        var regx = /<[^>]*>|<\/[^>]*>/gm;
        return val.replace(regx,"");
    }
    return val;
}

//replace html json code infomations
function replace_html_json_code(vals){
    if(null == vals){
        return vals;
    }
    for(var key in vals){
        vals[key] = replace_html_code(vals[key]);
    }
    return vals;
}

//replace html array json code infomations
function replace_html_array_json_code(argArray){
    if(p_is_null(argArray)){
        return argArray;
    }
    for(var i=0,l=argArray.length;i<l;i++){
    　　for(var key in argArray[i]){
            argArray[i][key] = replace_html_code(argArray[i][key]);
    　　}
    }
    return argArray;
}
// page file upload imgs 
function page_file_upload_imgs(option,ele_id){
    var input = document.getElementById(ele_id);
    // var txshow = document.getElementById("txshow");
    if (typeof (FileReader) === 'undefined') {
        summer.toast({
        	"msg":"抱歉，你的浏览器不支持 FileReader，请使用IE9 10 11 或Google Chrome浏览器操作！"
        })
        input.value = '';
        input.setAttribute('disabled', 'disabled');
        return ;
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function(e){
            var fileData = e.target.result;

            var fileSize = fileData.length / 1024 / 1024 ;
            if(fileSize>1){
            	summer.toast({
            		"msg":"上传文件过大，文件大小不能超过1MB！"
            	});
                input.value = '';
                return ;
            }
            var file = $("#"+ele_id).val();
            var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
            var fileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
            fileExt = fileExt.toLowerCase();
            if(!(fileExt=="png"||fileExt=="jpg"||fileExt=="jpeg")){
            	summer.toast({
            		"msg":"您上传的文件类型不正确，只能上传 .png、.jpg、.jpeg 类型文件！"
            	});
                input.value = '';
                return ;
            }
            fileData = fileData.replace(/^data:;base64,/, "");
            fileData = fileData.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            var p_conditions = {};
            p_conditions['filename'] = strFileName;
            p_conditions['fileext'] = fileExt;
            var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
            var file_info = "filedata="+encode64(fileData)+"&params="+enc_conditions;
            //上传
            $.ajax({
                url: option.upload_url,//需要链接到服务器地址   
                type:"POST",
                data : file_info,
                success: function (data) {
                    if(typeof data=='string'){
                        data = JSON.parse(data);
                    }
                    option.uploadCallBack(data);
                },error:function(XMLHttpRequest, textStatus, errorThrown){  
                	summer.toast({
	            		"msg":"上传失败，请与管理员联系！"
	            	});
                }  
            });
        };
    }
}
// validate elements of the max size
function page_vali_input_length(input_text_id, max_len) {
    if (p_is_ele_null(input_text_id)) {
        return true;
    }
    if (get_str_len($("#" + input_text_id).val()) > max_len) {
        page_input_err_show(input_text_id, p_g_c_msg()['outof_max_lenth']
                        + max_len);
        return false;
    }
    page_input_show(input_text_id);
    return true;
}

// set must input columns tips
function set_muti_input_info(ent_model) {
    var fields_info = ent_model._config.fieldsName[get_lang_type()]; 
    for (var key in fields_info) {
        if ($('#' + key + '_s_f')) {
            $('#' + key + '_s_f').text(fields_info[key] + ':');
        }
    }
    set_must_inputs(ent_model._config.valiInfo);
    set_edit_input_readonly_colums(fields_info,ent_model._config.valiInfo);
}

function set_edit_input_readonly_colums(fields_info,vali_info){
    var data_info = get_context_info("c_data_info");
    if(p_is_blank(data_info) || p_is_blank(data_info['id'])){
        for (var key in vali_info) {
            if ($('#' + key) && !vali_info[key]['add_i']) {
                $("#"+key).attr("readonly","readonly");
            }else if($('#' + key)){
                $("#"+key).removeAttr("readonly");
            }
        }
        return ;
    }else {
        for (var key in vali_info) {
            if ($('#' + key) && !vali_info[key]['edit_i']) {
                $("#"+key).attr("readonly","readonly");
            }else if($('#' + key)){
                $("#"+key).removeAttr("readonly");
            }
        }
    }
}


// set must input columns
function set_must_inputs(vali_info) {
    var vali_flag = true;
    for (var key in vali_info) {
        if (p_is_ele_null(key)) {  continue; }
        page_input_show(key);
        // 非空校验
        if (vali_info[key].must_i) {
            set_must_input(key);
        }
    }
}
// set must input star char
function set_must_input(id){
    if($('#'+id+'_s_f').children("span").length==0){
        $("#"+id+'_s_f').prepend('<span class="color_span_red">*</span>');
    }
}

// 显示尾部提示信息
function page_msg_show_in_bottom(show_detail_msg,boder_color) {
    var bottom_msg_show_id = "page_floating_layer_id";
    if(p_is_ele_null(bottom_msg_show_id)){
         $('body').append('<div id="page_floating_layer_id" class="page_floating_layer" ondblclick="page_float_div_hide(\''+bottom_msg_show_id+'\')"> <span id="page_floating_layer_id_i" class="page_msg_info_s"></span> <span class="page_x_css" >x</span> </div>');
    }
    var containthtm = document.getElementById(bottom_msg_show_id+"_i");
    containthtm.innerHTML = curr_msg['tail_tip_info'] + show_detail_msg;
    var msg_div = $('#' + bottom_msg_show_id);
    // var div_width = document.body.offsetWidth;
    // msg_div.width(div_width);
    msg_div.slideDown(500);
    // 设置文字的数量
    var nowLeng = containthtm.innerHTML.length;
    if (nowLeng > 170) {
        containthtm.innerHTML = containthtm.innerHTML.substr(0, 170) + '....';
    };
    document.getElementById(bottom_msg_show_id).onclick=function(){
        page_remove_ele_div(bottom_msg_show_id);
    };
    // $('.floating_layer').slideUp(1000);
    setTimeout(function() {
               page_remove_ele_div(bottom_msg_show_id);
            }, 3000);
}

function page_remove_ele_div(page_float_div_id) {
    $("#"+page_float_div_id).remove();
}

// get referance value by key
function page_get_ref_vals_by_keys(key_array){
    var old_ref_infos_by_key = get_context_info("page_ref_infos_by_key");
    if(p_is_not_null(old_ref_infos_by_key) && old_ref_infos_by_key.length>0){
        return old_ref_infos_by_key;
    }
    old_ref_infos_by_key={};
    var old_ref_infos = page_get_ref_infos(key_array);
    for(var k in old_ref_infos){
        var temp = {};
        var len  = old_ref_infos[k].length;
        for(var i=0;i<len;i++){
            temp[old_ref_infos[k][i]['id']] = old_ref_infos[k][i]['name'];
            
        }
        old_ref_infos_by_key[k] = temp;
    }
    set_context_info("page_ref_infos_by_key",old_ref_infos_by_key);
    return old_ref_infos_by_key;
}

// get reference datas by key array
function page_get_ref_infos(ref_key_array){
    var old_ref_infos = get_context_info("page_ref_infos");
    if(p_is_not_null(old_ref_infos) && old_ref_infos.length>0){
        return old_ref_infos;
    }
    var refMap = page_get_ref_datas(ref_key_array);
    var len = 0;
    var o = {};
    var ref_infos = {};
    for(var key in refMap){ 
        o = refMap[key];
        len = o.length; 
        var category = [];
        for(var i=0;i<len;i++){
            var tmp = {};
            tmp['id'] = o[i]['ieopRCCode'];
            tmp['name'] = o[i]['ieopRCName'];
            category[i] = tmp;
        }
        ref_infos[key] = category;
    }  
    set_context_info("page_ref_infos",ref_infos);
    return ref_infos;
}
// get reference datas infomation
function page_get_ref_datas(ref_array){
    var c_condition_info = {};
    c_condition_info['ref_list'] = ref_array;
    var page_params={};
    page_params["pageIndex"]=1;
    page_params["pageSize"]=100000;
    var data = p_page_params_con_dataj_enc(c_condition_info,page_params);
    var ret = p_async_post('/ieop_base/ieoprefcode/queryref', data);
    return ret.retData;
}
// get reference data infomation by selected_key
function page_get_ref_inner_name(ref_group_key,selected_key){
    var old_ref_infos = page_get_ref_infos(ref_group_key);
    var old_ref_info = old_ref_infos[ref_group_key];
    var len = old_ref_info.length;
    for(var i=0;i<len;i++){
        if(old_ref_info[i]['id'] == selected_key){
            return old_ref_info[i]['name'];
        }
    }
    return '';
}
// get conditions context infomation 
function set_cons_context_info(key,val){
    set_context_info("cons_"+key,val);
}
// set conditions context infomation 
function get_cons_context_info(key){
    var cons = get_context_info("cons_"+key);
    if(cons== undefined || cons == null){
        cons= {};
    }
    return cons;
}
// set conditions context infomation key array
function get_cons_context_info_keys_array(key){
    var cons = get_cons_context_info(key);
    var keys = "";
    for (x in cons) {
        keys = keys + x + ",";
    }
    return keys.substring(0,keys.length-1);
}
// set conditions context infomation value array
function get_cons_context_info_val_array(key){
    var cons = get_cons_context_info(key);
    var vals = "";
    for (x in cons) {
        vals = vals + cons[x]['name'] + ",";
    }
    return vals.substring(0,vals.length-1);
}
// get JSON attribute length
function get_JSON_length(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
function cloneObj(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), 
        newobj = JSON.parse(str);
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};
