'use strict';

module.exports = class Preference{
	static get_filepath(){
		const fileex = require('./fileex');
		return fileex.join(app.getPath('userData'), "preference.json");
	}

	static init(){
		const fileex = require('./fileex');

		const filepathDefaultPreference = 'default-preference.json';
		const filepathPreference = Preference.get_filepath();
		let defaultPreference	= fileex.read_json(filepathDefaultPreference);
		let preference		= fileex.read_json(filepathPreference);
		//console.log(defaultPreference, preference);
		preference = Object.assign(defaultPreference, preference);

		fs.writeFileSync(filepathPreference, JSON.stringify(preference, null, '\t'));
	}

	static get_preference(){
		const fileex = require('./fileex');

		const filepathPreference = Preference.get_filepath();
		return fileex.read_json(filepathPreference);
	}

	static delete_preference(){
		const filepath = Preference.get_filepath();
		try{
			fs.unlinkSync(filepath);
		} catch (err) {
			console.error(filepath);
			return "delete error:\n" + err.message;
		}
		return "success.";
	}

	static get_filepath_user_css(){
		const fileex = require('./fileex');
		return fileex.join(app.getPath('userData'), "user.css");
	}
}

