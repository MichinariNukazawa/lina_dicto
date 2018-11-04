'use strict';

/**
by http://www.mikage.to/esperanto/

Copyright 2017 Mikage Sawatari

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

module.exports = class EsperantoJa{
	static convertJaSoundFromEsperanto(eoWord, nostrictSimbol)
	{
		let res = {
			'jsound':	'',
			'isStrict':	true, // strict is convert all character
		};

		const words = eoWord.split(/\s/);
		for(let i = 0; i < words.length; i++){
			const r = EsperantoJa.convertJaSoundFromEsperantoWord_(words[i], nostrictSimbol)
			res.jsound += ((0 == i)?'': '　') + r.jsound;
			res.isStrict = (res.isStrict && r.isStrict);
		}

		return res;
	}

	static convertJaSoundFromEsperantoWord_(eoWord, nostrictSimbol)
	{
		let res = {
			'jsound':	'',
			'isStrict':	true, // strict is convert all character
		};

		let word = eoWord.toLowerCase();

		let sound = [];
		const SOUND_TABLE = EsperantoJa.getSoundTable_();
		while(0 < word.length){
			let match = false;
			for(let i = 0; i < SOUND_TABLE.length; i++){
				// console.log('@', i, SOUND_TABLE[i][0], word);
				if(word.startsWith(SOUND_TABLE[i][0])){
					sound.push([SOUND_TABLE[i][0], SOUND_TABLE[i][1]]);
					word = word.substr(SOUND_TABLE[i][0].length);
					match = true;
					break;
				}
			}
			if(match){
				continue;
			}

			// マッチしなかった
			res.isStrict = false;
			sound.push([word[0], nostrictSimbol]);
			word = word.substr(1);
		}

		var vowel = 0;
		var last_vowel = false;
		for(var i = sound.length - 1; i >= 0; i--) {
			if(sound[i][0].length == 0) {
				continue;
			}
			var is_vowel = false;
			if(sound[i][0].match(/[aeiou]/)) {
				is_vowel = true;
				vowel++;
			}
			if(vowel == 2) {
				if(last_vowel) {
					// ŭ は手前の母音にくっつくので、母音の次が ŭ なら伸ばさない
					if(!sound[i+1][0].match(/^ŭ/)) {
						sound[i][1] += 'ー';
					}
				}
				//sound[i][1] = '<strong>' + sound[i][1] + '</strong>';
				break;
			}
			last_vowel = is_vowel;
		}

		sound.forEach(function(s) {
			res.jsound += s[1];
		});

		return res;
	}

	static convertEsperantoFromJaSound(jaWord, nostrictSimbol)
	{
		let res = {
			'eoWord':	'',
			'isStrict':	true, // strict is convert all character
		};

		let word = jaWord.replace(/[^ァ-ヴ　\s]/g, '').replace(/[ー]/g, '');

		let sound = [];
		const SOUND_TABLE = EsperantoJa.getJsoundTable_();
		while(0 < word.length){
			let match = false;
			for(let i = 0; i < SOUND_TABLE.length; i++){
				// console.log('@', i, SOUND_TABLE[i][0], word);
				if(/^\s/.test(word)){
					sound.push([' ', '　']);
					word = word.substr(1);
					continue;
				}

				if(word.startsWith(SOUND_TABLE[i][1])){
					sound.push([SOUND_TABLE[i][0], SOUND_TABLE[i][1]]);
					word = word.substr(SOUND_TABLE[i][1].length);
					match = true;
					break;
				}
				const kanaValue = SOUND_TABLE[i][1].replace(/[^ァ-ヴ]/, '');
				if(0 != kanaValue.length && word.startsWith(kanaValue)){
					sound.push([SOUND_TABLE[i][0], kanaValue]);
					word = word.substr(kanaValue.length);
					match = true;
					break;
				}
			}
			if(match){
				continue;
			}

			//console.log('## nom', word);
			// マッチしなかった
			res.isStrict = false;
			sound.push([nostrictSimbol, word[0]]);
			word = word.substr(1);
		}

		sound.forEach(function(s) {
			res.eoWord += s[0];
		});

		return res;
	}

	static getJsoundTable_()
	{
		const SOUND_TABLE = EsperantoJa.getSoundTable_();
		let items1 = [];
		let items2 = [];
		SOUND_TABLE.forEach((item) =>{
			if(1 < item[1].length){
				items2.push(item);
			}else{
				items1.push(item);
			}
		});

		return items2.concat(items1);
	}

	static getSoundTable_()
	{
		const sound_table = [
			// 読み
			// 子音＋母音
			["ba", "バ"],
			["be", "ベ"],
			["bi", "ビ"],
			["bo", "ボ"],
			["bu", "ブ"],
			["c^a", "チャ"],
			["c^e", "チェ"],
			["c^i", "チ"],
			["c^o", "チョ"],
			["c^u", "チュ"],
			["ca", "ツァ"],
			["ce", "ツェ"],
			["ci", "ツィ"],
			["co", "ツォ"],
			["cu", "ツ"],
			["da", "ダ"],
			["de", "デ"],
			["di", "ディ"],
			["do", "ド"],
			["du", "ドゥ"],
			["fa", "フ▼ァ"],
			["fe", "フ▼ェ"],
			["fi", "フ▼ィ"],
			["fo", "フ▼ォ"],
			["fu", "フ▼"],
			["g^a", "ヂャ"],
			["g^e", "ヂェ"],
			["g^i", "ヂ"],
			["g^o", "ヂョ"],
			["g^u", "ヂュ"],
			["ga", "ガ"],
			["ge", "ゲ"],
			["gi", "ギ"],
			["go", "ゴ"],
			["gu", "グ"],
			["h^a", "ハ＾"],
			["h^e", "ヘ＾"],
			["h^i", "ヒ＾"],
			["h^o", "ホ＾"],
			["h^u", "フ＾"],
			["ha", "ハ"],
			["he", "ヘ"],
			["hi", "ヒ"],
			["ho", "ホ"],
			["hu", "フ"],
			["j^a", "ジャ"],
			["j^e", "ジェ"],
			["j^i", "ジ"],
			["j^o", "ジョ"],
			["j^u", "ジュ"],
			["ja", "ヤ"],
			["je", "ィエ"],
			["ji", "ィイ"],
			["jo", "ヨ"],
			["ju", "ユ"],
			["ka", "カ"],
			["ke", "ケ"],
			["ki", "キ"],
			["ko", "コ"],
			["ku", "ク"],
			["la", "ラ▼"],
			["le", "レ▼"],
			["li", "リ▼"],
			["lo", "ロ▼"],
			["lu", "ル▼"],
			["ma", "マ"],
			["me", "メ"],
			["mi", "ミ"],
			["mo", "モ"],
			["mu", "ム"],
			["na", "ナ"],
			["ne", "ネ"],
			["ni", "ニ"],
			["no", "ノ"],
			["nu", "ヌ"],
			["nja", "ニャ"],
			["nje", "ニェ"],
			["nji", "ニィ"],
			["njo", "ニョ"],
			["nju", "ニュ"],
			["pa", "パ"],
			["pe", "ペ"],
			["pi", "ピ"],
			["po", "ポ"],
			["pu", "プ"],
			["ra", "ラ"],
			["re", "レ"],
			["ri", "リ"],
			["ro", "ロ"],
			["ru", "ル"],
			["s^a", "シャ"],
			["s^e", "シェ"],
			["s^i", "シ"],
			["s^o", "ショ"],
			["s^u", "シュ"],
			["sa", "サ"],
			["se", "セ"],
			["si", "スィ"],
			["so", "ソ"],
			["su", "ス"],
			["ta", "タ"],
			["te", "テ"],
			["ti", "ティ"],
			["to", "ト"],
			["tu", "トゥ"],
			["u^a", "ゥア"],
			["u^e", "ゥエ"],
			["u^i", "ゥイ"],
			["u^o", "ゥオ"],
			["u^u", "ゥウ"],
			["va", "ヴァ"],
			["ve", "ヴェ"],
			["vi", "ヴィ"],
			["vo", "ヴォ"],
			["vu", "ヴ"],
			["za", "ザ"],
			["ze", "ゼ"],
			["zi", "ズィ"],
			["zo", "ゾ"],
			["zu", "ズ"],
			// 子音のみ(下線)
			["b", "ブ_"],
			["c^", "チ_ュ_"],
			["c", "ツ_"],
			["d", "ド_"],
			["f", "フ_"],
			["g^", "ヂ_ュ_"],
			["g", "グ_"],
			["h^", "ホ_＾"],
			["h", "ホ_"],
			["j^", "ジ_"],
			["j", "ィ"], // 下線なし
			["k", "ク_"],
			["l", "ル_▼"],
			["m", "ム_"],
			["n", "ン"],
			["p", "プ_"],
			["r", "ル_"],
			["s^", "シュ_"],
			["s", "ス_"],
			["t", "ト_"],
			["u^", "ゥ"], // 下線なし
			["v", "ヴ_"],
			["z", "ズ_"],
			// 母音
			["a", "ア"],
			["e", "エ"],
			["i", "イ"],
			["o", "オ"],
			["u", "ウ"],
			// 記号
			["!", "!"],
			["?", "?"],
		];

		return sound_table;
	}
};

