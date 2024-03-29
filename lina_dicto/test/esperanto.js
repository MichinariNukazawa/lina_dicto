'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const Esperanto = require('../src/esperanto');
//const EsperantoJa = require('../src/esperanto-ja');

it ("is_esperanto_string", function() {
	assert(Esperanto.is_esperanto_string("bona"));
	assert(Esperanto.is_esperanto_string("voc^o"));
	assert(Esperanto.is_esperanto_string("vocxo"));
	assert(Esperanto.is_esperanto_string("voĉo"));
	assert(false === Esperanto.is_esperanto_string("恋愛関係"));
	assert(false === Esperanto.is_esperanto_string("相合傘"));
});

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
		candidates = Esperanto.get_finajxo_candidates(list[i]);
		for(let t = 0; t < list.length; t++){
			if(i == t){
				continue;
			}
			assert(-1 !== candidates.indexOf(list[t]));
		}
	}
});

it ("get_candidates_of_castle_char_pairs_", function() {
	let data = [
		['disk','disc'],
		['tooth','toos'],
		['amlirato','amrilato'],
	];

	for(let i = 0; i < data.length; i++){
		let cands;
		cands = Esperanto.get_candidates_of_castle_char_pairs_(data[i][0]);
		assert(-1 !== cands.indexOf(data[i][1]));

		cands = Esperanto.get_candidates_of_castle_char_pairs_(data[i][1]);
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

