'use strict';

const fs = require('fs');
const path = require('path');

var dictionary;

function dictionary_is_init()
{
	if(dictionary){
		return true;
	}else{
		return false;
	}
}

function init_dictionary()
{
	console.log("init_dictionary");

	var datafile = path.join(__dirname, 'data/dictionary00.json');
	var t = fs.readFileSync(datafile, 'utf8');
	var dict = JSON.parse(t);

	var arrayLength = dict.length;
	for (var i = 0; i < arrayLength; i++) {
		dict[i][2] = dict[i][0].replace(/\//g, "");

		if(0 == i % 100){
			console.log("%d/%d: `%s`,`%s`",
					i, arrayLength, dict[i][2], dict[i][0]);
		}
	}

	dictionary = dict;
}

function dictionary_get_item_from_keyword(keyword)
{
	const len = dictionary.length;
	for (let i = 0; i < len; i++) {
		let show_word = dictionary_get_show_word_from_item(dictionary[i]);

		// 代用表記以外の末尾の記号を取り除く
		keyword = keyword.replace(/[^A-Za-z^~]$/g, "");
		show_word = show_word.replace(/[^A-Za-z^~]$/g, "");

		// 大文字小文字を区別しない
		keyword = keyword.toLowerCase();
		show_word = show_word.toLowerCase();

		if(keyword === show_word){
			return dictionary[i];
		}
	}

	return null;
}

//! インクリメンタルサーチ(先頭マッチ)
function dictionary_get_index_from_incremental_keyword(keyword)
{
	if( 0 == keyword.length){
		return -1;
	}

	const arrayLength = dictionary.length;
	for (let i = 0; i < arrayLength; i++) {
		if(0 === dictionary[i][2].toLowerCase().indexOf(keyword.toLowerCase())){
			return i;
		}
		if(0 === dictionary[i][0].toLowerCase().indexOf(keyword.toLowerCase())){
			return i;
		}
	}

	return -1;
}

function dictionary_get_item_from_index(index)
{
	const arrayLength = dictionary.length;
	if(index < 0 || arrayLength <= index){
		return null;
	}

	return dictionary[index];
}

//! keyword(ユーザ入力形式)を返す
function dictionary_get_show_word_from_item(item)
{
	if(! item){
		return "";
	}

	return item[2];
}

//! 意味を返す
function dictionary_get_explanation_from_item(item)
{
	if(! item){
		return "";
	}

	return item[1];
}

//! 語根表記(ex. "Bon/an maten/on!")を返す
function dictionary_get_root_word_from_item(item)
{
	if(! item){
		return "";
	}

	return item[0];
}

/** @brief 訳語の配列を返す
 *	test文字列: abismo, aboco
 */
function dictionary_get_glosses_from_item(item)
{
	let glosses = [];
	let explanation = dictionary_get_explanation_from_item(item);

	let mean_words = explanation.split(";");		// 語義を切り出し
	for(let i = 0; i < mean_words.length; i++){
		let mean_word = mean_words[i];
		// 前方を除去
		mean_word = mean_word.replace(/\{.+\}/g, "");		// 公認語根情報
		mean_word = mean_word.replace(/［.+］/g, "");		// 文法情報(品詞情報)
		mean_word = mean_word.replace(/【.+】/g, "");		// 専門用語の略号
		mean_word = mean_word.replace(/《.+》/g, "");		// その他略記号

		// 後方を除去
		mean_word = mean_word.replace(/=.+$/g, "");		// 同義語's
		mean_word = mean_word.replace(/>>.+$/g, "");		// 関連語・類義語
		mean_word = mean_word.replace(/><.+$/g, "");		// 反対語・対義語

		// 中を除去
		mean_word = mean_word.replace(/（[属科種]）/g, "");		// 動植物名分類(属科種)

		let gs = mean_word.split(",");	// 訳語を切り出し

		Array.prototype.push.apply(glosses, gs);
	}

	glosses = glosses.filter(function(e){return e !== "";});	// 空文字を除去
	console.log(glosses);

	return glosses;
}

