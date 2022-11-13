'use strict';
/**
http://sukerasparo.com/sp004/font.html
lina_dictoでは割り当てをJuriamoAssignと仮名しています。
*/

module.exports = class Juriamo{

	//static is_juriamo_assign(str){
	//	return str.test(/]/);
	//}

	static get_juriamo_chars(){
		const juriamo_chars = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ" // A-Z
			+ "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ" // a-z
			+ "㍍㌔㌃㌍㌫㌦㌢㌘㌶㌻㍗㌧㍉㍑㍊"; // c^g^h^j^s^u^C^G^H^J^S^U^!?￥
		return juriamo_chars ;
	}

	static get_alfabeto_chars(){
		const alfabeto_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			+ "abcdefghijklmnopqrstuvwxyz"
			+ "ĉĝĥĵŝŭĈĜĤĴŜŬ!?￥"
		return alfabeto_chars;
	}

	static convert_alfabeto_from_juriamo_assign(str){
		const juriamo_chars = Juriamo.get_juriamo_chars();
		const alfabeto_chars = Juriamo.get_alfabeto_chars();

		let dst = "";
		for(const sc of str){
			const ix = juriamo_chars.indexOf(sc);
			if(-1 != ix){
				dst += alfabeto_chars[ix];
			}else{
				dst += sc;
			}
		}
		return dst;
	}

	static convert_juriamo_assign_from_alfabeto(str){
		const juriamo_chars = Juriamo.get_juriamo_chars();
		const alfabeto_chars = Juriamo.get_alfabeto_chars();
		
		let dst = "";
		for(const sc of str){
			const ix = alfabeto_chars.indexOf(sc);
			if(-1 != ix){
				dst += juriamo_chars[ix];
			}else{
				dst += sc;
			}
		}
		return dst;
	}

	static convert_juriamo_assign(str){
		const juriamo_chars = Juriamo.get_juriamo_chars() + " " + "　";

		let dst = "";
		for(const sc of str){
			const ix = juriamo_chars.indexOf(sc);
			if(-1 != ix){
				dst += sc;
			}else if(/[->!?+,.、。！？]/.test(sc)){
				dst += sc;
			}
		}
		return dst;
	}
}

