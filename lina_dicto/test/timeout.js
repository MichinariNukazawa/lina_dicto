'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const dictionary_data = require('../dictionary/esperanto/dictionary01.json');
const Dictionary = require('../js/dictionary');
let dictionary = new Dictionary();

const Linad = require('../js/linad');

var dictionary_handle;
it ("Dictionary.init_dictionary timeout", function(done) {
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);
	done();
}).timeout(1000);

it ("Linad.initialize timeout", function(done) {
	Linad.initialize(function(err){
		done();
	});
}).timeout(6000);

it ("Dictionary.query_item_from_keyword timeout", function(done) {
	// ループによる水増しは、平均化にあまり効果があるように見えない。
	// データ数を増やしたほうが良さそうに見える。
	const EO_TO_JA_DICT_DATAS = [
		['voc^o',		{'isMatch':true}],
		['bonan',		{'isMatch':true}],
		['bonan matenon',	{'isMatch':true}],
		['kafo',		{'isMatch':true}],
		['kafolakto',		{'isMatch':true}],
		['vitra',		{'isMatch':true}],
		['zorgo',		{'isMatch':true}],
		['boc^o',		{'isMatch':false}],
		['BBBBBB',		{'isMatch':false}],
		['BONAN matenon',	{'isMatch':true}],
		['vocxa',		{'isMatch':false}],
		['vocxo',		{'isMatch':false}],
		['bocxa',		{'isMatch':false}],
		['boc^o',		{'isMatch':false}],
		['boc^a',		{'isMatch':false}],
		['boc^o',		{'isMatch':false}],
		['eee',			{'isMatch':false}],
		['sss',			{'isMatch':false}],
		['zzz',			{'isMatch':false}],
		['eeeee',		{'isMatch':false}],
		['sssss',		{'isMatch':false}],
		['zzzzz',		{'isMatch':false}],
		['eeeeee',		{'isMatch':false}],
		['ssssss',		{'isMatch':false}],
		['zzzzzz',		{'isMatch':false}],
		['eeeeeee',		{'isMatch':false}],
		['sssssss',		{'isMatch':false}],
		['zzzzzzz',		{'isMatch':false}],
		['eeeeeeeeee',		{'isMatch':false}],
		['ssssssssss',		{'isMatch':false}],
		['xxxxxxxxxx',		{'isMatch':false}],
	];

	const datas = EO_TO_JA_DICT_DATAS;
	for(let c = 0; c < 10; c++){ // 水増しと平均化
		for(let i = 0; i < datas.length; i++){
			const data = datas[i];
			let res;
			res = Dictionary.query_item_from_keyword(dictionary_handle, data[0]);
			if(! data[1].isMatch){
				assert(null === res);
			}else{
				assert(null !== res);
			}
			//assert(data[1] === res[2]);
		}
	}

	setTimeout(done, 100); // 実行完了が早すぎる場合に実行時間が表示されない
}).timeout(200);

it ("Dictionary.query_index_from_incremental_keyword timeout", function(done) {
	this.retries(2);

	const EO_TO_JA_DICT_DATAS = [
		['bona',		{'isMatch':true}],
		['bonan',		{'isMatch':true}],
		['bonan matenon',	{'isMatch':true}],
		['bonan nokton',	{'isMatch':true}],
		['kafo',		{'isMatch':true}],
		['kafbero',		{'isMatch':true}],
		['kafolakto',		{'isMatch':true}],
		['kafplantejo',		{'isMatch':true}],
		['vitra',		{'isMatch':true}],
		['vitro',		{'isMatch':true}],
		['zorga',		{'isMatch':true}],
		['zorgo',		{'isMatch':true}],
		['voc^a',		{'isMatch':true}],
		['voc^o',		{'isMatch':true}],
		['bon',			{'isMatch':true}],
		['bona',		{'isMatch':true}],
		['bonan mateno',	{'isMatch':true}],
		['bonan nokto',		{'isMatch':true}],
		['kaf',			{'isMatch':true}],
		['kafber',		{'isMatch':true}],
		['kafolakt',		{'isMatch':true}],
		['kafplantej',		{'isMatch':true}],
		['vitr',		{'isMatch':true}],
		['vitr',		{'isMatch':true}],
		['zorg',		{'isMatch':true}],
		['zorg',		{'isMatch':true}],
		['voc^',		{'isMatch':true}],
		['voc^',		{'isMatch':true}],
		['vocxa',		{'isMatch':false}],
		['vocxo',		{'isMatch':false}],
		['bocxa',		{'isMatch':false}],
		['boc^o',		{'isMatch':false}],
		['boc^a',		{'isMatch':false}],
		['boc^o',		{'isMatch':false}],
		['eee',			{'isMatch':false}],
		['sss',			{'isMatch':false}],
		['zzz',			{'isMatch':false}],
		['eeeee',		{'isMatch':false}],
		['sssss',		{'isMatch':false}],
		['zzzzz',		{'isMatch':false}],
		['eeeeee',		{'isMatch':false}],
		['ssssss',		{'isMatch':false}],
		['zzzzzz',		{'isMatch':false}],
		['eeeeeee',		{'isMatch':false}],
		['sssssss',		{'isMatch':false}],
		['zzzzzzz',		{'isMatch':false}],
		['eeeeeeeeee',		{'isMatch':false}],
		['ssssssssss',		{'isMatch':false}],
		['xxxxxxxxxx',		{'isMatch':false}],
	];

	const datas = EO_TO_JA_DICT_DATAS;
	for(let c = 0; c < 10; c++){
		for(let i = 0; i < datas.length; i++){
			const data = datas[i];
			let res;
			res = Dictionary.query_index_from_incremental_keyword(dictionary_handle, data[0]);
			if(! data[1].isMatch){
				// assert(null === res);
			}else{
				assert(-1 !== res);
			}
			//assert(data[1] === res[2]);
		}
	}

	setTimeout(done, 100); // 実行完了が早すぎる場合に実行時間が表示されない
}).timeout(200);

