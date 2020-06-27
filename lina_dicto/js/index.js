'use strict';

const Preference = require('./js/preference');
var extension = new Extension();
const Platform = require('./js/platform');
// const Language = new Language();
const Language = require('./js/language');
const Esperanto = require('./js/esperanto');
const Juriamo = require('./js/juriamo');
const Dictionary = require('./js/dictionary');
let dictionary = new Dictionary();
const Linad = require('./js/linad');
let history = new History();

var timeline_item_id = 0;
let dictionary_handle = null;

window.addEventListener("load", function(){

	let dictionary_data = dictionary_loader();
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	if(!extension.init()){
		alart("extension not initialized.");
	}

	if(!Platform.init()){
		alart("Platform not initialized.");
	}

	window.addEventListener('resize', function(){
		resize_query_input(get_window_height());
	}, true);

	document.onkeydown = function(e) {
		if (e.ctrlKey && e.key === 'v') {
			// Ctrl+V(paste)を、Focusが無くてもInputに対して行う
			document.getElementById('query-area__query-input__input').focus();
		}
	}

	Linad.initialize(function(err){
		if(err){
			alert(err);
			document.getElementById('query-area__query-input__input').value = 'Internal error.';
			return;
		}

		// 入力欄のロックを解除し、フォーカスを与える
		document.getElementById('query-area__query-input__input').value = '';
		document.getElementById('query-area__query-input__input').disabled = '';
		document.getElementById('query-area__query-input__input').focus();

		{
			let input = document.getElementById("query-area__query-input__input");
			input.addEventListener("keypress", on_keypress_by_query_input_element, false);
			input.addEventListener("keyup", on_keyup_by_query_input_element, false);
		}

		{
			// browserifyで別ファイルから関数を指定できない問題を、
			// 解決するのが面倒だったため、ここへ処理を追加
			if('android' === Platform.get_platform_name()){
				// 検索ボタンを有効化
				let button = document.getElementById("query-area__query-input__button");
				button.addEventListener("click", query_input_element, false);
			}
		}
	});

	// ユーザ設定を読み込む
	try{
		if('android' === Platform.get_platform_name()){
			return;
		}

		Preference.init();
		const pref = Preference.get_preference();

		if(pref.is_visible_juriamo_assign){
			let newStyle = document.createElement('style');
			newStyle.appendChild(document.createTextNode(".juriamo_assign{display: block;}"));
			document.head.appendChild(newStyle);
		}
		if(0 != pref.webfont01.length){
			let webfontURL = pref.webfont01;
			let newStyle = document.createElement('style');
			newStyle.appendChild(document.createTextNode(
				"@font-face {"
				+ " font-family: 'webfont01';"
				+ " src: url('" + webfontURL + "');"
				+ " src: url('" + webfontURL + "') format('woff');"
				+ " src: url('" + webfontURL + "') format('truetype');"
				+ " }"
			));
			//newStyle.appendChild(document.createTextNode("body{font-family: 'webfont01';}"));
			newStyle.appendChild(document.createTextNode("#timeline{font-family: 'webfont01';}"));
			document.head.appendChild(newStyle);
		}

		// user CSS 設定の読み込み
		const fileex = require('./js/fileex');

		if(fileex.is_exist_file(Preference.get_filepath_user_css())){
			console.log("user CSS `" + Preference.get_filepath_user_css() + "`");
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = Preference.get_filepath_user_css();
			document.head.appendChild(link);
		}
	}catch(err){
		message_dialog('error', 'user preference error', "user preference load error:\n" + err.message);
	}

}, false)

var query_input_default = {
	'input_height':-1,
	'timeline_padding_bottom':-1,
};

