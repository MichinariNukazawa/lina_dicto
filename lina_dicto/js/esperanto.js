'use strict';


/** @brief x-systemo */
function esperanto_convert_caret_from_x_sistemo(str)
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

function seperanto_convert_alfabeto_from_caret_sistemo(str)
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

function seperanto_convert_caret_from_alfabeto_sistemo(str)
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
function esperanto_caret_sistemo_from_str(str)
{
	str = esperanto_convert_caret_from_x_sistemo(str);
	str = seperanto_convert_caret_from_alfabeto_sistemo(str);

	return str;
}

/** @brief スペル修正候補一覧を返す */
function esperanto_get_candidates(str)
{
	let candidates = [];

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

	//! 1文字削除
	// for(let i = 0; i < str.length; i++){
	for(let i = str.length - 1; 0 <= i; i--){
		let cand = str.substr(0, i) + str.substr(i + 1, str.length - 1);
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

	candidates = candidates.filter(function(e){return e !== "";});	// 空文字を除去
	return candidates;
}

/** @brief 文字列がesperantoかどうか(大まかには[\w\s^]で構成されているか)を返す */
function esperanto_is_esperanto_string(str)
{
	return /^[\x20-\x7E\u0108-\u016D\s^]+$/.test(str);
}

