var assert = require("power-assert"); // assertモジュールのinclude

import Esperanto from '../object/esperanto';
const esperanto = new Esperanto();
import Dictionary from '../object/dictionary';
const dictionary = new Dictionary();

import data00 from '../dictionary/esperanto/dictionary00.json';

it ("dictionary", function() {
	let dictionary_data = data00;

	assert(false === dictionary.is_init());
	dictionary.init_dictionary(dictionary_data);
	assert(true === dictionary.is_init());

	let item;
	let indexes;
	assert(null === dictionary.get_item_from_keyword("amlilato"));
	assert(null === dictionary.get_item_from_index(-1));

	assert(null !== dictionary.get_item_from_keyword("amrilato"));
	item = dictionary.get_item_from_keyword("amrilato");
	assert("amrilato" === dictionary.get_show_word_from_item(item));
	assert("恋愛関係" === dictionary.get_explanation_from_item(item));
	assert("am/rilat/o" === dictionary.get_root_word_from_item(item));
	assert(null !== dictionary.get_item_from_keyword("bonan matenon"));
	assert(null !== dictionary.get_item_from_keyword("bonan matenon!"));

	assert(0 === dictionary.get_indexes_from_jkeyword("アムリラート").length);
	assert(1 === dictionary.get_indexes_from_jkeyword("恋愛関係").length);
	indexes = dictionary.get_indexes_from_jkeyword("恋愛関係");
	item = dictionary.get_item_from_index(indexes[0]);
	assert(null !== item);
	assert("amrilato" === dictionary.get_show_word_from_item(item));
});

