'use strict';

/*export default*/ class EsperantoLanguage{
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
			let str = read_textfile('dictionary/esperanto/legumin.txt');
			return str;
		}else if(0 === keyword.indexOf(":gvidilo")){
			let str = read_textfile('dictionary/esperanto/gvidilo.txt');
			return str;
		}else 


		return null;
	}

	get_command_list(){
		return [":legumin", ":gvidilo"];
	}

};

