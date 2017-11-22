'use strict';

/*export default*/ class Linad{

	get_reponse_from_jkeyword(response, keyword)
	{
		response.matching_keyword = keyword;

		// is not esperanto keyword (japanese)
		const indexes = dictionary.get_indexes_from_jkeyword(keyword);
		if(0 == indexes.length){
			if(1 < keyword.length){
				let glosses = dictionary.get_glosses_info_from_jkeyword(keyword);
				if(0 < glosses.length){
					let candidate_words = glosses.join(",");
					response.sub_text += "if your search to `" + candidate_words + "`?";
				}
			}
		}else{
			let root_words = [];
			let explanations = [];
			for(let i = 0; i < indexes.length; i++){
				const item = dictionary.get_item_from_index(indexes[i]);
				root_words.push(dictionary.get_root_word_from_item(item));

				explanations.push(dictionary.get_explanation_from_item(item));
			}

			response.match_results = root_words;
			response.sub_text = explanations.join(', ');
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
			response.matching_keyword = "";
			response.match_results = [];
			response.sub_text = "`" + words[head] + "` is not match.";

			// 検索
			if(! esperanto.is_esperanto_string(words[head])){
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
					response.sub_text = "`" + kw + "` is not match.";
					// スペル修正候補を探索
					let candidate_item = get_candidate_word_from_keyword(kw);
					if(candidate_item){
						let candidate_word = dictionary.get_root_word_from_item(candidate_item);
						response.sub_text += "if your search to `" + candidate_word + "`?";
					}
				}else{
					let explanation = dictionary.get_explanation_from_item(item);
					let root_word = dictionary.get_root_word_from_item(item);
					response.sub_text = "`" + root_word + "`:" + explanation + "";
					const glosses = dictionary.get_glosses_from_item(item);
					response.match_results = glosses;
				}
			}

			response.sub_text = esperanto.convert_alfabeto_from_caret_sistemo(response.sub_text);
			responses.push(response);
		}

		return responses;
	}

};

