'use strict';

const fs = require('fs');

module.exports = class History{
	constructor(userDataPath){
		//const {app} = require('electron').remote;

		const path = require('path');

		this.filepath = path.join(userDataPath, 'history.log');
		console.debug("history:" + this.filepath);

		this.history_index = -1;
	}

	reset_history_index()
	{
		this.history_index = -1;
	}

	increment_history_index()
	{
		this.history_index++;
		const len = this.get_history_data_length_();
		if(len <= this.history_index){
			this.history_index = ((0 === len)? 0 : len - 1);
		}
	}

	decrement_history_index()
	{
		this.history_index--;
		if(this.history_index < 0){
			this.history_index = 0;
		}
	}

	get_history_index()
	{
		return this.history_index;
	}

	get_history_item_from_index(index)
	{
		let err = {};
		const hists = this.read_history_data_from_file_(err);
		if(null === hists){
			return null;
		}

		index = (hists.length - 1) - index;
		if(index < 0 || hists.length <= index){
			return null;
		}

		return hists[index];
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
		this.reset_history_index();

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
			if(err){
				throw err;
			}
			// console.debug('The "data to append" was appended to file!');
		});
	}

	get_history_data_length_()
	{
		let err = {};
		const hists = this.read_history_data_from_file_(err);
		if(null === hists){
			return 0;
		}

		return hists.length;
	}

	read_history_data_from_file_(err)
	{
		if(! this.is_exist_file()){
			err.message = "statistics none.";
			return null;
		}

		let s = '';
		try{
			s = fs.readFileSync(this.filepath, 'utf-8');
		}catch(err){
			err.message = err.message;
			return null;
		}

		s = s.replace(/,\s*$/, '');
		let hists = [];
		try{
			hists = JSON.parse('[' + s + ']');
		}catch(err){
			err.message = err.message;
			return null;
		}

		return hists;
	}

	get_statistics_string()
	{
		let err = {};
		const hists = this.read_history_data_from_file_(err);
		if(null === hists){
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

