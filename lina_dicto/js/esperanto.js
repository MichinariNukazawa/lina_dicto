'use strict';


/*export default*/ class Esperanto{

	/** @brief x-systemo */
	static convert_caret_from_x_sistemo(str)
	{
		const replaces = [
			[/Cx(?!x)/g, "C^"],
			[/cx(?!x)/g, "c^"],
			[/Gx(?!x)/g, "G^"],
			[/gx(?!x)/g, "g^"],
			[/Hx(?!x)/g, "H^"],
			[/hx(?!x)/g, "h^"],
			[/Jx(?!x)/g, "J^"],
			[/jx(?!x)/g, "j^"],
			[/Sx(?!x)/g, "S^"],
			[/sx(?!x)/g, "s^"],
			[/Ux(?!x)/g, "U^"],
			[/ux(?!x)/g, "u^"],
			[/Vx(?!x)/g, "U^"],
			[/vx(?!x)/g, "u^"],
		];

			for(const replace of replaces){
				str = str.replace(replace[0], replace[1]);
			}

			str = str.replace(/xx$/, "x");

			return str;
	}

	static convert_alfabeto_from_caret_sistemo(str)
	{
		const replaces = [
			[/C\^/g, "\u0108"],
			[/c\^/g, "\u0109"],
			[/G\^/g, "\u011C"],
			[/g\^/g, "\u011D"],
			[/H\^/g, "\u0124"],
			[/h\^/g, "\u0125"],
			[/J\^/g, "\u0134"],
			[/j\^/g, "\u0135"],
			[/S\^/g, "\u015C"],
			[/s\^/g, "\u015D"],
			[/U\^/g, "\u016C"],	// 公式の変換には無いがとりあえず
			[/u\^/g, "\u016D"],	// 公式の変換には無いがとりあえず
			[/U\~/g, "\u016C"],
			[/u\~/g, "\u016D"],
		];

			for(const replace of replaces){
				str = str.replace(replace[0], replace[1]);
			}

			return str;
	}

	static convert_caret_from_alfabeto_sistemo(str)
	{
		const replaces = [
			[/\u0108/g, "C^"],
			[/\u0109/g, "c^"],
			[/\u011C/g, "G^"],
			[/\u011D/g, "g^"],
			[/\u0124/g, "H^"],
			[/\u0125/g, "h^"],
			[/\u0134/g, "J^"],
			[/\u0135/g, "j^"],
			[/\u015C/g, "S^"],
			[/\u015D/g, "s^"],
			[/\u016C/g, "U^"],	// 公式の変換には無いがとりあえず
			[/\u016D/g, "u^"],	// 公式の変換には無いがとりあえず
		];

			for(const replace of replaces){
				str = str.replace(replace[0], replace[1]);
			}

			return str;
	}

	/** @brief 雑多な文字列(x-sistemo, alfabeto)を^-sistemoに変換する */
	static caret_sistemo_from_str(str)
	{
		str = str.replace(/\//g, ""); // 語根区切りを除去 (ex. "est/i" -> "esti")
		str = str.replace(/~/g, "^");
		str = this.convert_caret_from_x_sistemo(str);
		str = this.convert_caret_from_alfabeto_sistemo(str);

		return str;
	}

	/** @brief 動詞語尾変換候補一覧があれば返す */
	static get_verbo_candidates(str)
	{
		let candidates = [];

		let radico = null;
		if(/.+i$/.test(str)){
			radico = str.slice(0, -1);
		}else if(/.+as$/.test(str)){
			radico = str.slice(0, -2);
		}else if(/.+is$/.test(str)){
			radico = str.slice(0, -2);
		}else if(/.+os$/.test(str)){
			radico = str.slice(0, -2);
		}else if(/.+us$/.test(str)){
			radico = str.slice(0, -2);
		}else if(/.+u$/.test(str)){
			radico = str.slice(0, -1);
		}

		if(null === radico){
			return [];
		}

		let list = [
			"i",
			"as",
			"is",
			"os",
			"us",
			"u",
			""
		];
		for(let i = 0; i < list.length; i++){
			let cant = radico + list[i];
			if(cant === str){
				continue;
			}
			candidates.push(cant);
		}

		return candidates;
	}

	static castle_char_pairs_inline_(str, index)
	{
		const char_pairs = [
			['l', 'r'],	// ex. melanchory
			['k', 'c'],	// ex. disk/disc
			['i', 'y'],	// ex. lyric
			['s', 'th'],	// ex. tooth
			['v', 'b'],	// ex. void
			['t', 'c'],
			['s', 'j'],
		];

		for(let i = 0; i < char_pairs.length; i++){
			if(index === str.indexOf(char_pairs[i][0], index)){
				return char_pairs[i];
			}else if(index === str.indexOf(char_pairs[i][1], index)){
				return [char_pairs[i][1], char_pairs[i][0]];
			}
		}

		return null;
	}

	/**
	  @param max 交換する文字の最大数
	*/
	static castle_char_pairs_mask(src, mask, max)
	{
		let dst = '';
		let i_char = 0;
		let change = 0;
		while(i_char < src.length){
			const b = mask & (0x1 << i_char);
			let pair = null;
			if(0 != b){
				pair = this.castle_char_pairs_inline_(src, i_char);
			}

			if(change < max && null != pair){
				change++;
				dst += pair[1];
				i_char += pair[0].length;
			}else{
				dst += src[i_char];
				i_char++;
			}
		}

		return dst;
	}

	static get_candidates_of_castle_char_pairs(str){
		//! 2文字以上の変換を含む文字の交換castle
		//! 音の近い文字の交換
		// 字形の近い文字の交換も必要？

		let cands = [];
		//! 先頭から16文字までを交換対象とする
		const n_char = (16 < str.length)? 16 : str.length;
		const n_mask = 0x1 << n_char;
		for(let i = 1; i < n_mask; i++){
			const mask = i;
			//! 最大3文字まで交換する
			const dst = this.castle_char_pairs_mask(str, mask, 3);
			if(dst != str){
				cands.push(dst);
			}
		}

		cands = cands.filter((cand, index, array) => {
			return array.indexOf(cand) === index;
		});	// 重複を除去

		return cands;
	}

	/** @brief スペル修正候補一覧を返す */
	static get_candidates(str)
	{
		let candidates = [];

		candidates = this.get_verbo_candidates(str);

		//! esperantoであまり使わないqwxyと、挿入可能位置に条件のある代用表記を除く
		const alphabets = 'abcdefghijklmnoprstuvz';

		//! 代用表記を投入 // 代用表記が有効な文字かつ後ろに代用表記文字が付与されていない場合
		// for(let i = 0; i < str.length; i++){
		for(let i = str.length - 1; 0 <= i; i--){
			if(! /^[CcGgHhJjSsUu]$/.test(str.charAt(i))){
				continue;
			}
			if('^' == str.charAt(i + 1)){
				continue;
			}
			let cand = str.substr(0, i + 1) + '^' + str.substr(i + 1, str.length - 1);
			candidates.push(cand);
		}

		//! 1文字入れ替え
		// for(let i = 0; i < str.length - 1; i++){
		for(let i = str.length - 2; 0 <= i; i--){
			let c0 = str.charAt(i + 0);
			let c1 = str.charAt(i + 1);
			let cand = str.substr(0, i)
				+ c1 + c0
				+ str.substr(i + 2, str.length - 1);
			candidates.push(cand);
		}

		//! 1文字削除
		// for(let i = 0; i < str.length; i++){
		for(let i = str.length - 1; 0 <= i; i--){
			let cand = str.substr(0, i) + str.substr(i + 1, str.length - 1);
			candidates.push(cand);
		}

		//! 1文字置換
		// for(let i = 0; i < str.length; i++){
		for(let i = str.length - 1; 0 <= i; i--){
			for(let t = 0; t < alphabets.length; t++){
				let cand = str.substr(0, i) + alphabets[t]
					+ str.substr(i + 1, str.length - 1);
				candidates.push(cand);
			}
		}

		//! 1文字挿入
		// for(let i = 0; i < str.length; i++){
		for(let i = str.length - 0; 0 <= i; i--){
			for(let t = 0; t < alphabets.length; t++){
				let cand = str.substr(0, i) + alphabets[t]
					+ str.substr(i + 0, str.length);
				candidates.push(cand);
			}
		}

		const cands = this.get_candidates_of_castle_char_pairs(str);
		candidates = candidates.concat(cands);

		candidates = candidates.filter(function(e){return e !== "";});	// 空文字を除去
		candidates = candidates.filter((cand, index, array) => {
			return array.indexOf(cand) === index;
		});	// 重複を除去
		return candidates;
	}

	/** @brief 文字列がesperantoかどうか(大まかには[\w\s^~]で構成されているか)を返す */
	static is_esperanto_string(str)
	{
		return /^[\x20-\x7E\u0108-\u016D\s^~]+$/.test(str);
	}

	};

