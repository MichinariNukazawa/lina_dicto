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

function get_new_timeline_item_element_from_keyword(keyword)
{
	timeline_item_id++;

	// elementの生成
	var timeline_item_element = document.createElement('div');
	timeline_item_element.classList.add('timeline__item');
	var timeline_item_id_str = "timeline__item_" + timeline_item_id;
	timeline_item_element.id = timeline_item_id_str;

	var query_element = document.createElement('div');
	query_element.classList.add('timeline__item__query');
	var query_icon_element = document.createElement('div');
	query_icon_element.classList.add('timeline__item__query__icon');
	var query_string_element = document.createElement('div');
	query_string_element.classList.add('timeline__item__query__string');
	query_element.appendChild(query_icon_element);
	query_element.appendChild(query_string_element);

	var response_element = document.createElement('div');
	response_element.classList.add('timeline__item__response');
	var response_icon_element = document.createElement('div');
	response_icon_element.classList.add('timeline__item__response__icon');
	var response_string_element = document.createElement('div');
	response_string_element.classList.add('timeline__item__response__string');
	var response_string_main_element = document.createElement('div');
	response_string_main_element.classList.add('timeline__item__response__string__main');
	var response_string_sub_element = document.createElement('div');
	response_string_sub_element.classList.add('timeline__item__response__string__sub');
	response_element.appendChild(response_icon_element);
	response_element.appendChild(response_string_element);
	response_string_element.appendChild(response_string_main_element);
	response_string_element.appendChild(response_string_sub_element);

	timeline_item_element.appendChild(query_element);
	timeline_item_element.appendChild(response_element);

	// 表示文字列の生成と挿入
	var item = dictionary_get_item_from_keyword(keyword);
	var query_text = "";
	var explanation_text = "internal error.";
	query_text = "`" + keyword + "`";
	if(! item){
		explanation_text = "`" + keyword + "` is not match.";
	}else{
		let explanation = dictionary_get_explanation_from_item(item);
		let root_word = dictionary_get_root_word_from_item(item);
		explanation_text = "`" + root_word + "`:" + explanation + "";
	}

	// エスペラント代用表記のダイアクリティカルマーク変換
	query_text = esperanto_convert_diacritical_mark(query_text);
	explanation_text = esperanto_convert_diacritical_mark(explanation_text);

	const glosses = dictionary_get_glosses_from_item(item);
	const glosses_text = glosses.join(",");

	query_string_element.textContent = query_text;
	response_string_main_element.textContent = glosses_text;
	response_string_sub_element.textContent = explanation_text;

	return timeline_item_element;
}

function update_query_input_element_datalist(keyword)
{
	var query_incrementals_element = document.getElementById('query-area__query-incrementals');

	query_incrementals_element.textContent = ''; // clear

	var index = dictionary_get_index_from_incremental_keyword(keyword);
	if(-1 == index){
		return;
	}

	var options_text = '';
	var options = '';
	for(var i = 0; i < 3; i++){
		var item = dictionary_get_item_from_index(index + i);
		if(! item){
			break;
		}
		var show_word = dictionary_get_show_word_from_item(item);

		if(0 != i){
			options_text += ' | ';
		}
		options_text += '' + show_word + '';
	}

	query_incrementals_element.textContent = options_text;
}

function on_keypress_by_query_input_element(e)
{
	var code = e.charCode;

	//エンターキー押下以外は終了
	if(13 !== code)
	{
		return;
	}

	if(! dictionary_is_init()){
		console.log("dictionary not init.");
		return;
	}

	var obj_input = document.getElementById('query-area__query-input__input');
	var keyword = obj_input.value;
	obj_input.value = "";

	keyword = esperanto_convert_caret_from_x_sistemo(keyword);

	if(0 == keyword.length){
		return;
	}

	var obj_timeline = document.getElementById('timeline');

	var timeline_item_element = get_new_timeline_item_element_from_keyword(keyword);

	obj_timeline.appendChild(timeline_item_element);

	// 追加したtimeline_item(最下部)へスクロール
	var positionY = timeline_item_element.offsetTop; // 変更点
	scrollTo(0, positionY);
}

function on_keyup_by_query_input_element(e)
{
	var obj_input = document.getElementById('query-area__query-input__input');
	var keyword = obj_input.value;
	keyword = esperanto_convert_caret_from_x_sistemo(keyword);

	update_query_input_element_datalist(keyword);
}

