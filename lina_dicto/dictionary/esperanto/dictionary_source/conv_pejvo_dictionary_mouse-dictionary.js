'use strict';
/**
MouseDictionary初期読み込み用の辞書データを生成
( https://github.com/MichinariNukazawa/lina_dicto_for_ios )
*/

const fs = require('fs');
const path = require('path');

const datafile = path.join(__dirname, '/../dictionary_data.json');
const dstfilebase = path.join(__dirname, '/md/initial_dict');

const t = fs.readFileSync(datafile, 'utf8');
let dict = JSON.parse(t);
let dsts = [{},{},];
for (let i = 0; i < dict.length; i++) {
	const ix = Math.trunc(i / (dict.length / dsts.length));
	let key = dict[i][2];
	let value = dict[i][1];

	if(0 == i % 10000){
		console.log('progress:', i, '/', dict.length);
		console.log(i, ix, key, value);
	}

	if('-' === key[0]){
		key = key.substr(1)
		// remove "-"
		// js dict invalid character
		// and matching is very short percent real world.
	}

	let dst = dsts[ix];
	if(dst.hasOwnProperty(key)){
		dst[key] += ";" + value;
	}else{
		dst[key] = value;
	}
}

for (let i = 0; i < dsts.length; i++) {
	try{ fs.mkdirSync(path.join(__dirname, 'md')) }catch{}
	const dstfile = dstfilebase + `${i + 1}.json`;
	const dst = dsts[i];

	let t2 = JSON.stringify(dst);
	t2 = t2.replace(/","/g, '",\n"');
	fs.writeFileSync(dstfile, t2);
}

