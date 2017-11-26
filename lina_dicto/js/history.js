'use strict';

// var remote = require('remote')
// var app = remote.require('app')

/*export default*/ class History{
	constructor(){

		const {app} = require('electron').remote;

		this.filepath = path.join(app.getPath('userData'), 'history.log');
		console.debug("history:" + this.filepath);
	}

	get_filepath()
	{
		return this.filepath;
	}

	is_exist_file(){
		try{
			fs.accessSync(this.filepath);
			return true;
		}catch(err){
			console.debug(err);
			return false;
		}
	}

	/** @return message string (success or error message) */
	delete_history()
	{
		if(! this.filepath){
			return "delete history is none.";
		}else{

			try{
				fs.unlinkSync(this.filepath);
			} catch (err) {
				console.error(this.filepath);
				return "delete history error:\n" + err.message;
			}
			return "success.";
		}
	}

	append_keyword(keyword, extra)
	{
		if(! this.filepath){
			console.error("");
			return;
		}

		let date = new Date();
		let strdate = date.toISOString();
		let data = {
			'keyword'	: keyword,
			'date'		: strdate,
			'extra'		: extra,
		};
		let strdata = JSON.stringify(data, null, '\t');
		fs.appendFile(this.filepath, strdata + ',\n', (err) => {
			if (err) throw err;
			console.error('The "data to append" was appended to file!');
		});
	}
}

