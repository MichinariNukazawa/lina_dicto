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

it ("splitter_", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	Linad.initialize(function(){

	const datas = [
		['bona', ['bona']],
		['bonan matenon.', ['bonan', 'matenon']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparo', ['Sukera','Sparo']],
		//['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		// ここの出力はkuromoziに依存
		['SukeraSparoのスペースにPanoを持ってくると', ["Sukera","Sparo","の","スペース","に","Pano","を","持っ","て","くる","と"]],
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
});

it ("getResponsesFromKeystring", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	Linad.initialize(function(){

	const datas = [
		['bona', ['bona']],
		['bonan matenon.', ['bonan matenon']],
		['SukeraSparo', ['Sukera','Sparo']],
		['SukeraSparo', ['Sukera','Sparo']],
		['Kio estas', ['Kio', 'esti']], // bug ['Kio estas'(もしかして:'tio estas'), 'c^i', 'tio']
		['Kio estas c^i tio.', ['Kio', 'esti', 'c^i tio']], // bug ['Kio estas'(もしかして:'tio estas'), 'c^i', 'tio']
		// ['cxi tio.', ['cxi tio']], //! @todo sistemo対応
		['1024', ['1024']],
		['-1024', ['-1024']],
		['100eno', ['100', 'eno']],
		['Brasiko estas 100enoj', ['Brasiko', 'esti', '100', 'enoj']],
		//['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		// ここの出力はkuromoziに依存
		['SukeraSparoのスペースにPanoを持ってくると', ["Sukera","Sparo","の","スペース","に","Pano","を","持って","くる","と"]],
		['りんご', ['リンゴ']], // ひらがなでマッチしなかった場合にカタカナで検索する
		['じゃがいもってりんごだったの!?', ['じゃがいも', 'って', 'リンゴ', 'だった', 'の']],
		['だったの！？', ['だった', 'の']], // 全角記号
		['リンゴ', ['リンゴ']], // カタカナ入力された際にカナ読みesperanto変換より先に日本語マッチするものを探す
		['ボーナン', ['bonan']], // カナ読みesperanto変換
		['ボーナン　マテーノン', ['bonan matenon']], // カナ読みesperanto変換
		['ボーナン マテーノン', ['bonan matenon']], // カナ読みesperanto変換(半角空白混じり)
		['Ｂｏｎａｎ　ｍａteｎｏｎ', ['Bonan matenon']], // 全角文字および全角空白混じり
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
});

it ("getResponsesFromKeystring Radiko verbo match", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	Linad.initialize(function(){

	const datas = [
		['estas',	1, {keyword_modify_src: 'estas',		matching_keyword: 'esti'}],
		['mallingvo',	1, {keyword_modify_src: 'mallingvo',		matching_keyword: 'lingvo'}],
		// ** mal 先頭マッチでkeyword優先できていることを確認
		// マラバル海岸（インド）
		['malabaro',	0, {keyword_modify_src: null,			matching_keyword: 'malabaro'}],
		// 左の, 左翼の, 左派の
		['maldekstra',	0, {keyword_modify_src: null,			matching_keyword: 'maldekstra'}],
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
		//console.log('##keystr', datas[i][0], res);
		assert(1		== res.length);
		assert(datas[i][1]	== res[0].radiko_items.length);
		assert(datas[i][2].keyword_modify_src		== res[0].keyword_modify_src);
		assert(datas[i][2].matching_keyword		== res[0].matching_keyword);
	}

	});
});

