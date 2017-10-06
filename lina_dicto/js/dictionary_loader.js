'use strict';

const fs = require('fs');
const path = require('path');

function dictionary_loader()
{
	const datafile = path.join(__dirname, 'data/dictionary00.json');
	const t = fs.readFileSync(datafile, 'utf8');
	let dict = JSON.parse(t);

	return dict;
}

