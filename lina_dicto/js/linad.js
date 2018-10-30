'use strict';

const Language = require('../js/language');
const Esperanto = require('../js/esperanto');
const Dictionary = require('../js/dictionary');

const writeInt = require('write-int');
const path = require('path');
const Kuromoji = require("kuromoji");
let japaneseTokenizer_;

module.exports = class Linad{
	static initialize(callback)
	{
		if(japaneseTokenizer_){
			console.error("BUG already init");
			return;
		}

		Kuromoji.builder({
			//dicPath: path.join(__dirname, 'node_modules/kuromoji/dict')
			dicPath: 'node_modules/kuromoji/dict'
		}).build(function (err, tokenizer) {
			japaneseTokenizer_ = tokenizer;
			callback();
		});
	}

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

	static getResponseSearchJKeywordFullMatch_(dictionary_handle, joinedKeywordObj)
	{
		const keyword = joinedKeywordObj.word;
		let response = Linad.createResponse_("ja", keyword);

		// 一致検索
		const indexes = Dictionary.get_indexes_from_jkeyword(dictionary_handle, keyword);
		if(0 != indexes.length){
			for(let i = 0; i < indexes.length; i++){
				const item = Dictionary.get_item_from_index(dictionary_handle, indexes[i]);
				response.match_items.push(item);
			}

			return response;
		}

		return null;
	}

	static getResponseSearchJKeywordNearMatch_(dictionary_handle, joinedKeywordObj)
	{
		const keyword = joinedKeywordObj.word;
		let response = Linad.createResponse_("ja", keyword);

		// 先頭一文字ひらがなのみの場合、単語でないと思われるので候補推定の検索をかけない
		const reIsHiragana = new RegExp('^[\u3041-\u3096]$');
		const firstWord = joinedKeywordObj.words[0];
		if(1 === firstWord.length && reIsHiragana.test(firstWord)){
			return null;
		}

		// 候補推定を探索
		{
			let glosses = Dictionary.get_glosses_info_from_jkeyword(dictionary_handle, keyword);
			if(0 < glosses.length){
				response.glosses = glosses;
				return response;
			}
		}

		return null;
	}

	static getResponseSearchKeywordFullMatch_(dictionary_handle, keyword)
	{
		let response = Linad.createResponse_(Language.get_code(), keyword);

		// 一致検索
		const item = Dictionary.get_item_from_keyword(dictionary_handle, keyword);
		if(item){
			response.match_items.push(item);
			return response;
		}

		return null;
	}

	static getResponseSearchKeywordNearMatch_(dictionary_handle, keyword)
	{
		let response = Linad.createResponse_(Language.get_code(), keyword);

		// 「もしかして」機能のスペル修正候補を探索
		let candidate_item = Linad.getCandidateWordFromKeyword_(dictionary_handle, keyword);
		if(candidate_item){
			response.candidate_items.push(candidate_item);
			return response;
		}

		// マッチしなかった
		return null;
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

	static joinKeyword_(dictionary_handle, words, head, countJoinWord)
	{
		if(words.length < (head + countJoinWord)){
			return null;
		}

		let joinedKeywordObj = {
			'lang': (Esperanto.is_esperanto_string(words[head]) ? Language.get_code() : 'ja'),
			'word': '',
			'words': [],
		};

		let ws = [];
		for(let i = 0; i < countJoinWord; i++){
			const word = words[head + i];
			const lang = (Esperanto.is_esperanto_string(word) ? Language.get_code() : 'ja');
			if(joinedKeywordObj.lang !== lang){
				// 日エス混じりになる場合は無効を返す
				return null;
			}
			ws.push(word);
		}

		let kw = "";
		if('ja' === joinedKeywordObj.lang){
			kw = ws.join("");
		}else{
			kw = ws.join(" ");
		}
		joinedKeywordObj.word = kw;
		joinedKeywordObj.words = ws;

		return joinedKeywordObj;
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

	/** @brief 日本語wordを単語分割する
	 @notice 日本語単語分割に用いているkuromoziは外部依存モジュールであるためできるだけテストを分離する
	 */
	static japaneseSplitter_(src_words)
	{
		const src1_words = src_words;

		const reIsJapanese = new RegExp('^[^\x01-\x7E]+$');
		let dwords = [];
		for(let i = 0; i < src1_words.length; i++){
			const word = src1_words[i];
			//console.log('##jws word', word);
			if(reIsJapanese.test(word)){
				const ws = japaneseTokenizer_.tokenize(word);
				let ws_ = [];
				for(let t = 0; t < ws.length; t++){
					ws_.push(ws[t].surface_form);
				}
				dwords = dwords.concat(ws_);
			}else{
				dwords.push(word);
			}
		}

		let words = dwords;
		words = words.filter((word, index, array) => {
			return ('string' === typeof word) && (word != '');
		});	// 空word(and null)を除去

		//console.log('##jws', words);

		return words;
	}

	static splitter_(dictionary_handle, keystring)
	{
		let words = Esperanto.splitter(keystring); // keystringをword毎に分割
		words = Linad.japaneseSplitter_(words);

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
				responses.push(response);
				continue;
			}

			{
				const JOIN_KEYWORD_NUM = 3;
				// 一致検索
				let joinedKeywordObj;
				for(let countJoinWord = JOIN_KEYWORD_NUM; 0 < countJoinWord; countJoinWord--){
					joinedKeywordObj = Linad.joinKeyword_(dictionary_handle, words, head, countJoinWord);
					if(! joinedKeywordObj){ // 日エス混じりで検索キーワードにならなかった
						continue;
					}

					if('ja' === joinedKeywordObj.lang){
						response = Linad.getResponseSearchJKeywordFullMatch_(dictionary_handle, joinedKeywordObj);
					}else{
						response = Linad.getResponseSearchKeywordFullMatch_(dictionary_handle, joinedKeywordObj.word);
					}

					if(response){
						// マッチした
						head += countJoinWord;
						break;
					}
				}
			}

			if(! response){
				const JOIN_KEYWORD_NUM = 2;
				// 候補推定
				let joinedKeywordObj;
				for(let countJoinWord = JOIN_KEYWORD_NUM; 0 < countJoinWord; countJoinWord--){
					joinedKeywordObj = Linad.joinKeyword_(dictionary_handle, words, head, countJoinWord);
					if(! joinedKeywordObj){ // 日エス混じりで検索キーワードにならなかった
						continue;
					}

					if('ja' === joinedKeywordObj.lang){
						response = Linad.getResponseSearchJKeywordNearMatch_(dictionary_handle, joinedKeywordObj);
					}else{
						response = Linad.getResponseSearchKeywordNearMatch_(dictionary_handle, joinedKeywordObj.word);
					}

					if(response){
						// マッチした
						head += countJoinWord;
						break;
					}
				}
			}

			if(! response){
				// 最後までマッチしなかった
				response = Linad.createResponse_(Language.get_code(), words[head]);
				head++;
			}

			responses.push(response);
		}

		return responses;
	}
};

