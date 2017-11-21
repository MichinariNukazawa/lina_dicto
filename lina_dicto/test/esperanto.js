var assert = require("power-assert"); // assertモジュールのinclude

import Esperanto from '../object/esperanto';
const esperanto = new Esperanto();

it ("caret_sistemo_from_str", function() {
	assert("aaa" === esperanto.caret_sistemo_from_str("aaa"));
	assert("voc^o" === esperanto.caret_sistemo_from_str("voc^o"));
	assert("voc^o" === esperanto.caret_sistemo_from_str("vocxo"));
	assert("voc^o" === esperanto.caret_sistemo_from_str("voĉo"));
	// [^u]~ is not convert because invalid sistemo
	// assert("voc~o" === esperanto.caret_sistemo_from_str("voc~o"));
	assert("alau^do" === esperanto.caret_sistemo_from_str("alau^do"));
	assert("alau^do" === esperanto.caret_sistemo_from_str("alaŭdo"));
	assert("alau^do" === esperanto.caret_sistemo_from_str("alau~do"));
});

it ("get_candidates", function() {
	let candidates;

	candidates = esperanto.get_candidates("vekig^is");
	assert(-1 !== candidates.indexOf("vekig^i"));
	candidates = esperanto.get_candidates("voco");
	assert(-1 !== candidates.indexOf("voc^o"));
	candidates = esperanto.get_candidates("vok^o");
	assert(-1 !== candidates.indexOf("voc^o"));
	candidates = esperanto.get_candidates("amlilato");
	assert(-1 !== candidates.indexOf("amrilato"));
	candidates = esperanto.get_candidates("amrilarto");
	assert(-1 !== candidates.indexOf("amrilato"));
	candidates = esperanto.get_candidates("alu^do");
	assert(-1 !== candidates.indexOf("alau^do"));
});

