'use strict';

/*export default*/ class Linad{

	get_reponse_from_jkeyword(response, keyword)
	{
		response.lang = "ja";
		response.matching_keyword = keyword;

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

	get_kw(words, head, c_word)
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
	get_candidate_word_from_keyword(keyword)
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

	get_responses_from_keyword(keystring)
	{
		let responses = [];

		let words = Esperanto.splitter(keystring); // keystringをword毎に分割

		let head = 0;
		while(head < words.length){
			let response = {};
			response.lang = Language.get_code();	//! キーワードの言語
			response.matching_keyword = "";		//! 検索キーワード
			response.match_items = [];		//! esperanto/日本語検索 マッチ項目
			response.glosses = [];			//! 日本語検索失敗時 もしかして日本語単語
			response.candidate_items = [];		//! esperanto検索失敗時 もしかして項目

			// 検索
			if(! Esperanto.is_esperanto_string(words[head])){
				// 日本語検索
				response = this.get_reponse_from_jkeyword(response, words[head]);
				head++;
			}else{
				// エスペラント検索
				// 先頭3文字分から単語検索
				let c_word;
				let kw;
				let item = null;
				for(c_word = 3; 0 < c_word; c_word--){
					kw = this.get_kw(words, head, c_word);
					// 代用表記以外の末尾の記号を取り除く(word間の記号は除かない)
					kw = kw.replace(/[^A-Za-z^~]$/g, "");
					item = Dictionary.get_item_from_keyword(dictionary_handle, kw);
					if(item){
						break;
					}
				}
				head += (0 != c_word)? c_word : 1;
				response.matching_keyword = kw;

				if(! item){
					// スペル修正候補を探索
					let candidate_item = this.get_candidate_word_from_keyword(kw);
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

