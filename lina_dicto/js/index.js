'use strict';

var extension = new Extension();

var timeline_item_id = 0;

window.onload = function(e){
	// 入力欄にフォーカスを与える
	document.getElementById('query-area__query-input__input').focus();

	init_dictionary();

	if(!extension.init()){
		alart("extension not initialized.");
	}
}

/** @brief スペル修正候補を返す */
function get_candidate_word_from_keyword(keyword)
{
	const candidates = esperanto_get_candidates(keyword);
	for(const candidate of candidates){
		let index = dictionary_get_index_from_incremental_keyword(candidate);
		let item = dictionary_get_item_from_index(index);
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

function get_response_element(response_text, response_sub_text)
{
	let response_element = document.createElement('div');
	response_element.classList.add('timeline__item__response');
	let response_icon_element = document.createElement('div');
	response_icon_element.classList.add('timeline__item__response__icon');
	let response_string_element = document.createElement('div');
	response_string_element.classList.add('timeline__item__response__string');
	let response_string_main_element = document.createElement('div');
	response_string_main_element.classList.add('timeline__item__response__string__main');
	let response_string_sub_element = document.createElement('div');
	response_string_sub_element.classList.add('timeline__item__response__string__sub');
	response_element.appendChild(response_icon_element);
	response_element.appendChild(response_string_element);
	response_string_element.appendChild(response_string_main_element);
	response_string_element.appendChild(response_string_sub_element);

	response_string_main_element.textContent = response_text;
	response_string_sub_element.textContent = response_sub_text;

	return response_element;
}

function get_new_timeline_item_element_from_keyword(keyword)
{
	timeline_item_id++;

	// 表示文字列の生成と挿入
	let query_text = "`" + keyword + "`";
	let response_text = "";
	let response_sub_text = "`" + keyword + "` is not match.";
	if(esperanto_is_esperanto_string(keyword)){
		const item = dictionary_get_item_from_keyword(keyword);
		if(! item){
			// スペル修正候補を探索
			let candidate_item = get_candidate_word_from_keyword(keyword);
			if(candidate_item){
				let candidate_word = dictionary_get_root_word_from_item(candidate_item);
				response_sub_text += "if your search to `" + candidate_word + "`?";
			}
		}else{
			let explanation = dictionary_get_explanation_from_item(item);
			let root_word = dictionary_get_root_word_from_item(item);
			response_sub_text = "`" + root_word + "`:" + explanation + "";
		}

		const glosses = dictionary_get_glosses_from_item(item);
		response_text = glosses.join(",");
	}else{
		// is not esperanto keyword (japanese)
		const indexes = dictionary_get_indexes_from_jkeyword(keyword);
		if(0 == indexes.length){
			if(1 < keyword.length){
				let glosses = dictionary_get_glosses_info_from_jkeyword(keyword);
				if(0 < glosses.length){
					let candidate_words = glosses.join(",");
					response_sub_text += "if your search to `" + candidate_words + "`?";
				}
			}
		}else{
			let root_words = [];
			let explanations = [];
			for(let i = 0; i < indexes.length; i++){
				const item = dictionary_get_item_from_index(indexes[i]);
				root_words.push(dictionary_get_root_word_from_item(item));

				explanations.push(dictionary_get_explanation_from_item(item));
			}
			response_text = root_words.join(', ');
			response_sub_text = explanations.join(', ');
		}
	}

	// エスペラント代用表記のダイアクリティカルマーク変換
	query_text = seperanto_convert_alfabeto_from_caret_sistemo(query_text);
	response_sub_text = seperanto_convert_alfabeto_from_caret_sistemo(response_sub_text);
	// elementの生成
	let timeline_item_element = document.createElement('div');
	timeline_item_element.classList.add('timeline__item');
	let timeline_item_id_str = "timeline__item_" + timeline_item_id;
	timeline_item_element.id = timeline_item_id_str;

	let query_element = get_query_element(query_text);
	let response_element = get_response_element(response_text, response_sub_text);

	// elementの挿入
	timeline_item_element.appendChild(query_element);
	timeline_item_element.appendChild(response_element);

	return timeline_item_element;
}

function update_query_input_element_datalist(keyword)
{
	let query_incrementals_element = document.getElementById('query-area__query-incrementals');

	query_incrementals_element.textContent = ''; // clear

	let index = dictionary_get_index_from_incremental_keyword(keyword);
	if(-1 == index){
		return;
	}

	let options_text = '';
	let options = '';
	for(var i = 0; i < 3; i++){
		let item = dictionary_get_item_from_index(index + i);
		if(! item){
			break;
		}
		let show_word = dictionary_get_show_word_from_item(item);

		if(0 != i){
			options_text += ' | ';
		}
		options_text += '' + show_word + '';
	}

	query_incrementals_element.textContent = options_text;
}

function on_keypress_by_query_input_element(e)
{
	let code = e.charCode;

	//エンターキー押下以外は終了
	if(13 !== code)
	{
		return;
	}

	if(! dictionary_is_init()){
		console.log("dictionary not init.");
		return;
	}

	let obj_input = document.getElementById('query-area__query-input__input');
	let keyword = obj_input.value;
	obj_input.value = "";

	keyword = esperanto_caret_sistemo_from_str(keyword);

	if(0 == keyword.length){
		return;
	}

	let obj_timeline = document.getElementById('timeline');

	let timeline_item_element = get_new_timeline_item_element_from_keyword(keyword);

	obj_timeline.appendChild(timeline_item_element);

	// 追加したtimeline_item(最下部)へスクロール
	let positionY = timeline_item_element.offsetTop; // 変更点
	scrollTo(0, positionY);
}

function on_keyup_by_query_input_element(e)
{
	let obj_input = document.getElementById('query-area__query-input__input');
	let keyword = obj_input.value;
	keyword = esperanto_caret_sistemo_from_str(keyword);

	update_query_input_element_datalist(keyword);
}

