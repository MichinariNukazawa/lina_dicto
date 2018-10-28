'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const dictionary_data = require('../dictionary/esperanto/dictionary00.json');
const Dictionary = require('../js/dictionary');
let dictionary = new Dictionary();

const Linad = require('../js/linad');



it ("getResponseFromIntString_", function() {
	const datas = [
		['disk', null],
		['100', {'lang':"ja", 'matching_keyword':"100", 'match_items': [["cent","",""]],}],
		['1024', {'lang':"ja", 'matching_keyword':"1024", 'match_items': [["mil dudek kvar","",""]],}],
		['1234500', {'lang':"ja", 'matching_keyword':"1234500", 'match_items': [["unu miliono ducent tridek kvar mil kvincent","",""]],}],
		['0', {'lang':"ja", 'matching_keyword':"0", 'match_items': [["nulo","",""]],}],
		['-42', null], // マイナス値は非対応
		//['-42010', {'lang':"ja", 'matching_keyword':"-42010", 'match_items': [["","",""]],}],
	];
	for(let i = 0; i < datas.length; i++){
		const res = Linad.getResponseFromIntString_(datas[i][0]);
		//console.log('##num', datas[i][1], res);
		assert(typeof datas[i][1] === typeof res);
		if(null === datas[i][1]){
			continue;
		}
		assert(null !== res);
		assert(datas[i][1].lang === res.lang);
		assert(datas[i][1].matching_keyword === res.matching_keyword);
		assert(datas[i][1].match_items.length === res.match_items.length);
		if(0 < datas[i][1].match_items.length){
			assert(datas[i][1].match_items[0][0] === res.match_items[0][0]);
		}
	}
});

it ("katakanaSplitter_", function() {
	const datas = [
		[['disk'], ['disk']],
		[['kotonoha', 'amrilato'], ['kotonoha', 'amrilato']],
		[['Sukera', 'Sparo', 'のスペースに', 'Pano', 'を持ってくると'], ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		[['エナジィハーヴェスト'], ['エナジィハーヴェスト']], // 小文字・濁点
		[['ハープ'], ['ハープ']],
	];
	for(let i = 0; i < datas.length; i++){
		const res = Linad.katakanaSplitter_(datas[i][0]);
		assert(datas[i][1].length == res.length);
		for(let t = 0; t < datas[i][1].length; t++){
			assert(datas[i][1][t] === res[t]);
		}
	}
});

it ("splitter_", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	const datas = [
		['bona', ['bona']],
		['bonan matenon.', ['bonan', 'matenon']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		['1024', ['1024']],
		['-1024', ['-1024']],
		['100eno', ['100', 'eno']],
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.splitter_(dictionary_handle, datas[i][0]);
		//console.log('##keystr', datas[i][0], res);
		assert(datas[i][1].length == res.length);
		for(let t = 0; t < datas[i][1].length; t++){
			assert(datas[i][1][t] === res[t]);
		}
	}
});

it ("getResponsesFromKeystring", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	const datas = [
		['bona', ['bona']],
		['bonan matenon.', ['bonan matenon']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		['1024', ['1024']],
		['-1024', ['-1024']],
		['100eno', ['100', 'eno']],
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
		//console.log('##keystr', datas[i][0], res);
		assert(datas[i][1].length == res.length);
		for(let t = 0; t < datas[i][1].length; t++){
			assert(datas[i][1][t] === res[t].matching_keyword);
		}
	}
});

