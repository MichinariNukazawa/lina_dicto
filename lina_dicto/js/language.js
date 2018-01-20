'use strict';

/*export default*/ class Language{
	static command(keyword){
		if(0 === keyword.indexOf(":legumin")){
			let str = read_textfile('dictionary/esperanto/legumin.txt');
			return str;
		}else if(0 === keyword.indexOf(":gvidilo")){
			let str = read_textfile('dictionary/esperanto/gvidilo.txt');
			return str;
		}

		return null;
	}

	static get_command_list(){
		return [":legumin", ":gvidilo"];
	}

};

