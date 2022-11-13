'use strict';

var assert = require("power-assert");

const Esperanto = require('../src/esperanto');
const EsperantoJa = require('../src/esperanto-ja');


	const sound_datas = [
		['Ne gravas!',			'ネ　グ_ラーヴァス_',				{'isEoToJa':true,	'isJaToEo':true}],
		['bonan tagon?',		'ボーナン　ターゴン',				{'isEoToJa':true,	'isJaToEo':true}],
		['Doko',			'ドーコ',					{'isEoToJa':true,	'isJaToEo':false}],
		['sxipo',			'シーポ',					{'isEoToJa':true,	'isJaToEo':true}],
		['sxipano',			'シパーノ',					{'isEoToJa':true,	'isJaToEo':true}],
		['Mi estas ruka',		'ミ　エス_タス_　ルーカ',			{'isEoToJa':true,	'isJaToEo':true}],
		['Kio estas via nomo?',		'キーオ　エス_タス_　ヴィーア　ノーモ',		{'isEoToJa':true,	'isJaToEo':false}],
		['Kie vi logxas',		'キーエ　ヴィ　ロ▼ーヂャス_',			{'isEoToJa':true,	'isJaToEo':true}],

		['ra ri ru re ro',		'ラ　リ　ル　レ　ロ',				{'isEoToJa':true,	'isJaToEo':true}],
		['la li lu le lo',		'ラ▼　リ▼　ル▼　レ▼　ロ▼',			{'isEoToJa':true,	'isJaToEo':true}],

		// 子音
		['dorso',			'ドル_ソ',				{'isEoToJa':true,	'isJaToEo':false}],
		['estas',			'エス_タス_',				{'isEoToJa':true,	'isJaToEo':true}],
		//['dorso',			{'isEoToJa':true,	'isJaToEo':true}], [' ＝ do[r]so = ドル_ソ
		//['estas',			{'isEoToJa':true,	'isJaToEo':true}], ['  ＝ e[s]ta[s] = エス_タス_
		//
		// 発音補助の記号です(※他の言語では通じません。ユリアーモオンリーです)
		//
		['ekiri',			'エク_イーリ',				{'isEoToJa':false,	'isJaToEo':false}],
		['ekiru',			'エク_イール',				{'isEoToJa':false,	'isJaToEo':false}],
		['eliris',			'エル_▼イーリス',			{'isEoToJa':false,	'isJaToEo':false}],
		['memorkapablo',		'メモル_カパブ_ロ▼',			{'isEoToJa':true,	'isJaToEo':false}],
		['orangxsukon',			'オランヂ_ュ_スーコン',			{'isEoToJa':true,	'isJaToEo':false}],
		['kauxzis',			'カゥズィス',				{'isEoToJa':false,	'isJaToEo':false}],
		['fisxo',			'フ▼ィーショ',				{'isEoToJa':true,	'isJaToEo':true}],
		['eno',				'エーノ',				{'isEoToJa':true,	'isJaToEo':true}],

		['eĉ',				'エチ_ュ_',				{'isEoToJa':true,	'isJaToEo':false}],

		// 接頭辞は切り、接尾辞は切らない。

		// 合成語は切る。
		['homamaso',			'ホム_アマーソ',			{'isEoToJa':false,	'isJaToEo':false}],
		//['laborabelo
		//['mararmeo
		//['memamo
		//['olivoleo
		//['ŝtonepoko
		//['popolamaso
		//['
		//['njは連音する。
		['sinjoro',			'スィニョーロ',				{'isEoToJa':true,	'isJaToEo':true}],
		//['kampanjo kampanjo

		['kune',			'クーネ',				{'isEoToJa':true,	'isJaToEo':false}],

		['tricent',			'トリーツェント',			{'isEoToJa':false,	'isJaToEo':true}],
		['antauxe',			'アンタゥエ',				{'isEoToJa':false,	'isJaToEo':true}],
	];

it ("EsperantoJa.convertJaSoundFromEsperanto", function() {
	const datas = sound_datas;
	for(let i = 0; i < datas.length; i++){
		const data = datas[i];
		const res = EsperantoJa.convertJaSoundFromEsperanto(Esperanto.caret_sistemo_from_str(data[0]), '*');
		if(! data[2].isEoToJa){
			console.log('##jsFromEo not', data[0], data[1], res);
		}else{
			assert(data[1] == res.jsound.replace(/[?!]$/, ''));
		}
	}
});

it ("EsperantoJa.convertEsperantoFromJaSound", function() {
	const datas = sound_datas;
	for(let i = 0; i < datas.length; i++){
		const data = datas[i];
		const res = EsperantoJa.convertEsperantoFromJaSound(data[1], '*');
		if(! data[2].isJaToEo){
			console.log('##EoFromJa not', data[0], data[1], res);
		}else{
			let word = Esperanto.caret_sistemo_from_str(data[0]);
			// l,rの区別は諦める
			word = word.toLowerCase().replace(/[?!]$/, '').replace(/r/g,'l');
			//console.log('##EoFromJs', word, data[0], data[1], res);
			assert(word == res.eoWord);
		}
	}
});

