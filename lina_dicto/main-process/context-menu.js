'use strict';
/**
@brief 右クリックメニュー(context menu, light click menu)
*/

const {app, BrowserWindow, shell} = require('electron');
const contextMenu = require('electron-context-menu');

contextMenu({
	prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'goto google translate(external browser) for “{selection}”',
			visible: parameters.selectionText.trim().length > 0,
			click: function(){
				const keyword = parameters.selectionText
				if(0 == keyword){
					alert("text no selected");
					return;
				}

				const Esperanto = require('../src/esperanto')
				const Language = require('../src/language')
				const ExternalBrowser = require('../src/external_browser')

				const isEsp = Esperanto.is_esperanto_string(keyword);
				const src_lang = (isEsp ? Language.get_code_by_google() : 'ja');
				const dst_lang = ((! isEsp) ? Language.get_code_by_google() : 'ja');
				const link = ExternalBrowser.get_google_translate_url(keyword, src_lang, dst_lang);
				require('electron').shell.openExternal(link);
			}
		}
	]
});