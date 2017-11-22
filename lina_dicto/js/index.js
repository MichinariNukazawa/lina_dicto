'use strict';

var extension = new Extension();
var platform = new Platform();
let dictionary = new Dictionary();
let esperanto = new Esperanto();

var timeline_item_id = 0;

window.onload = function(e){
	// 入力欄にフォーカスを与える
	document.getElementById('query-area__query-input__input').focus();

	let dictionary_data = dictionary_loader();
	dictionary.init_dictionary(dictionary_data);

	if(!extension.init()){
		alart("extension not initialized.");
	}

	if(!platform.init()){
		alart("platform not initialized.");
	}

	window.addEventListener('resize', function(){
		resize_query_input(get_window_height());
	}, true);
}

var query_input_default = {
	'input_height':-1,
	'timeline_padding_bottom':-1,
};

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

/** @brief スペル修正候補を返す */
function get_candidate_word_from_keyword(keyword)
{
	const candidates = esperanto.get_candidates(keyword);
	for(const candidate of candidates){
		let index = dictionary.get_index_from_incremental_keyword(candidate);
		let item = dictionary.get_item_from_index(index);
		if(item){
			return item;
		}
	}

	return null;
}

function get_query_element(query_text)
{
	// elementの生成
	let query_element = document.createElement('div');
	query_element.classList.add('timeline__item__query');
	let query_icon_element = document.createElement('div');
	query_icon_element.classList.add('timeline__item__query__icon');
	let query_string_element = document.createElement('div');
	query_string_element.classList.add('timeline__item__query__string');
	query_element.appendChild(query_icon_element);
	query_element.appendChild(query_string_element);

	query_string_element.textContent = query_text;

	return query_element;
}

function get_response_element(response, is_display_keyword)
{
	let response_element = document.createElement('div');
	response_element.classList.add('timeline__item__response');
	let response_icon_element = document.createElement('div');
	response_icon_element.classList.add('timeline__item__response__icon');
	let response_keyword_element = document.createElement('div');
	response_keyword_element.classList.add('timeline__item__response__keyword');
	let response_string_element = document.createElement('div');
	response_string_element.classList.add('timeline__item__response__string');
	let response_string_main_element = document.createElement('div');
	response_string_main_element.classList.add('timeline__item__response__string__main');
	let response_string_sub_element = document.createElement('div');
	response_string_sub_element.classList.add('timeline__item__response__string__sub');

	if(! is_display_keyword){
		response_keyword_element.style.display="none";
	}

	response_element.appendChild(response_icon_element);
	response_element.appendChild(response_keyword_element);
	response_element.appendChild(response_string_element);
	response_string_element.appendChild(response_string_main_element);
	response_string_element.appendChild(response_string_sub_element);

	response_keyword_element.textContent = response.matching_keyword;
	response_string_main_element.textContent = response.match_results.join(', ');;
	response_string_sub_element.textContent = response.sub_text;

	return response_element;
}

function get_reponse_from_jkeyword(response, keyword)
{
	response.matching_keyword = keyword;

	// is not esperanto keyword (japanese)
	const indexes = dictionary.get_indexes_from_jkeyword(keyword);
	if(0 == indexes.length){
		if(1 < keyword.length){
			let glosses = dictionary.get_glosses_info_from_jkeyword(keyword);
			if(0 < glosses.length){
				let candidate_words = glosses.join(",");
				response.sub_text += "if your search to `" + candidate_words + "`?";
			}
		}
	}else{
		let root_words = [];
		let explanations = [];
		for(let i = 0; i < indexes.length; i++){
			const item = dictionary.get_item_from_index(indexes[i]);
			root_words.push(dictionary.get_root_word_from_item(item));

			explanations.push(dictionary.get_explanation_from_item(item));
		}

		response.match_results = root_words;
		response.sub_text = explanations.join(', ');
	}

	return response;
}

function get_kw(words, head, c_word)
{
	let kw = "";
	if(words.length < (head + c_word)){
		return "";
	}
	let ws = [];
	for(let i = 0; i < c_word; i++){
		ws.push(words[head + i]);
	}

	kw = ws.join(" ");

	return kw;
}

