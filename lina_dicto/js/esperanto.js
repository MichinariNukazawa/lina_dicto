'use strict';

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

