'use strict';

// var remote = require('remote')
// var app = remote.require('app')

/*export default*/ class EsperantoLanguage{
	constructor(){
		const {app} = require('electron').remote;
		const fs = require('fs');
		const path = require('path');
	}

	readfile(filepath){
		let s = '';
		try{
			s = fs.readFileSync(filepath, 'utf-8');
		}catch(err){
			return err.message;
		}

		return s;
	}

	command(keyword){
		if(0 === keyword.indexOf(":legumin")){
			const filepath = path.join(__dirname, "dictionary/esperanto/legumin.txt");
			let str = this.readfile(filepath);
			return str;
		}else if(0 === keyword.indexOf(":gvidilo")){
			const filepath = path.join(__dirname, "dictionary/esperanto/gvidilo.txt");
			let str = this.readfile(filepath);
			return str;
		}else 


		return null;
	}

	get_command_list(){
		return [":legumin", ":gvidilo"];
	}

};

