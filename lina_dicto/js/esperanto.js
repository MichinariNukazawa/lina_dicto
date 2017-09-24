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

