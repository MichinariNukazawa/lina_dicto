'use strict';

var timeline_item_id = 0;

window.onload = function(e){
	// 入力欄にフォーカスを与える
	document.getElementById('search_input').focus();

	init_dictionary();
}

function get_new_timeline_item_element_from_keyword(keyword)
{
	timeline_item_id++;

	var timeline_item_element = document.createElement('div');
	timeline_item_element.classList.add('timeline_item');
	var timeline_item_id_str = "timeline_item_" + timeline_item_id;
	timeline_item_element.id = timeline_item_id_str;

	var query_element = document.createElement('div');
	timeline_item_element.classList.add('timeline_item_query');

	var explanation_element = document.createElement('div');
	timeline_item_element.classList.add('timeline_item_explanation');

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

	query_element.textContent = query_text;
	explanation_element.textContent = explanation_text;
	timeline_item_element.appendChild(query_element);
	timeline_item_element.appendChild(explanation_element);

	return timeline_item_element;
}

function update_search_input_datalist(keyword)
{
	var search_input_incrementals_element = document.getElementById('search_input_incrementals');

	search_input_incrementals_element.textContent = ''; // clear

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

	search_input_incrementals_element.textContent = options_text;
}

function on_keypress_by_search_input(e)
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

	var obj_input = document.getElementById('search_input');
	var keyword = obj_input.value;
	obj_input.value = "";

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

function on_keyup_by_search_input(e)
{
	var obj_input = document.getElementById('search_input');
	var keyword = obj_input.value;
	update_search_input_datalist(keyword);
}

