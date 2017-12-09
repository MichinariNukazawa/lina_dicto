'use strict';

class ExternalBrowser{
	static is_enable(){
		return true;
	}

	static open(link){
		require('electron').shell.openExternal(link)
	}

	static open_google_translate(keyword, src_lang, dst_lang){
		// ex. eo to ja, `https://translate.google.co.jp/#eo/ja/bona`
		const link = 'https://translate.google.co.jp'
			+ '/#' + src_lang
			+ '/' + dst_lang
			+ '/' + encodeURIComponent(keyword);
		this.open(link);
	}
};

