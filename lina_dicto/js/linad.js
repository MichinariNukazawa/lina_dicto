'use strict';

/*export default*/ class Linad{

	get_reponse_from_jkeyword(response, keyword)
	{
		response.lang = "ja";
		response.matching_keyword = keyword;

		// is not esperanto keyword (japanese)
		const indexes = dictionary.get_indexes_from_jkeyword(keyword);
		if(0 == indexes.length){
			if(1 < keyword.length){
				let glosses = dictionary.get_glosses_info_from_jkeyword(keyword);
				if(0 < glosses.length){
					response.glosses = glosses;
				}
			}
		}else{
			for(let i = 0; i < indexes.length; i++){
				const item = dictionary.get_item_from_index(indexes[i]);
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

	get_responses_from_keyword(keyword)
	{
		let responses = [];

		// 先頭の空白を取り除く
		keyword = keyword.replace(/^[\s　]*/g, "");
		// keywordをword毎に分割
		const words = keyword.split(/\s/);

		let head = 0;
		while(head < words.length){
			let response = {};
			response.lang = "esp";			//! キーワードの言語
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
					item = dictionary.get_item_from_keyword(kw);
					if(item){
						break;
					}
				}
				head += (0 != c_word)? c_word : 1;
				response.matching_keyword = kw;

				if(! item){
					// スペル修正候補を探索
					let candidate_item = get_candidate_word_from_keyword(kw);
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

