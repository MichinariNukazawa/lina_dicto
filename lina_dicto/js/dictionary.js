'use strict';

const Esperanto = require('../js/esperanto');

module.exports = class Dictionary{
	static is_initialized(handle)
	{
		if(null === handle){
			return false;
		}
		if('object' !== typeof handle){
			return false;
		}
		if(! handle.hasOwnProperty('dictionary')){
			return false;
		}
		return true;
	}

	static init_hash_of_esperanto_(handle)
	{
		handle.hash_of_esperanto = [];

		const array_length = handle.dictionary.length;
		for (let i = 0; i < array_length; i++) {
			const root_word = Dictionary.get_root_word_from_item(handle, handle.dictionary[i]).toLowerCase();
			/** 辞書の並び順に'-'で始まる単語などが混じっているので、
			 * 先頭文字が[A-Za-z]でない単語は、先頭文字変化のチェックを無視
			 */
			if(/^[^A-Za-z]/.test(root_word)){
				continue;
			}
			//! 新しい先頭文字をハッシュに追加
			if(0 == handle.hash_of_esperanto.length
					|| handle.hash_of_esperanto[handle.hash_of_esperanto.length - 1][0] != root_word[0]){
				let hash = [root_word[0], i];
				handle.hash_of_esperanto.push(hash);
			}
		}
	}

	static generate_jakeywords_from_explanation(handle, explanation)
	{
		let glosses = Dictionary.generate_glosses_from_explanation_(handle, explanation);

		for(let i = 0; i < glosses.length; i++){
			// 先頭の括弧を除去
			glosses[i] = glosses[i].replace(/（.+?）/g, "");
		}

		return glosses;
	}

	static generate_jadictionary_from_index_item(handle, index, item)
	{
		let jadict = [];
		const explanation = Dictionary.get_explanation_from_item(handle, item);
		const jakeywords = Dictionary.generate_jakeywords_from_explanation(handle, explanation);
		for(let i = 0; i < jakeywords.length; i++){
			jadict[i] = [jakeywords[i], index];
		}

		return jadict;
	}

	/** @brief 和エス辞書生成 */
	static init_jadictionary_(handle)
	{
		handle.jadictionary = [];

		const dict = handle.dictionary;
		const array_length = dict.length;
		for (let i = 0; i < array_length; i++) {
			const jadict = Dictionary.generate_jadictionary_from_index_item(handle, i, dict[i]);
			Array.prototype.push.apply(handle.jadictionary, jadict);

			/*
			   if(0 == i % 1000){
			   console.log("%d/%d:", i, array_length);
			   console.log(jadict);
			   }
			 */
		}

	}

	static init_edictionary_(handle, dictionary_data)
	{
		let dict = dictionary_data;

		const array_length = dict.length;
		for (let i = 0; i < array_length; i++) {
			//! 検索用keyword
			//! (語根の分かち書き除去済み・lowercase済みのesperanto単語)
			dict[i][2] = dict[i][0].replace(/\//g, "").toLowerCase();

			if(0 == i % 10000){
				console.log("%d/%d: `%s`,`%s`",
						i, array_length, dict[i][2], dict[i][0]);
			}
		}

		handle.dictionary = dict;
	}

	static init_dictionary(dictionary_data)
	{
		console.log("init_dictionary");

		let handle = {
			/** @brief エス和 辞書データ */
			dictionary: null,
			/** @brief 和エス 辞書データ */
			jadictionary: null,
			/** @brief エス和 辞書データ 高速化用ハッシュ
			 * 先頭characterと、その最初の辞書itemを指すindexの集合
			 */
			hash_of_esperanto: null,
		};
		Dictionary.init_edictionary_(handle, dictionary_data);
		Dictionary.init_hash_of_esperanto_(handle);
		Dictionary.init_jadictionary_(handle);

		return handle;
	}

	static manual_lowercase_from_character_(handle, character) {
		if(/[A-Z]/.test(character)){
			return String.fromCharCode(character.charCodeAt(0) | 32);
		}

		return character;
	}

	/** @brief エス和 高速化ハッシュ 先頭文字を受けとり、範囲情報を返す */
	static get_hash_info_from_character_(handle, character)
	{
		character = Dictionary.manual_lowercase_from_character_(handle, character);

		const hash_length = handle.hash_of_esperanto.length;
		for(let i = 0; i < hash_length; i++){
			if(character === handle.hash_of_esperanto[i][0]){
				let hash_info = {};
				hash_info.head_index = handle.hash_of_esperanto[i][1];
				if(i < (hash_length - 1)){
					hash_info.foot_index = handle.hash_of_esperanto[i + 1][1];
				}else{
					hash_info.foot_index = handle.dictionary.length;
				}

				return hash_info;
			}
		}

		return null;
	}

	/** @brief エス和 完全一致検索 */
	static get_item_from_keyword(handle, keyword)
	{
		const dict = handle.dictionary;
		const len = dict.length;
		for (let i = 0; i < len; i++) {
			let show_word = Dictionary.get_show_word_from_item(handle, dict[i]);

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
	static get_index_from_incremental_keyword(handle, keyword)
	{
		if( 0 == keyword.length){
			return -1;
		}

		const hash_info = Dictionary.get_hash_info_from_character_(handle, keyword[0]);
		if(! hash_info){
			return -1;
		}

		const keyword_lowercased = keyword.toLowerCase();
		for (let i = hash_info.head_index; i < hash_info.foot_index; i++) {
			if(0 === handle.dictionary[i][2].indexOf(keyword_lowercased)){
				return i;
			}
		}

		return -1;
	}

	/** @brief 和エス 完全一致検索 */
	static get_indexes_from_jakeyword(handle, jakeyword)
	{
		let indexes = [];
		const jadict = handle.jadictionary;
		const len = jadict.length;
		for (let i = 0; i < len; i++) {
			let word = jadict[i][0];

			// 末尾の記号と空白を取り除く
			jakeyword = jakeyword.replace(/[!！?？\s　]$/g, "");
			word = word.replace(/[!！?？\s　]$/g, "");

			if(jakeyword === word){
				const index = jadict[i][1];
				if(! indexes.includes(index)){
					indexes.push(index);
				}
			}
		}

		return indexes;
	}

	/** @brief 和エス 部分一致検索 */
	static get_glosses_info_from_jakeyword(handle, jakeyword)
	{
		let glosses_head = [];
		let glosses_other = [];

		const jadict = handle.jadictionary;
		const len = jadict.length;
		for (let i = 0; i < len; i++) {
			const word_src = jadict[i][0];

			// 末尾の記号と空白を取り除く
			jakeyword = jakeyword.replace(/[!！?？\s　]$/g, "");
			const word = word_src.replace(/[!！?？\s　]$/g, "");

			const iof = word.indexOf(jakeyword);
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

	static get_item_from_index(handle, index)
	{
		const array_length = handle.dictionary.length;
		if(index < 0 || array_length <= index){
			return null;
		}

		return handle.dictionary[index];
	}

	//! keyword (語根の分かち書き除去済みのesperanto単語) を返す
	static get_show_word_from_item(handle, item)
	{
		if(! item){
			return "";
		}

		return item[0].replace(/\//g, "");
	}

	//! 意味(日本語訳等)を返す
	static get_explanation_from_item(handle, item)
	{
		if(! item){
			return "";
		}

		return item[1];
	}

	//! 語根表記(ex. "Bon/an maten/on!")を返す
	static get_root_word_from_item(handle, item)
	{
		if(! item){
			return "";
		}

		return item[0];
	}

	/** @brief 訳語の配列を返す
	 *	test文字列: abismo, aboco
	 */
	static get_glosses_from_item(handle, item)
	{
		const explanation = Dictionary.get_explanation_from_item(handle, item);
		return Dictionary.generate_glosses_from_explanation_(handle, explanation);
	}

	/** @brief 訳語の配列を生成して返す
	 *	test文字列: abismo, aboco
	 */
	static generate_glosses_from_explanation_(handle, explanation)
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
};