// HTMLタグなどをエスケープする
function htmlspecialchars(code) { 
	code = code.replace(/&/g,"&amp;") ;
	code = code.replace(/"/g,"&quot;") ;
	code = code.replace(/'/g,"&#039;") ;
	code = code.replace(/</g,"&lt;") ;
	code = code.replace(/>/g,"&gt;") ;
	// 半角空白を処理する
	//code = code.replace(/ /g,"&#32;") ;
	code = code.replace(/\x20/g,"&ensp;") ;
	// タブを処理する
	var tab = '<pre style="margin-top:0pt;margin-bottom:0pt;'
		+ 'display: inline-block; _display: inline;" >&#x0009;</pre>' + "";
	code = code.replace(/\t/g, tab);
	return code ;
}

function conv_text_html_from_plain(text)
{

	// HTML改行(行末<br />)を加える
	text = htmlspecialchars(text);
	text = text.replace(/\n/g,"<br />\n");

	return text;
}

function resize_query_input(window_height)
{
	// console.log("resize:%d x %d", get_window_width(), get_window_height());

	let input_input_element = document.getElementById('query-area__query-input__input');
	let input_button_element = document.getElementById('query-area__query-input__button');
	let timeline_element = document.getElementById('timeline');
	if(-1 == query_input_default['input_height']){
		query_input_default['input_height'] = input_input_element.style.height;
		query_input_default['timeline_padding_bottom'] = timeline_element.style.paddingBottom;
	}

	if(250 > window_height){
		input_input_element.style.height = "30px";
		input_button_element.style.height = "30px";
		timeline_element.style.paddingBottom = "55px";
	}else{
		input_input_element.style.height = query_input_default['input_height']
			input_button_element.style.height = query_input_default['input_height']
			timeline_element.style.paddingBottom = query_input_default['timeline_padding_bottom'];
	}

	// 最下部へスクロール
	scrollTo(0, timeline_element.offsetHeight);
}

function get_window_width()
{
	let width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	return width;
}

function get_window_height()
{
	let height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

	return height;
}

function get_query_element(query_text, sub_text)
{
	// elementの生成
	let query_element = document.createElement('div');
	query_element.classList.add('timeline__item__query');
	let query_icon_element = document.createElement('div');
	query_icon_element.classList.add('timeline__item__query__icon');
	let query_string_element = document.createElement('span');
	query_string_element.classList.add('timeline__item__query__string');
	let query_sub_string_element = document.createElement('span');
	query_sub_string_element.classList.add('timeline__item__query__sub-string');
	query_element.appendChild(query_icon_element);
	query_element.appendChild(query_string_element);
	query_element.appendChild(query_sub_string_element);

	query_string_element.textContent = query_text;
	query_sub_string_element.textContent = sub_text;

	return query_element;
}

function get_responses_element(responses)
{
	let responses_element = document.createElement('div');
	responses_element.classList.add('timeline__item__responses');

	const is_display_keyword = (1 != responses.length);
	const len = responses.length;
	for(let i = 0; i < len; i++){
		let response_element = get_response_element(responses[i], is_display_keyword);
		responses_element.appendChild(response_element);
	}

	return responses_element;
}

function create_keyword_element(response)
{
	const keyword = response.matching_keyword;

	let show_str = '';
	if(! response.keyword_modify_src){
		show_str = '`' + keyword + '`';
	}else{
		show_str += '`' + response.keyword_modify_src + '`' +  ' -> `' + keyword + '`';
	}

	let response_keyword_element = document.createElement('div');
	response_keyword_element.classList.add('timeline__item__response__keyword');

	let response_keyword_element_span = document.createElement('span');
	response_keyword_element_span.textContent = show_str;

	response_keyword_element.appendChild(response_keyword_element_span);

	return response_keyword_element;
}

function create_string_main_element(response)
{
	let response_string_main_element = document.createElement('div');
	response_string_main_element.classList.add('timeline__item__response__string__main');

	let items = response.match_items;
	if(0 == items.length){
		items = response.radiko_items;
	}
	let main_text;
	if(Language.get_code() === response.lang){
		// esp
		if(0 < items.length){
			const glosses = Dictionary.get_glosses_from_item(dictionary_handle, items[0]);
			main_text = glosses.join(', ');;

			let explanation = Dictionary.get_explanation_from_item(dictionary_handle, items[0]);
			let root_word = Dictionary.get_root_word_from_item(dictionary_handle, items[0]);
			response.sub_text = "`" + root_word + "`:" + explanation + "";
		}

		if(1 < items.length){
			console.error(response); //! not implement.
		}
	}else if("ja" === response.lang){
		if(0 < items.length){
			let root_words = [];
			let explanations = [];
			for(let i = 0; i < items.length; i++){
				root_words.push(Dictionary.get_root_word_from_item(dictionary_handle, items[i]));

				explanations.push(Dictionary.get_explanation_from_item(dictionary_handle, items[i]));
			}
			main_text = root_words.join(', ');
			response.sub_text = explanations.join(', ');
		}
	}else{
		console.error(response);
	}

	let response_string_main_element_span = document.createElement('span');
	response_string_main_element_span.textContent = main_text;

	response_string_main_element.appendChild(response_string_main_element_span);

	return response_string_main_element;
}

function create_element_with_callback_input_replace(keyword)
{
	let element = create_span_from_text(keyword);
	set_callback_input_replace(element);

	return element;
}

function append_child_of_input_replace(parent_element, header, keyword, footer)
{
	parent_element.appendChild(create_span_from_text(header));
	parent_element.appendChild(create_element_with_callback_input_replace(keyword));
	parent_element.appendChild(create_span_from_text(footer));
}

function create_string_sub_element(response)
{
	let response_string_sub_element = document.createElement('div');
	response_string_sub_element.classList.add('timeline__item__response__string__sub');

	if(! response.sub_text){
		append_child_of_input_replace(
				response_string_sub_element,
				'`', response.matching_keyword, '` is not match.');

		if(Language.get_code() === response.lang){
			if(0 !== response.candidate_items.length){
				let candidate_word = Dictionary.get_root_word_from_item(dictionary_handle, response.candidate_items[0]);
				append_child_of_input_replace(
						response_string_sub_element,
						' If your search to `', candidate_word, '`?');
			}

			if(1 < response.candidate_items.length){
				console.error(response); //! not implement.
			}
		}else if("ja" == response.lang){
			if(0 !== response.glosses.length){
				response_string_sub_element.appendChild(create_span_from_text(' If your search to `'));
				for(let i = 0; i < response.glosses.length; i++){
					if(0 != i){
						response_string_sub_element.appendChild(create_span_from_text(','));
					}

					response_string_sub_element.appendChild(
							create_element_with_callback_input_replace(response.glosses[i]));
				}
				response_string_sub_element.appendChild(create_span_from_text('`?'));
			}
		}else{
			console.error(response);
		}

		if(ExternalBrowser.is_enable()){
			let src_lang = Language.get_code_by_google();
			let dst_lang = 'ja';
			if("ja" == response.lang){
				src_lang = 'ja';
				dst_lang = Language.get_code_by_google();
			}

			response_string_sub_element.appendChild(document.createElement('br'));

			const keyword = Esperanto.convert_alfabeto_from_caret_sistemo(response.matching_keyword);
			let element = ExternalBrowser.create_onclick_google_translate(
					keyword, src_lang, dst_lang);
			response_string_sub_element.appendChild(element);
		}
	}else{
		response_string_sub_element.textContent = response.sub_text;
	}


	return response_string_sub_element;
}

function juriamo_str_from_content(str){
	let t = str;
	t = Esperanto.caret_sistemo_from_str(t);
	t = Esperanto.convert_alfabeto_from_caret_sistemo(t);
	t = Juriamo.convert_juriamo_assign_from_alfabeto(t);
	t = Juriamo.convert_juriamo_assign(t);
	t = t.replace(/[\s\t　]+/, ' ');
	return t;
}

function get_response_element(response, is_display_keyword)
{
	let response_element = document.createElement('div');
	response_element.classList.add('timeline__item__response');
	let response_icon_element = document.createElement('div');
	response_icon_element.classList.add('timeline__item__response__icon');
	let response_keyword_element = create_keyword_element(response);
	let response_string_element = document.createElement('div');
	response_string_element.classList.add('timeline__item__response__string');
	let response_string_main_element = create_string_main_element(response);
	let response_string_sub_element = create_string_sub_element(response);

	if(! is_display_keyword){
		response_keyword_element.style.display="none";
	}

	response_element.appendChild(response_icon_element);
	response_element.appendChild(response_keyword_element);
	response_element.appendChild(response_string_element);
	response_string_element.appendChild(response_string_main_element);
	response_string_element.appendChild(response_string_sub_element);
	if(response.sub_text){ // is match
		let response_string_sub_element_juriamo_assign = document.createElement('div');
		response_string_sub_element_juriamo_assign.classList.add('timeline__item__response__string__sub__juriamo_assign');
		response_string_sub_element_juriamo_assign.classList.add('juriamo_assign');
		let t = response_keyword_element.textContent;
		if(response.lang === 'ja'){
			t = response_string_main_element.textContent;
		}
		t = juriamo_str_from_content(t);
		if(null === t || 0 === t.length || /^[\s　]*$/.test(t)){
			t = '(none)';
		}
		response_string_sub_element_juriamo_assign.textContent = "Juriamo assign: `" + t + "`";
		response_string_element.appendChild(response_string_sub_element_juriamo_assign);
	}

	return response_element;
}

function get_new_timeline_item_element_from_keyword(keyword)
{
	keyword = Juriamo.convert_alfabeto_from_juriamo_assign(keyword);
	keyword = Esperanto.caret_sistemo_from_str(keyword);

	let responses = Linad.getResponsesFromKeystring(dictionary_handle, keyword);

	// elementの生成
	let timeline_item_element = document.createElement('div');
	timeline_item_element.classList.add('timeline__item');
	let timeline_item_id_str = "timeline__item_" + timeline_item_id;
	timeline_item_element.id = timeline_item_id_str;

	// 表示文字列の生成と挿入
	let query_text = keyword;
	query_text = Esperanto.convert_alfabeto_from_caret_sistemo(query_text);
	query_text = "`" + query_text + "`";
	let sub_str = '';
	if(1 == responses.length && null !== responses[0].keyword_modify_kind){
		sub_str = ' -> `' + responses[0].matching_keyword + '` of ' + responses[0].keyword_modify_kind;
	}
	let query_element = get_query_element(query_text, sub_str);

	// elementの挿入
	timeline_item_element.appendChild(query_element);
	{
		let t = juriamo_str_from_content(query_element.textContent);
		let juriamo_element = document.createElement('div');
		juriamo_element.classList.add('timeline__item__query__string__juriamo_assign');
		juriamo_element.classList.add('juriamo_assign');
		if(null === t || 0 === t.length || /^[\s　]*$/.test(t)){
			t = '(none)';
		}
		juriamo_element.textContent = "Juriamo assign: `" + t + "`";
		timeline_item_element.appendChild(juriamo_element);
	}

	let responses_element = get_responses_element(responses);
	timeline_item_element.appendChild(responses_element);

	return timeline_item_element;
}

function create_span_from_text(text)
{
	let element = document.createElement('span');
	element.textContent = text;

	return element;
}

function set_callback_input_replace(element)
{
	element.classList.add('input-replace-button');
	element.addEventListener('click', function(e){
		let element = e.target;
		let input_element = document.getElementById('query-area__query-input__input');
		input_element.value = element.textContent;

		document.getElementById('query-area__query-input__input').focus();
	}, true);
}

function update_query_input_element_datalist(keyword)
{
	let query_incrementals_element = document.getElementById('query-area__query-incrementals');

	// clear
	while (query_incrementals_element.firstChild) {
		query_incrementals_element.removeChild(query_incrementals_element.firstChild);
	}

	const items = Linad.getIncrementalItemsFromKeyword(dictionary_handle, keyword);
	for(let i = 0; i < items.length; i++){
		const show_word = Dictionary.get_show_word_from_item(dictionary_handle, items[i]);

		if(0 != i){
			query_incrementals_element.appendChild(create_span_from_text('|'));
		}

		query_incrementals_element.appendChild(create_element_with_callback_input_replace(show_word));
	}

	// ** pre print
	// **** remove prev preprint
	let prev_elems = document.querySelectorAll('.timeline__item__incremental__preprint');
	prev_elems.forEach(function(elem) {
		elem.remove();
	});

	if(/^\s*$/.test(keyword)){
		return;
	}
	if(keyword.startsWith(':')){
		return;
	}

	// **** add preprints
	items.forEach(function(item) {
		keyword = Dictionary.get_show_word_from_item(dictionary_handle, item);
		let elem = add_timeline_item_element_from_keyword(keyword)
		if(null !== elem){
			elem.classList.add('timeline__item__incremental__preprint');
		}
	});
}

function command(keyword)
{
	try{
		let res = Language.command(keyword);
		if(null !== res){
			return res;
		}
	}catch(err){
		return "Internal error. " + err.message;
	}

	if(0 === keyword.indexOf(":help")){
		return ":help " + Language.get_command_list().join(" ");
	}

	return null;
}

function query_input_element()
{
	if(! Dictionary.is_initialized(dictionary_handle)){
		console.log("dictionary not init.");
		return;
	}

	let elem_bef = document.getElementById('timeline__item__incremental__preprint');
	if(null !== elem_bef){
		elem_bef.remove();
	}

	let obj_input = document.getElementById('query-area__query-input__input');
	let keyword = obj_input.value;
	obj_input.value = "";

	if(/^\s*$/.test(keyword)){
		return null;
	}

	timeline_item_id++;
	add_timeline_item_element_from_keyword(keyword);
	history.append_keyword(keyword, null);
}

function add_timeline_item_element_from_keyword(keyword)
{
	let timeline_item_element = null;
	let res = command(keyword);
	if(null !== res){
		timeline_item_element = document.createElement('div');
		timeline_item_element.classList.add('timeline__item');

		let query_text = "`" + keyword + "`";
		let query_element = get_query_element(query_text, null);

		let responses_element = document.createElement('div');
		responses_element.classList.add('timeline__item__response');
		responses_element.innerHTML = conv_text_html_from_plain(res);

		// elementの挿入
		timeline_item_element.appendChild(query_element);
		timeline_item_element.appendChild(responses_element);

	}else{
		timeline_item_element = get_new_timeline_item_element_from_keyword(keyword);
	}

	let timeline_element = document.getElementById('timeline');
	timeline_element.appendChild(timeline_item_element);

	// 追加したtimeline_item(最下部)へスクロール
	let positionY = timeline_item_element.offsetTop; // 変更点
	scrollTo(0, positionY);

	return timeline_item_element;
}

function on_keypress_by_query_input_element(e)
{
	let code = e.charCode;

	//エンターキー押下以外は終了
	if(13 !== code)
	{
		return;
	}

	query_input_element();
}

function on_keyup_by_query_input_element(e)
{
	let obj_input = document.getElementById('query-area__query-input__input');
	let keyword = obj_input.value;
	keyword = Esperanto.caret_sistemo_from_str(keyword);

	update_query_input_element_datalist(keyword);
}

