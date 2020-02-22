'use strict';

const fs = require('fs');
const path = require('path');
const Dictionary = require('../../../js/dictionary');

const datafile = path.join(__dirname, '/../dictionary_data.json');
const dstfile = path.join(__dirname, '/ios/ja_dictionary_ios.json');

const t = fs.readFileSync(datafile, 'utf8');
const dictionary_data = JSON.parse(t);
const dictionary_handle = Dictionary.init_dictionary(dictionary_data);

let dict = dictionary_handle.jadictionary;
console.log(dict);
let td = {};
let dst = [];
for (let i = 0; i < dict.length; i++) {
	if(0 == i % 5000){ console.log('progress:', i, '/', dict.length); }
	const index = dict[i][1];
	const jsearch_word = dict[i][2];

	const item = Dictionary.get_item_from_index(dictionary_handle, index);
	const root_word = Dictionary.get_root_word_from_item(dictionary_handle, item);

	if(! td[jsearch_word]){
		td[jsearch_word] = [root_word]
	}else{
		td[jsearch_word].push(root_word);
	}
}

for(let k in td){
	dst.push({
		'k': k,
		'v': td[k],
	});
}
let t2 = JSON.stringify(dst);
t2 = t2.replace(/\},\{/g, "},\n{");
fs.writeFileSync(dstfile, t2);

