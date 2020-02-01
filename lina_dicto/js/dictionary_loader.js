'use strict';

function dictionary_loader()
{
	const t = read_textfile('dictionary/esperanto/dictionary_data.json');
	let dict = JSON.parse(t);

	return dict;
}

