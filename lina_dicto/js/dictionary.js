'use strict';

/** @brief エス和 辞書データ */
var dictionary;
/** @brief 和エス 辞書データ */
var jdictionary;

/** @brief エス和 辞書データ 高速化用ハッシュ
 * 先頭characterと、その最初の辞書itemを指すindexの集合
 */
var hash_of_esperanto;

function dictionary_is_init()
{
	if(dictionary){
		return true;
	}else{
		return false;
	}
}

function init_hash_of_esperanto()
{
	hash_of_esperanto = [];

	const array_length = dictionary.length;
	for (let i = 0; i < array_length; i++) {
		const root_word = dictionary_get_root_word_from_item(dictionary[i]).toLowerCase();
		if(0 == hash_of_esperanto.length
				|| hash_of_esperanto[hash_of_esperanto.length - 1][0] != root_word[0]){
			let hash = [root_word[0], i];
			hash_of_esperanto.push(hash);
		}
	}
}

function dictionary_generate_jkeywords_from_explanation(explanation)
{
	let glosses = dictionary_generate_glosses_from_explanation(explanation);

	for(let i = 0; i < glosses.length; i++){
		// 先頭の括弧を除去
		glosses[i] = glosses[i].replace(/（.+?）/g, "");
	}

	return glosses;
}

function dictionary_generate_jdictionary_from_index_item(index, item)
{
	let jdict = [];
	const explanation = dictionary_get_explanation_from_item(item);
	const jkeywords = dictionary_generate_jkeywords_from_explanation(explanation);
	for(let i = 0; i < jkeywords.length; i++){
		jdict[i] = [jkeywords[i], index];
	}

	return jdict;
}

/** @brief 和エス辞書生成 */
function init_jdictionary()
{
	jdictionary = [];

	const dict = dictionary;
	const array_length = dict.length;
	for (let i = 0; i < array_length; i++) {
		const jdict = dictionary_generate_jdictionary_from_index_item(i, dict[i]);
		Array.prototype.push.apply(jdictionary, jdict);

		if(0 == i % 1000){
			console.log("%d/%d:", i, array_length);
			console.log(jdict);
		}
	}

}

function init_dictionary()
{
	console.log("init_dictionary");

	let dict = dictionary_loader();

	const array_length = dict.length;
	for (let i = 0; i < array_length; i++) {
		dict[i][2] = dict[i][0].replace(/\//g, "");

		if(0 == i % 1000){
			console.log("%d/%d: `%s`,`%s`",
					i, array_length, dict[i][2], dict[i][0]);
		}
	}

	dictionary = dict;

	init_hash_of_esperanto();
	init_jdictionary();
}

function manual_lowercase_from_character(character) {
	if(/[A-Z]/.test(character)){
		return String.fromCharCode(character.charCodeAt(0) | 32);
	}

	return character;
}

/** @brief エス和 高速化ハッシュ 先頭文字を受けとり、範囲情報を返す */
function dictionary_get_hash_info_from_character(character)
{
	character = manual_lowercase_from_character(character);

	const hash_length = hash_of_esperanto.length;
	for(let i = 0; i < hash_length; i++){
		if(character === hash_of_esperanto[i][0]){
			let hash_info = {};
			hash_info.head_index = hash_of_esperanto[i][1];
			if(i < (hash_length - 1)){
				hash_info.foot_index = hash_of_esperanto[i + 1][1];
			}else{
				hash_info.foot_index = dictionary.length;
			}

			return hash_info;
		}
	}

	return null;
}

/** @brief エス和 完全一致検索 */
function dictionary_get_item_from_keyword(keyword)
{
	const dict = dictionary;
	const len = dict.length;
	for (let i = 0; i < len; i++) {
		let show_word = dictionary_get_show_word_from_item(dict[i]);

		// 代用表記以外の末尾の記号を取り除く
		keyword = keyword.replace(/[^A-Za-z^~]$/g, "");
		show_word = show_word.replace(/[^A-Za-z^~]$/g, "");

		// 大文字小文字を区別しない
		keyword = keyword.toLowerCase();
		show_word = show_word.toLowerCase();

		if(keyword === show_word){
			return dict[i];
		}
	}

	return null;
}

/** @brief エス和 インクリメンタルサーチ(先頭一致) */
function dictionary_get_index_from_incremental_keyword(keyword)
{
	if( 0 == keyword.length){
		return -1;
	}

	let hash_info = dictionary_get_hash_info_from_character(keyword[0]);
	if(! hash_info){
		return -1;
	}

	for (let i = hash_info.head_index; i < hash_info.foot_index; i++) {
		if(0 === dictionary[i][2].toLowerCase().indexOf(keyword.toLowerCase())){
			return i;
		}
		if(0 === dictionary[i][0].toLowerCase().indexOf(keyword.toLowerCase())){
			return i;
		}
	}

	return -1;
}

/** @brief 和エス 完全一致検索 */
function dictionary_get_indexes_from_jkeyword(jkeyword)
{
	let indexes = [];
	const jdict = jdictionary;
	const len = jdict.length;
	for (let i = 0; i < len; i++) {
		let word = jdict[i][0];

		// 末尾の記号と空白を取り除く
		jkeyword = jkeyword.replace(/[!！?？\s　]$/g, "");
		word = word.replace(/[!！?？\s　]$/g, "");

		if(jkeyword === word){
			const index = jdict[i][1];
			if(! indexes.includes(index)){
				indexes.push(index);
			}
		}
	}

	return indexes;
}

/** @brief 和エス 部分一致検索 */
function dictionary_get_glosses_info_from_jkeyword(jkeyword)
{
	let glosses_head = [];
	let glosses_other = [];

	const jdict = jdictionary;
	const len = jdict.length;
	for (let i = 0; i < len; i++) {
		const word_src = jdict[i][0];

		// 末尾の記号と空白を取り除く
		jkeyword = jkeyword.replace(/[!！?？\s　]$/g, "");
		const word = word_src.replace(/[!！?？\s　]$/g, "");

		const iof = word.indexOf(jkeyword);
		if(-1 !== iof){
			if(0 === iof){
				if(! glosses_head.includes(word_src)){
					glosses_head.push(word_src);
				}
			}else{
				if(! glosses_other.includes(word_src)){
					glosses_other.push(word_src);
				}
			}
			if(3 <= glosses_head.length){
				break;
			}
		}
	}

	let glosses = glosses_head.concat(glosses_other);
	if(3 < glosses.length){
		glosses.length = 3;
	}

	return glosses;
}

function dictionary_get_item_from_index(index)
{
	const array_length = dictionary.length;
	if(index < 0 || array_length <= index){
		return null;
	}

	return dictionary[index];
}

//! keyword (分かち書きなしesperanto単語) を返す
function dictionary_get_show_word_from_item(item)
{
	if(! item){
		return "";
	}

	return item[2];
}

//! 意味(日本語訳等)を返す
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
	const explanation = dictionary_get_explanation_from_item(item)
	return dictionary_generate_glosses_from_explanation(explanation);
}

/** @brief 訳語の配列を生成して返す
 *	test文字列: abismo, aboco
 */
function dictionary_generate_glosses_from_explanation(explanation)
{
	let glosses = [];

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

	return glosses;
}

