'use strict';


/** @brief x-systemo */
function esperanto_convert_caret_from_x_sistemo(str){
	var replaces = [
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

function esperanto_convert_diacritical_mark(str) {
	str = str.replace(/C\^/g,"\u0108");
	str = str.replace(/c\^/g,"\u0109");
	str = str.replace(/G\^/g,"\u011C");
	str = str.replace(/g\^/g,"\u011D");
	str = str.replace(/H\^/g,"\u0124");
	str = str.replace(/h\^/g,"\u0125");
	str = str.replace(/J\^/g,"\u0134");
	str = str.replace(/j\^/g,"\u0135");
	str = str.replace(/S\^/g,"\u015C");
	str = str.replace(/s\^/g,"\u015D");
	str = str.replace(/U\^/g,"\u016C"); // 公式の変換には無いがとりあえず
	str = str.replace(/u\^/g,"\u016D"); // 公式の変換には無いがとりあえず
	str = str.replace(/U\~/g,"\u016C");
	str = str.replace(/u\~/g,"\u016D");

	return str;
}

/** @brief スペル修正候補一覧を返す */
function esperanto_get_candidates(str){
	var candidates = [];

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

