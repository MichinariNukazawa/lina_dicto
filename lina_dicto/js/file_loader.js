'use strict';

const fs = require('fs');
const path = require('path');

function read_textfile(filepath)
{
	const datafile = path.join(__dirname, filepath);
	const t = fs.readFileSync(datafile, 'utf8');

	return t;
}


