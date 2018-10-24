'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const dictionary_data = require('../dictionary/esperanto/dictionary00.json');
const Dictionary = require('../js/dictionary');
let dictionary = new Dictionary();

const Linad = require('../js/linad');

it ("getResponsesFromKeystring", function() {
var dictionary_handle;
dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	const datas = [
		['bona', ['bona']],
		['bonan matenon.', ['bonan matenon']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'のスペースに', 'Pano', 'を持ってくると']],
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
		// console.log(datas[i][0], res);
		assert(datas[i][1].length == res.length);
		for(let t = 0; t < datas[i][1].length; t++){
			assert(datas[i][1][t] === res[t].matching_keyword);
		}
	}
});

