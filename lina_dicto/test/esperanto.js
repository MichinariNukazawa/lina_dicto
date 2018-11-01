'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const Esperanto = require('../js/esperanto');

it ("caret_sistemo_from_str", function() {
	assert("aaa" === Esperanto.caret_sistemo_from_str("aaa"));
	assert("voc^o" === Esperanto.caret_sistemo_from_str("voc^o"));
	assert("voc^o" === Esperanto.caret_sistemo_from_str("vocxo"));
	assert("voc^o" === Esperanto.caret_sistemo_from_str("voĉo"));
	// [^u]~ is not convert because invalid sistemo
	// assert("voc~o" === Esperanto.caret_sistemo_from_str("voc~o"));
	assert("alau^do" === Esperanto.caret_sistemo_from_str("alau^do"));
	assert("alau^do" === Esperanto.caret_sistemo_from_str("alaŭdo"));
	assert("alau^do" === Esperanto.caret_sistemo_from_str("alau~do"));
});

it ("get_candidates", function() {
	let candidates;

	candidates = Esperanto.get_candidates("vekig^is");
	assert(-1 !== candidates.indexOf("vekig^i"));
	candidates = Esperanto.get_candidates("voco");
	assert(-1 !== candidates.indexOf("voc^o"));
	candidates = Esperanto.get_candidates("vok^o");
	assert(-1 !== candidates.indexOf("voc^o"));
	candidates = Esperanto.get_candidates("amlilato");
	assert(-1 !== candidates.indexOf("amrilato"));
	candidates = Esperanto.get_candidates("amrilarto");
	assert(-1 !== candidates.indexOf("amrilato"));
	candidates = Esperanto.get_candidates("alu^do");
	assert(-1 !== candidates.indexOf("alau^do"));
});

it ("get_candidates verbo", function() {
	let candidates;

	let list = [
		"esti",
		"estas",
		"estis",
		"estos",
		"estus",
		"estu",
		"est"
	];

	for(let i = 0; i < list.length - 1; i++){
		candidates = Esperanto.get_verbo_candidates(list[i]);
		for(let t = 0; t < list.length; t++){
			if(i == t){
				continue;
			}
			assert(-1 !== candidates.indexOf(list[t]));
		}
	}
});

it ("castle_char_pairs", function() {
	let data = [
		['disk','disc'],
		['tooth','toos'],
		['amlirato','amrilato'],
	];

	for(let i = 0; i < data.length; i++){
		let cands;
		cands = Esperanto.get_candidates_of_castle_char_pairs(data[i][0]);
		assert(-1 !== cands.indexOf(data[i][1]));

		cands = Esperanto.get_candidates_of_castle_char_pairs(data[i][1]);
		assert(-1 !== cands.indexOf(data[i][0]));
	}
});

it ("splitter", function() {
	const data = [
		['disk', ['disk']],
		['-emulo', ['-emulo']], // 接尾辞表記 [Praktika Esperanto-Japana Vortareto.]( https://www.vastalto.com/jpn/ )
		['kotonoha amrilato', ['kotonoha', 'amrilato']],
		['  	  disk', ['disk']], // 空白除去
		[' kotonoha	amrilato ', ['kotonoha', 'amrilato']],
		['Kio estas tio?', ['Kio', 'estas', 'tio']], // 末尾記号は消える
		['Ĉu vi amas s^in?', ['Ĉu', 'vi', 'amas', 's^in']], // ^-sistemo alfabeto
		['Cxu vi amas s^in?', ['Cxu', 'vi', 'amas', 's^in']], // ^-sistemo x-sistemo
		['Fomalhaŭt/o', ['Fomalhaŭt/o']],  // alfabeto
		['Fomalhau~t/o', ['Fomalhau~t/o']], // ^-sistemo && `~`を含む単語の動作確認
		['Sxia(Rin).', ['Sxia', 'Rin']], // 記号
		['SukeraSparo', ['Sukera', 'Sparo']], // 大文字始まりは大文字を区切り
		['kHz', ['kHz']], // 大文字始まりでなければ大文字区切りしない
		['LKK', ['LKK']], // 大文字始まりでなければ大文字区切りしない
		['Uaz', ['Uaz']], // 小文字が前になければ大文字区切りしない
		['TV-stacio', ['TV-stacio']], // 小文字が前になければ大文字区切りしない
		['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'のスペースに', 'Pano', 'を持ってくると']], // 日本語混在
		['100', ['100']], //数値を分割しない
		['7', ['7']],
		['100.2', ['100.2']],
		['-100.2', ['-100.2']],
		['1,234,567', ['1,234,567']], //数値 日本語ロケール表現
		['1,234,567.89', ['1,234,567.89']],
		['cxu123456789eno', ['cxu', '123456789', 'eno']],
		//['cxu1,234,567.89eno', ['cxu', '1,234,567.89', 'eno']],
		['Rin kisis sxin.', ['Rin', 'kisis', 'sxin']], // 記号除去
		['Rin-', ['Rin']], // 記号除去
	];
	for(let i = 0; i < data.length; i++){
		const res = Esperanto.splitter(data[i][0]);
		assert(data[i][1].length == res.length);
	}
});

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

it ("convertJSoundFromEsperanto", function() {
	const datas = sound_datas;
	for(let i = 0; i < datas.length; i++){
		const data = datas[i];
		const res = Esperanto.convertJSoundFromEsperanto(data[0], '*');
		if(! data[2].isEoToJa){
			console.log('##jsFromEo not', data[0], data[1], res);
		}else{
			assert(data[1] == res.jsound.replace(/[?!]$/, ''));
		}
	}
});

it ("convertEsperantoFromJaSound", function() {
	const datas = sound_datas;
	for(let i = 0; i < datas.length; i++){
		const data = datas[i];
		const res = Esperanto.convertEsperantoFromJaSound(data[1], '*');
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

