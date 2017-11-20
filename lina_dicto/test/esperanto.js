var assert = require("power-assert"); // assertモジュールのinclude

import Esperanto from '../js/esperanto';
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
