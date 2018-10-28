'use strict';

const Language = require('../js/language');
const Esperanto = require('../js/esperanto');
const Dictionary = require('../js/dictionary');
const writeInt = require('write-int');

module.exports = class Linad{
	static createResponse_(lang, matching_keyword)
	{
		let response = {};
		response.lang = lang;				//! キーワードの言語
		response.matching_keyword = matching_keyword;	//! 検索キーワード
		response.match_items = [];		//! esperanto/日本語検索 マッチ項目
		response.glosses = [];			//! 日本語検索失敗時 もしかして日本語単語
		response.candidate_items = [];		//! esperanto検索失敗時 もしかして項目

		return response;
	}

	static getResponseFromJkeyword_(dictionary_handle, keyword)
	{
		let response = Linad.createResponse_("ja", keyword);

		// is not esperanto keyword (japanese)
		const indexes = Dictionary.get_indexes_from_jkeyword(dictionary_handle, keyword);
		if(0 == indexes.length){
			if(1 < keyword.length){
				let glosses = Dictionary.get_glosses_info_from_jkeyword(dictionary_handle, keyword);
				if(0 < glosses.length){
					response.glosses = glosses;
				}
			}
		}else{
			for(let i = 0; i < indexes.length; i++){
				const item = Dictionary.get_item_from_index(dictionary_handle, indexes[i]);
				response.match_items.push(item);
			}
		}

		return response;
	}

	static getResponseFromIntString_(keyword)
	{
		const regInt = new RegExp('^-?[0-9]+$');
		if(! regInt.test(keyword)){
			return null;
		}
		const writen_number = writeInt(parseInt(keyword, 10), {'lang': Language.get_code()});
		if(! writen_number){
			return null;
		}

		let response = Linad.createResponse_("ja", keyword);
		const item = [writen_number, keyword, keyword];
		response.match_items.push(item);

		return response;
	}

	static getKw_(dictionary_handle, words, head, c_word)
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

	/** @brief スペル修正候補を返す */
	static getCandidateWordFromKeyword_(dictionary_handle, keyword)
	{
		const candidates = Esperanto.get_candidates(keyword);
		for(const candidate of candidates){
			let index = Dictionary.get_index_from_incremental_keyword(dictionary_handle, candidate);
			let item = Dictionary.get_item_from_index(dictionary_handle, index);
			if(item){
				return item;
			}
		}

		return null;
	}

	/** @brief カタカナとそれ以外で分割する */
	static katakanaSplitter_(src_words)
	{
		let words = [];
		for(let i = 0; i < src_words.length; i++){
			const KATAKANA_CHARS = 'ァ-ヴー';
			const regKatakana = new RegExp('([' + KATAKANA_CHARS + ']+|[^' + KATAKANA_CHARS + ']+)', 'g');
			const ds = src_words[i].match(regKatakana);
			words = words.concat(ds);
		}

		words = words.filter((word, index, array) => {
			return ('string' === typeof word) && (word != '');
		});	// 空word(and null)を除去

		return words;
	}

	static splitter_(dictionary_handle, keystring)
	{
		let words = Esperanto.splitter(keystring); // keystringをword毎に分割
		words = Linad.katakanaSplitter_(words);

		return words;
	}

	static getResponsesFromKeystring(dictionary_handle, keystring)
	{
		let responses = [];

		const words = Linad.splitter_(dictionary_handle, keystring);

		let head = 0;
		while(head < words.length){
			let response;

			// 検索
			// 数値を文字列表現に変換
			response = Linad.getResponseFromIntString_(words[head]);
			if(response){
				// match number.
				head++;
			}else if(! Esperanto.is_esperanto_string(words[head])){
				// 日本語検索
				response = Linad.getResponseFromJkeyword_(dictionary_handle, words[head]);
				head++;
			}else{
				response = Linad.createResponse_(Language.get_code(), "");
				// エスペラント検索
				// 先頭3文字分から単語検索
				let c_word;
				let kw;
				let item = null;
				for(c_word = 3; 0 < c_word; c_word--){
					kw = Linad.getKw_(dictionary_handle, words, head, c_word);
					if(! Esperanto.is_esperanto_string(kw)){
						continue;
					}
					item = Dictionary.get_item_from_keyword(dictionary_handle, kw);
					if(item){
						break;
					}
				}
				head += (0 != c_word)? c_word : 1;
				response.matching_keyword = kw;

				if(! item){
					// スペル修正候補を探索
					let candidate_item = Linad.getCandidateWordFromKeyword_(dictionary_handle, kw);
					if(null != candidate_item){
						response.candidate_items.push(candidate_item);
					}
				}else{
					response.match_items.push(item);
				}
			}

			responses.push(response);
		}

		return responses;
	}
};

