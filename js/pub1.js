function p_json_enc(vals){
	if(typeof(vals)=='string'){
		return encode64(encodeURIComponent(vals,"utf8"));
	}
	return encode64(encodeURIComponent(JSON.stringify(vals),"utf8"));
}

function p_params_enc(args){
	return "params="+p_json_enc(get_p_params(args));
}

function p_params_data_enc(args){
	return "params="+p_json_enc(get_p_data_params(args));
}

function p_params_dataj_enc(args){
	var vparams = {params:p_json_enc(get_p_data_params(args))};
	return JSON.stringify(vparams);
}

function p_params_dataj_ent_enc(args){
	var vparams = {params:p_json_enc(get_p_data_ent_params(args))};
	return JSON.stringify(vparams);
}

function p_params_dataj_ents_enc(args){
	var vparams = {params:p_json_enc(get_p_data_ents_params(args))};
	return JSON.stringify(vparams);
}

function p_params_dataj_card_enc(ent_model){
	var vparams = {params:p_json_enc(get_p_data_params(p_get_card_info(ent_model)))};
	return JSON.stringify(vparams);
}

function p_params_dataj_card_ent_enc(ent_model){
	var vparams = {params:p_json_enc(get_p_data_ent_params(p_get_card_info(ent_model)))};
	return JSON.stringify(vparams);
}

function p_params_dataj_card_agg_ent_enc(ent_model,children){
	var aggEnt = {'mainEnt':p_get_card_info(ent_model)};
	aggEnt['children'] = children;
	var param = { 'dataMap': {'aggEnt':aggEnt} };
	var vparams = {params:p_json_enc(param)};
	return JSON.stringify(vparams);
}

function p_params_dataj_agg_ent_enc(main_ent,children){
	var aggEnt = {'mainEnt':main_ent};
	aggEnt['children'] = children;
	var param = { 'dataMap': {'aggEnt':aggEnt} };
	var vparams = {params:p_json_enc(param)};
	return JSON.stringify(vparams);
}

function p_params_con_dataj_enc(args){
	var vparams = {params:p_json_enc(get_p_condition_params(args))};
	return JSON.stringify(vparams);
}

function p_page_params_con_dataj_enc(args,page_params,sortItem){
	var vparams = {params:p_json_enc(get_p_page_condition_params(args,page_params,sortItem))};
	return JSON.stringify(vparams);
}

function p_page_params_enc(args){
	return "params="+p_json_enc(get_p_page_params(args));
}

function p_get_dec_vals(args){
	if(!(args.params == null || typeof(args.params) == "undefined")){
		args.params = JSON.parse(decodeURIComponent(decode64(args.params).replace(/\+/g," ")));
	}
	return args;
}

function p_get_dec_jvals(args){
	if(!(args == null || typeof(args) == "undefined")){
		args = JSON.parse(decodeURIComponent(decode64(args).replace(/\+/g," ")));
	}
	return args;
}

function get_p_data_params(args){
	args = replace_html_json_code(args);
	var param = {
    "dataMap": args
	};
	return param;
}
function get_p_data_ent_params(args){
	args = replace_html_json_code(args);
	var param = {
    "dataMap": {"ent":args}
	};
	return param;
}
function get_p_data_agg_ent_params(aggEnt){
	var param = {
    "dataMap": {"aggEnt":aggEnt}
	};
	return param;
}
function get_p_data_ents_params(args){
	args = replace_html_array_json_code(args);
	var param = {
    "dataMap": {"ents":args}
	};
	return param;
}
function get_p_condition_params(args){
	args = replace_html_json_code(args);
	var param = {
    "conditionMap": args
	};
	return param;
}

function get_p_page_condition_params(args,page_params,sortItem){
	if(args == null || typeof(args) == "undefined"){
		args = {};
	}
	if(page_params == null || typeof(page_params) == "undefined"){
		page_params = {};
	}
	if(sortItem == null || typeof(sortItem) == "undefined"){
		sortItem = {};
	}
	args = replace_html_json_code(args);
	page_params = replace_html_json_code(page_params);
	sortItem = replace_html_json_code(sortItem);
	var param = {
    "conditionMap": args,
    "pageParams":{
    	"pageSize":page_params.pageSize,
    	"pageIndex":page_params.pageIndex
		},
	"sortItemMap":sortItem
	};
	return param;
}

function get_p_params(args){
	if(args.dataMap == null || typeof(args.dataMap) == "undefined"){
		args.dataMap = {};
	}
	if(args.conditionMap == null || typeof(args.conditionMap) == "undefined"){
		args.conditionMap = {};
	}
	args.dataMap = replace_html_json_code(args.dataMap);
	args.conditionMap = replace_html_json_code(args.conditionMap);
	var param = {
    "dataMap": args.dataMap,
    "conditionMap": args.conditionMap
	};
	return param;
}

function get_p_page_params(args){
	if(args.dataMap == null || typeof(args.dataMap) == "undefined"){
		args.dataMap = {};
	}
	if(args.conditionMap == null || typeof(args.conditionMap) == "undefined"){
		args.conditionMap = {};
	}
	if(args.pageParams == null || typeof(args.pageParams) == "undefined"){
		args.pageParams = {};
	}
	args.dataMap = replace_html_json_code(args.dataMap);
	args.conditionMap = replace_html_json_code(args.conditionMap);
	args.pageParams = replace_html_json_code(args.pageParams);
	var param = {
    "dataMap": args.dataMap,
    "pageParams": {
        "pageSize": 10,
        "pageIndex": 1,
        "rowCount": 0,
        "pageCount": 1,
        "maxPageSize": 100,
        "totalCount": 0,
        "resultList": null,
        "data": null,
        "totalPage": 0,
        "page": 1
    },
    "conditionMap": args.conditionMap
	};
	return param;
}