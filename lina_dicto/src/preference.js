'use strict';

module.exports = class Preference{
	static init(userDataPath_){
		const fs = require('fs');
		const path = require('path');

		const filepathDefaultPreference		= path.join(__dirname, '../resource/default-preference.json');
		const filepathPreference 			= Preference.get_filepath(userDataPath_);
		console.log(filepathDefaultPreference);

		let defaultPreference	= Preference.read_json_(filepathDefaultPreference);
		let preference			= Preference.read_json_(filepathPreference);
		console.log(defaultPreference, preference);
		preference = Object.assign(defaultPreference, preference);

		fs.writeFileSync(filepathPreference, JSON.stringify(preference, null, '\t'));

		// User CSS
		{
			const fileex = require('../src/fileex');
			const dst = Preference.get_filepath_user_css(userDataPath_)
			const src = path.join(__dirname, '../resource/default-user.css');
			if(! fileex.is_exist_file(dst)){
				fs.copyFileSync(src, dst);
			}
		}
	}

	static get_filepath(userDataPath_){
		const path = require('path');
		return path.join(userDataPath_, "preference.json");
	}

	static read_preference(userDataPath_){
		return Preference.read_json_(Preference.get_filepath(userDataPath_));
	}

	static delete_preference(userDataPath_){
		const filepath = Preference.get_filepath(userDataPath_);
		try{
			const fs = require('fs');
			fs.unlinkSync(filepath);
		} catch (err) {
			console.error(filepath);
			return "delete error:\n" + err.message;
		}
		return "success.";
	}

	static get_filepath_user_css(userDataPath_){
		const path = require('path');
		return path.join(userDataPath_, "user.css");
	}

	// ========
	static read_json_(path){
		const t = Preference.read_textfile_(path);
		if(!t){
			return {};
		}
		return JSON.parse(t);
	}
	static read_textfile_(filepath){
		try{
			const fs = require('fs');
			const t = fs.readFileSync(filepath, 'utf8');
			return t;
		}catch(err){
			console.debug(err);
			return undefined;
		}
	}
}