function get_responses_from_keyword(keyword)
{
	let responses = [];

	// 先頭の空白を取り除く
	keyword = keyword.replace(/^[\s　]*/g, "");
	// keywordをword毎に分割
	const words = keyword.split(/\s/);

	let head = 0;
	while(head < words.length){
		let response = {};
		response.matching_keyword = "";
		response.match_results = [];
		response.sub_text = "`" + words[head] + "` is not match.";

		// 検索
		if(! esperanto.is_esperanto_string(words[head])){
			// 日本語検索
			response = get_reponse_from_jkeyword(response, words[head]);
			head++;
		}else{
			// エスペラント検索
			// 先頭3文字分から単語検索
			let c_word;
			let kw;
			let item = null;
			for(c_word = 3; 0 < c_word; c_word--){
				kw = get_kw(words, head, c_word);
				// 代用表記以外の末尾の記号を取り除く(word間の記号は除かない)
				kw = kw.replace(/[^A-Za-z^~]$/g, "");
				item = dictionary.get_item_from_keyword(kw);
				if(item){
					break;
				}
			}
			head += (0 != c_word)? c_word : 1;
			response.matching_keyword = kw;

			if(! item){
				response.sub_text = "`" + kw + "` is not match.";
				// スペル修正候補を探索
				let candidate_item = get_candidate_word_from_keyword(kw);
				if(candidate_item){
					let candidate_word = dictionary.get_root_word_from_item(candidate_item);
					response.sub_text += "if your search to `" + candidate_word + "`?";
				}
			}else{
				let explanation = dictionary.get_explanation_from_item(item);
				let root_word = dictionary.get_root_word_from_item(item);
				response.sub_text = "`" + root_word + "`:" + explanation + "";
				const glosses = dictionary.get_glosses_from_item(item);
				response.match_results = glosses;
			}
		}

		response.sub_text = esperanto.convert_alfabeto_from_caret_sistemo(response.sub_text);
		responses.push(response);
	}

	return responses;
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

function get_new_timeline_item_element_from_keyword(keyword)
{
	timeline_item_id++;

	// 表示文字列の生成と挿入
	let query_text = "`" + keyword + "`";
	query_text = esperanto.convert_alfabeto_from_caret_sistemo(query_text);
	let responses = get_responses_from_keyword(keyword);

	// elementの生成
	let timeline_item_element = document.createElement('div');
	timeline_item_element.classList.add('timeline__item');
	let timeline_item_id_str = "timeline__item_" + timeline_item_id;
	timeline_item_element.id = timeline_item_id_str;

	let query_element = get_query_element(query_text);
	let responses_element = get_responses_element(responses);

	// elementの挿入
	timeline_item_element.appendChild(query_element);
	timeline_item_element.appendChild(responses_element);

	return timeline_item_element;
}

function create_span_from_text(text)
{
	let element = document.createElement('span');
	element.textContent = text;

	return element;
}

function update_query_input_element_datalist(keyword)
{
	let query_incrementals_element = document.getElementById('query-area__query-incrementals');

	// clear
	while (query_incrementals_element.firstChild) {
		query_incrementals_element.removeChild(query_incrementals_element.firstChild);
	}

	let index = dictionary.get_index_from_incremental_keyword(keyword);
	if(-1 == index){
		return;
	}

	let options_text = '';
	let options = '';
	for(var i = 0; i < 3; i++){
		let item = dictionary.get_item_from_index(index + i);
		if(! item){
			break;
		}
		let show_word = dictionary.get_show_word_from_item(item);

		if(0 != i){
			let element = create_span_from_text('|');
			query_incrementals_element.appendChild(element);
		}

		let element = create_span_from_text(show_word);
		element.classList.add('query-area__query-incrementals__candidate');
		query_incrementals_element.appendChild(element);
		element.addEventListener('click', function(e){
			let element = e.target;
			let input_element = document.getElementById('query-area__query-input__input');
			input_element.value = element.textContent;

			document.getElementById('query-area__query-input__input').focus();
		}, true);
	}
}

function query_input_element()
{
	if(! dictionary.is_init()){
		console.log("dictionary not init.");
		return;
	}

	let obj_input = document.getElementById('query-area__query-input__input');
	let keyword = obj_input.value;
	obj_input.value = "";

	keyword = esperanto.caret_sistemo_from_str(keyword);

	if(0 == keyword.length){
		return;
	}

	let timeline_element = document.getElementById('timeline');

	let timeline_item_element = get_new_timeline_item_element_from_keyword(keyword);

	timeline_element.appendChild(timeline_item_element);

	// 追加したtimeline_item(最下部)へスクロール
	let positionY = timeline_item_element.offsetTop; // 変更点
	scrollTo(0, positionY);
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
	keyword = esperanto.caret_sistemo_from_str(keyword);

	update_query_input_element_datalist(keyword);
}

