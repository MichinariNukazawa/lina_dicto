'use strict';

module.exports = class Esperanto{

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

	/** @brief 雑多な文字列(x-sistemo, alfabeto, ..etc)を^-sistemoに変換する */
	static caret_sistemo_from_str(str)
	{
		str = str.replace(/\//g, ""); // 語根分割を除去 (ex. "est/i" -> "esti")
		str = str.replace(/~/g, "^");
		str = Esperanto.convert_caret_from_x_sistemo(str);
		str = Esperanto.convert_caret_from_alfabeto_sistemo(str);

		return str;
	}

	/** @brief 動詞語尾変換候補一覧があれば返す */
	static get_verbo_candidates(str)
	{
		// `不定形動詞(-i), 名詞(-o)の優先順とした。(estas -> esti)
		const finajxoj = [
			"i",
			"o",
			"as",
			"is",
			"os",
			"us",
			"u"
		];

		let radikalo = null;
		for(const finajxo of finajxoj){
			if(str.endsWith(finajxo)){
				radikalo = str.slice(0, -1 * finajxo.length);
				break;
			}
		}

		if(null === radikalo){
			return [];
		}

		let candidates = [];
		for(const finajxo of finajxoj){
			const cant = radikalo + finajxo;
			if(cant === str){
				continue;
			}
			candidates.push(cant);
		}
		candidates.push(radikalo);

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

	static castle_char_pairs_mask_(src, mask)
	{
		let dst = '';
		let i_char = 0;
		let change = 0;
		while(i_char < src.length){
			const b = mask & (0x1 << i_char);
			let pair = null;
			if(0 != b){
				pair = Esperanto.castle_char_pairs_inline_(src, i_char);
			}

			if(null != pair){
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

	static get_count_bit_(mask)
	{
		let count = 0;
		for(let i = 1; i < mask; i = i << 1){
			if(0 != (mask & i)){
				count++;
			}
		}

		return count;
	}


	static get_candidates_of_castle_char_pairs_(str)
	{
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
			if(3 < Esperanto.get_count_bit_(mask)){
				continue;
			}
			const dst = Esperanto.castle_char_pairs_mask_(str, mask);
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

		candidates = Esperanto.get_verbo_candidates(str);

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

		const cands = Esperanto.get_candidates_of_castle_char_pairs_(str);
		candidates = candidates.concat(cands);

		candidates = candidates.filter(function(e){return e !== "";});	// 空文字を除去
		candidates = candidates.filter((cand, index, array) => {
			return array.indexOf(cand) === index;
		});	// 重複を除去
		return candidates;
	}

	static get_esperant_regex_character()
	{
		return '\\x20-\\x7E\\u0108-\\u016D\\s^~';
	}

	/** @brief 文字列がesperantoかどうか(大まかには[\w\s^~]で構成されているか)を返す */
	static is_esperanto_string(str)
	{
		return /^[\x20-\x7E\u0108-\u016D\s^~]+$/.test(str);
	}

	/** @brief 単語分割 word splitter(tokenizer)
	@details
	This is rule base word splitter. not dictionary base tokenizer.
	トークナイザとしてはシンプルめだが空白分割からすれば高度なことをしている。

	## 基本的には空白と記号で分割する。
		1. https://github.com/maroun-baydoun/new-hope/blob/master/src/splitter.ts
	'-'は(lina_dictoが使用する辞書において)単語の一部に扱われているため、分割記号に含めない。
		Praktika Esperanto-Japana Vortareto.  Ver.1.81 (provizora 2a eldono)
		https://www.vastalto.com/jpn/
		ex. "Abu-Dabi/o"
	## 日本語による数値表現(Arabic numerals)は単語扱いする。(ex. "1,234,567.89")
		2. https://qiita.com/yugui/items/55f2529c5a731badeff7
	## 入力文字列は(^-sistemo x-sistemo alfabeto)に対応する。(^(caret)を記号扱いしない等)
	## 大文字始まりで小文字に続く大文字([a-z][A-Z])も分割扱いする(ex. SukeraSparo)(LKK, kHzは切らない)

	(末尾に限らない)句読点、感嘆符は失われる。
	*/
	static splitter(keystring)
	{
		keystring = keystring.replace(/\s+/, " ");
		const space_splits = keystring.split(/\s/);

		let words = [];
		for(let i = 0; i < space_splits.length; i++){
			// 数値
			const JAPANESE_EXTRA_NUMBER = '-?[0-9]([0-9,]*)?(\.[0-9]+)?';
			const regNumber = new RegExp('^' + JAPANESE_EXTRA_NUMBER + '$');
			if(regNumber.test(space_splits[i])){
				words.push(space_splits[i]);
				continue;
			}

			// 記号で分割する(記号の除去を兼ねる)
			const symbol_splits = space_splits[i].split(/[.,;:?!()|]/);

			// エスペラント文字列とそれ以外で分割する
			let eo_splits = [];
			for(let i = 0; i < symbol_splits.length; i++){
				const ESPERANTO_SPECIAL_CHARS = "\u0108\u0109\u011C\u011D\u0124\u0125\u0134\u0135\u015C\u015D\u016C\u016D\u016C\u016D";
				const ESPERANTO_CHARS = 'A-Za-z' + ESPERANTO_SPECIAL_CHARS +'^~\/-';
				const regEsperantoStrOrOther = new RegExp('([' + ESPERANTO_CHARS + ']+)|([^' + ESPERANTO_CHARS + ']+)', 'g');

				const in_eo_splits = symbol_splits[i].match(regEsperantoStrOrOther);
				// console.log("###eo", symbol_splits[i], in_eo_splits);
				eo_splits = eo_splits.concat(in_eo_splits);
			}

			// 大文字始まりで小文字に続く大文字で分割する
			for(let i = 0; i < eo_splits.length; i++){
				const UPPER_ESPERANTO_SPECIAL_CHARS = "\u0108\u011C\u0124\u0134\u015C\u016C";
				const UPPER_ESPERANTO_CHARS = 'A-Z' + UPPER_ESPERANTO_SPECIAL_CHARS;
				const regUpperLowerTop = new RegExp('^[' + UPPER_ESPERANTO_CHARS + '][^' + UPPER_ESPERANTO_CHARS + ']');
				if(regUpperLowerTop.test(eo_splits[i])){
					const regUpperLowerMatch = new RegExp('[' + UPPER_ESPERANTO_CHARS + '][^' + UPPER_ESPERANTO_CHARS + ']+', 'g');
					const ws = eo_splits[i].match(regUpperLowerMatch);
					words = words.concat(ws);
					// console.log("###Up", eo_splits[i], ws, words);
					continue;
				}
				words.push(eo_splits[i]);
			}
		}

		words = words.filter((word, index, array) => {
			return ('string' === typeof word) && (word != '');
		});	// 空word(and null)を除去

		return words;
	}
};