it ("Dictionary.query_indexes_from_jakeyword timeout", function(done) {
	this.retries(2);

	const JA_TO_EO_DICT_DATAS = [
		['そろばん',		{'matchs':['abak/o', 'glob/kalkul/il/o', 'japan/a abak/o']}],
		['気づかい',		{'matchs':['zorgo']}],
		['心配',		{'matchs':['maltrankvilo', 'timo', 'zorgo']}],
		['あああああ',		{'matchs':[]}],
		['ををををを',		{'matchs':[]}],
		['ーーーーー',		{'matchs':[]}],
		['あーーーーー',	{'matchs':[]}],
		['植物',		{'matchs':['kresk/aj^/o', 'plant/ar/o', 'plant/o', 'veget/aj^/o', 'vegetal/o']}],
	];

	const datas = JA_TO_EO_DICT_DATAS;
	for(let c = 0; c < 10; c++){
		for(let i = 0; i < datas.length; i++){
			const data = datas[i];
			const indexes = Dictionary.query_indexes_from_jakeyword(dictionary_handle, data[0]);
			assert(indexes.length === data[1].matchs.length);
			for(let t = 0; t < data[1].matchs.length; t++){
				const item = Dictionary.get_item_from_index(dictionary_handle, indexes[t]);
				const show_word = Dictionary.get_show_word_from_item(dictionary_handle, item);
				//console.log('## jkey' ,i, t, data[1].matchs[t].replace(/\//g, ''), show_word);
				assert(data[1].matchs[t].replace(/\//g, '') === show_word);
			}
		}
	}

	done();
}).timeout(2000);

it ("Dictionary.query_glosses_info_from_jakeyword timeout", function(done) {
	this.retries(2);

	const JA_TO_EO_DICT_DATAS = [
		['そろばん',		{'count': 1, 'matchs':['abak/o', 'glob/kalkul/il/o', 'japan/a abak/o']}],
		['気づかい',		{'count': 1, 'matchs':['zorgo']}],
		['心配',		{'count': 8, 'matchs':["心配げに","心配な","心配させる","心配する","心配","心配性の","心配そうに","心配の多い"]}],
		['あああああ',		{'count': 0, 'matchs':[]}],
		['ををををを',		{'count': 0, 'matchs':[]}],
		['ーーーーー',		{'count': 0, 'matchs':[]}],
		['あーーーーー',	{'count': 0, 'matchs':[]}],
		['植物',		{'count': 25, 'matchs':['kresk/aj^/o', 'plant/ar/o', 'plant/o', 'veget/aj^/o', 'vegetal/o']}],
		['恋',			{'count': 17}],
		['愛',			{'count': 25}],
		['恋愛',		{'count': 4}],
	];

	const datas = JA_TO_EO_DICT_DATAS;
	for(let c = 0; c < 10; c++){
		for(let i = 0; i < datas.length; i++){
			const data = datas[i];
			const glosses = Dictionary.query_glosses_info_from_jakeyword(dictionary_handle, data[0]);
			// console.log('##jg', glosses.length, data[1].count, data[0]);
			assert(glosses.length === data[1].count);
		}
	}

	done();
}).timeout(2000);

it ("Linad.getResponsesFromKeystring timeout", function(done) {

	const datas = [
		['boc^o boc^o boc^o',['boc^o', 'boc^o', 'boc^o']], // 候補推定にマッチしないwordの並び(組み合わせ)は時間がかかる
		['xxxxxxxxxx',['xxxxxxxxxx']], //検索ヒットせず「もしかして機能」も該当がない場合
		['ををを',['を','を','を']], //検索ヒットせず「もしかして機能」も該当がない場合
		['ーーーーーーーーーー',['ーーーーーーーーーー']], //検索ヒットせず「もしかして機能」も該当がない場合
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
		assert(datas[i][1].length == res.length);
	}

	done();

}).timeout(1000);

it ("Linad.getResponsesFromKeystring timeout 02", function(done) {
	// マッチしないwordの後にマッチするwordを繋げると遅くなる
	const datas = [
		// 'c^u vi estas lingvon esperanto'
		['c^u vi estas lingvo--- esperanto',		{}],
		['lingvo--- esperanto',				{}],
	];
	for(let i = 0; i < datas.length; i++){
		let res;
		res = Linad.getResponsesFromKeystring(dictionary_handle, datas[i][0]);
	}

	done();
}).timeout(1500);

