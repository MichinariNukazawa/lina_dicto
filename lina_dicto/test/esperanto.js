var assert = require("power-assert"); // assertモジュールのinclude

import Esperanto from '../object/esperanto';

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

