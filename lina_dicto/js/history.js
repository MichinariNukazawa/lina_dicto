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

	get_statistics_string()
	{
		if(! this.is_exist_file()){
			return "statistics none.";
		}

		let s = '';
		try{
			s = fs.readFileSync(this.filepath, 'utf-8');
		}catch(err){
			return err.message;
		}

		s = s.replace(/,\s*$/, '');
		let hists = [];
		try{
			hists = JSON.parse('[' + s + ']');
		}catch(err){
			return err.message;
		}

		let map = new Map();
		const len = hists.length;
		for(let i = 0; i < len; i++){
			const keyword = hists[i]['keyword'];
			if(map.has(keyword)){
				map.set(keyword, 1);
			}else{
				let v = map.get(keyword);
				v++;
				map.set(keyword, v);
			}
		}

		let str = 'search keyword:\n' + hists.length
			+ '\nunique keyword:\n' + map.size;

		return str;
	}
}

