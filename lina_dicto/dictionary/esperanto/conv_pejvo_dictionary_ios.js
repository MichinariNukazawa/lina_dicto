'use strict';
/**
lina_dicto_for_ios用の辞書データを生成
( https://github.com/MichinariNukazawa/lina_dicto_for_ios )
*/

const fs = require('fs');
const path = require('path');

const datafile = path.join(__dirname, 'dictionary01.json');
const dstfile = path.join(__dirname, 'dictionary_ios.json');

const t = fs.readFileSync(datafile, 'utf8');
let dict = JSON.parse(t);
let dst = [];
for (let i = 0; i < dict.length; i++) {
	if(0 == i % 5000){ console.log('progress:', i, '/', dict.length); }


	dst[i] = {
		'k': dict[i][0],
		'v': dict[i][1],
		's': dict[i][2],
	};
}
let t2 = JSON.stringify(dst);
t2 = t2.replace(/\],\[/g, "],\n[");
fs.writeFileSync(dstfile, t2);

