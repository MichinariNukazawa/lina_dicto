'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const dictionary_data = require('../dictionary/esperanto/dictionary_data.json');
const Dictionary = require('../src/dictionary');
let dictionary = new Dictionary();

const Linad = require('../src/linad');



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
		// 1word
		['bona', ['bona']],
		// candidate
		['estas', ['esti']],
		['sennecesi', ['sennecesa']],
		// 2word
		['bonan matenon.', ['bonan matenon']],
		//['BonanMatenon', ['bonan matenon']],
		['SukeraSparo', ['Sukera Sparo']],//['SukeraSparo']],
		['Kio estas', ['Kio', 'esti']],
		['Kio estas c^i tio.', ['Kio', 'esti', 'c^i tio']], // bug ['Kio estas'(もしかして:'tio estas'), 'c^i', 'tio']
		// 3word
		['abstini de alkoholaj^o',	['abstini de alkoholaj^o']],
		['atesto pri registriteco',	['atesto pri registriteco']],
		['volto en metro',		['volto en metro']],
		['estas abstini de alkoholaj^o',	['esti', 'abstini de alkoholaj^o']],
		['estas atesto pri registriteco',	['esti', 'atesto pri registriteco']],
		['estas volto en metro',		['esti', 'volto en metro']],
		['volto en metro estas',		['volto en metro', 'esti',]],
		['estas volto en metro estas',		['esti', 'volto en metro', 'esti']],
		// 4word
		["tutmonda esperantista junulara organizo",	["tutmonda esperantista junulara organizo",	]],
		["tie kaj c^i tie",				["tie kaj c^i tie",				]],
		["skatolo el ondumita kartono",			["skatolo el ondumita kartono",			]],
		["sistemo internacia de unitoj",		["sistemo internacia de unitoj",		]],
		["sankta kristoforo kaj neviso",		["sankta kristoforo kaj neviso",		]],
		["reg^o de la birdoj",				["reg^o de la birdoj",				]],
		//["estas tutmonda esperantista junulara organizo",	['esti', "tutmonda esperantista junulara organizo",	]],
		//["estas tie kaj c^i tie",				['esti', "tie kaj c^i tie",				]],
		//
		// ['cxi tio.', ['cxi tio']], //! @todo sistemo対応
		['1024', ['1024']],
		['-1024', ['-1024']],
		['100eno', ['100', 'eno']],
		['Brasiko estas 100enoj', ['Brasiko', 'esti', '100', 'eno']],
		//['SukeraSparoのスペースにPanoを持ってくると', ['Sukera', 'Sparo', 'の', 'スペース', 'に', 'Pano', 'を持ってくると']],
		// ここの出力はkuromoziに依存
		['SukeraSparoのスペースにPanoを持ってくると', ["Sukera Sparo","の","スペース","に","Pano","を","持って","くる","と"]],
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
		// 接頭辞(sufikso)
		// mal-
		['mallingvo',	1, {keyword_modify_src: 'mallingvo',		matching_keyword: 'lingvo'}],
		// ** mal 先頭マッチでkeyword優先できていることを確認
		// マラバル海岸（インド）
		['malabaro',	0, {keyword_modify_src: null,			matching_keyword: 'malabaro'}],
		// 憎しみ
		['malamo',	0, {keyword_modify_src: null,			matching_keyword: 'malamo'}],
		// 左の, 左翼の, 左派の
		['maldekstra',	0, {keyword_modify_src: null,			matching_keyword: 'maldekstra'}],
		// mal-以外
		//['sennecesi',	1, {keyword_modify_src: 'sennecesi',		matching_keyword: 'necesi'}], // -> sennecesa
		['rekunsido',	1, {keyword_modify_src: 'rekunsido',		matching_keyword: 'kunsido'}],
		// -j -n
		['akvoj',	1, {keyword_modify_src: 'akvoj',		matching_keyword: 'akvo'}],
		['akvij',	1, {keyword_modify_src: 'akvij',		matching_keyword: 'akvi'}],
		['akvon',	1, {keyword_modify_src: 'akvon',		matching_keyword: 'akvo'}],
		['akvin',	1, {keyword_modify_src: 'akvin',		matching_keyword: 'akvi'}],
		['akvojn',	1, {keyword_modify_src: 'akvojn',		matching_keyword: 'akvo'}],
		['akvijn',	1, {keyword_modify_src: 'akvijn',		matching_keyword: 'akvi'}],
		['malakvojn',	1, {keyword_modify_src: 'malakvojn',		matching_keyword: 'akvo'}],
		['malakvijn',	1, {keyword_modify_src: 'malakvijn',		matching_keyword: 'akvi'}],
		// 'malamo + -j + -n'
		['malamojn',	1, {keyword_modify_src: 'malamojn',		matching_keyword: 'malamo'}],
		// 'eno + -j'
		['enoj',	1, {keyword_modify_src: 'enoj',			matching_keyword: 'eno'}],
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

