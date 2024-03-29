'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const data00 = require('../dictionary/esperanto/dictionary_data.json');

const Dictionary = require('../src/dictionary');
const dictionary = new Dictionary();

it ("dictionary", function() {
	let dictionary_data = data00;

	let dictionary_handle;
	assert(false === Dictionary.is_initialized(undefined));
	assert(false === Dictionary.is_initialized(null));
	assert(false === Dictionary.is_initialized({}));
	assert(false === Dictionary.is_initialized(dictionary_handle));
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);
	assert(true === Dictionary.is_initialized(dictionary_handle));

	let item;
	let indexes;
	// typo amrilato
	assert(null === Dictionary.query_item_from_keyword(dictionary_handle, "amlilato"));
	assert(null === Dictionary.get_item_from_index(dictionary_handle, -1));

	assert(null !== Dictionary.query_item_from_keyword(dictionary_handle, "amrilato"));
	item = Dictionary.query_item_from_keyword(dictionary_handle, "amrilato");
	assert("amrilato" === Dictionary.get_show_word_from_item(dictionary_handle, item));
	assert("恋愛関係" === Dictionary.get_explanation_from_item(dictionary_handle, item));
	assert("am/rilat/o" === Dictionary.get_root_word_from_item(dictionary_handle, item));
	assert(null !== Dictionary.query_item_from_keyword(dictionary_handle, "bonan matenon"));
	assert(null !== Dictionary.query_item_from_keyword(dictionary_handle, "bonan matenon!"));

	assert(0 === Dictionary.query_indexes_from_jakeyword(dictionary_handle, "アムリラート").length);
	assert(1 === Dictionary.query_indexes_from_jakeyword(dictionary_handle, "恋愛関係").length);
	indexes = Dictionary.query_indexes_from_jakeyword(dictionary_handle, "恋愛関係");
	item = Dictionary.get_item_from_index(dictionary_handle, indexes[0]);
	assert(null !== item);
	assert("amrilato" === Dictionary.get_show_word_from_item(dictionary_handle, item));

	// ** fix query match
	assert(1 === Dictionary.query_indexes_from_jakeyword(dictionary_handle, "赤").length);
	assert(1 === Dictionary.query_indexes_from_jakeyword(dictionary_handle, "赤色").length);
	// new word
	assert(null !== Dictionary.query_item_from_keyword(dictionary_handle, "Juliamo"));
});

it ("dictionary incremental", function() {
	let dictionary_data = data00;

	let dictionary_handle;
	dictionary_handle = Dictionary.init_dictionary(dictionary_data);
	assert(true === Dictionary.is_initialized(dictionary_handle));

	assert(-1 !== Dictionary.query_index_from_incremental_keyword(dictionary_handle, "amrilat"));

	assert(-1 !== Dictionary.query_index_from_incremental_keyword(dictionary_handle, "z"));
	assert(-1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle, "zz"));
	assert(-1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle, "zzz"));
});

it ("dictionary incremental 2", function() {

	const dictionary_handle00 = {
		'hash_of_esperanto': [
			['a', 0],
		],
		'dictionary': [
			['', '', "a-"],
			['', '', "ama"],
			['', '', "amrilato"],
			['', '', "ava"],
		],
	};

	assert(0 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "a"));
	assert(0 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "a-"));
	assert(1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "am"));
	assert(1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "ama"));
	assert(2 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "amrilat"));
	assert(2 === Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "amrilato"));
	assert(-1 == Dictionary.query_index_from_incremental_keyword(dictionary_handle00, "amrilatox"));

	const dictionary_handle01 = {
		'hash_of_esperanto': [
			['a', 0],
		],
		'dictionary': [
			['', '', "a-"],
			['', '', "-an"], // 中央に'-*'な語を置いた場合
			['', '', "amrilat"],
		],
	};

	assert(0 === Dictionary.query_index_from_incremental_keyword(dictionary_handle01, "a"));
	assert(0 === Dictionary.query_index_from_incremental_keyword(dictionary_handle01, "a-"));
	//assert(1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle01, "an"));
	//assert(1 === Dictionary.query_index_from_incremental_keyword(dictionary_handle01, "-an"));
	assert(2 === Dictionary.query_index_from_incremental_keyword(dictionary_handle01, "amrilat"));
});

