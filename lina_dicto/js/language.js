'use strict';

module.exports = class Language{
	static get_code(){
		return 'eo';
	}

	static get_code_by_google(){
		return 'eo';
	}

	static command(keyword){
		if(0 === keyword.indexOf(":legumin")){
			let str = read_textfile('dictionary/esperanto/legumin.txt');
			return str;
		}else if(0 === keyword.indexOf(":gvidilo")){
			let str = read_textfile('dictionary/esperanto/gvidilo.txt');
			return str;
		}else if(0 === keyword.indexOf(":DictionaryChanges")){
			let str = read_textfile('dictionary/esperanto/DictionaryChanges.md');
			return str;
		}

		return null;
	}

	static get_command_list(){
		return [":legumin", ":gvidilo", ":DictionaryChanges"];
	}
};