it ("query prefikso sufikso", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	Linad.initialize(function(){

	const datas = [
		// 接頭辞
		['mal-'			, 'is prefikso'],
		["lau^-"		, null], // 'is prefikso'], // 'lau^'がマッチ
		['preter-'		, null], // 'is prefikso'], // 'preter'がマッチ
		['vir-'			, 'is prefikso'],
		// 接尾辞（学術接尾辞等）
		['-ant-'		, 'is sufikso'],
		['-skopi-'		, 'is sufikso'],
		['-um-'			, 'is sufikso'],
		['-int-'		, null], // , 'is sufikso'], // 'int.'
		// 接尾辞
		['-oble'		, 'is sufikso'], // -obl/e
		['-forma'		, null], // , 'is sufikso'], // 'forma'
		['-us'			, 'is sufikso']
	];
	for(let i = 0; i < datas.length; i++){
		let res;

		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
		//console.log('##keystr', datas[i][0], res);
		//console.log(res[0].match_items);
		assert(1		=== res.length);
		if(1 === res.length){ assert(1			=== res[0].match_items.length); }

		/* '-'を取り除いた状態では該当する単語がある場合があり得る。
		 * その場合はそちらを返すので、'-'付きと結果が異なっていても構わない。
		 */
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0].replace(/[-]/g, ''));
		//console.log('##keystr', datas[i][0], res);
		//console.log(res[0].match_items);
		assert(1		=== res.length);
		if(1 === res.length){ assert(1			=== res[0].match_items.length); }
		if(1 === res.length){ assert(datas[i][1]	=== res[0].keyword_modify_kind); }
	}

	const datas2 = [
		// 接尾辞（学術接尾辞等）
		['-an-'			, ['-an',]],
		['-ant-'		, ['-ant',]],
		['-skop-'		, ['-skop',]],
		['-skopi-'		, ['-skopi',]],
		['-um-'			, ['-um',]],
		['-in-'			, ['-in',]],
		['-int-'		, ['-int',]],
		['-obl-'		, ['-ob',]],
		// 接尾辞
		['-o'			, ['-o',]],
		//['-oble'		, ['-oble',]],
		['-forma'		, ['-form',]],
		['-us'			, ['-us',]],
	];
	for(let i = 0; i < datas2.length; i++){
		const keyword = datas2[i][0];
		for(let t = 0; t < datas2[i][1].length; t++){
			const word = datas2[i][1][t];
			//console.log("## ", i, t, word);
			const items = Linad.getIncrementalItemsFromKeyword(dictionary_handle, word);
			assert(1 <= items.length);

			const show_word = Dictionary.get_show_word_from_item(dictionary_handle, items[0]);
			assert(keyword === show_word);
		}
	}

	});
});

it ("getIncrementalItemsFromKeyword", function() {
	var dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);

	Linad.initialize(function(){

	const datas = [
		['bonan mateno'			, 3, 'Bonan matenon!'],
		[''				, 0, ''],
		['xxxxxx'			, 0, ''],
		['esta'				, 3, 'establado'], // esti
		['estas'			, 0, ''], // esti
	];
	for(let i = 0; i < datas.length; i++){
		let res;

		res = Linad.getIncrementalItemsFromKeyword(dictionary_handle, datas[i][0]);
		//console.log('##keystr', datas[i][0], res);
		assert(datas[i][1] === res.length);
		if(1 < res.length){
			const show_word = Dictionary.get_show_word_from_item(dictionary_handle, res[0]);
			assert(datas[i][2] === show_word);
		}
	}

	});
});

