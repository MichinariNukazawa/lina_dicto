'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const dictionary_data = require('../dictionary/esperanto/dictionary00.json');
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

