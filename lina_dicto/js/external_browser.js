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

	static create_onclick_google_translate(keyword, src_lang, dst_lang)
	{
		let element = create_span_from_text('(goto google translate)');

		element.classList.add('goto-google-translate-button');
		element.addEventListener('click', function(e){
			e.preventDefault();

			ExternalBrowser.open_google_translate(keyword, src_lang, dst_lang);

			document.getElementById('query-area__query-input__input').focus();
		}, true);

		return element;
	}

};

