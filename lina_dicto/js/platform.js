'use strict';
/** 環境依存の機能をここに書く(非electron環境で機能拡張する等) */

// const remote = require('electron').remote;
// const Menu = remote.Menu;

module.exports = class Platform{
	static init()
	{

		//! context menu (light click menu)
		var menu = new Menu();

		menu.append(new MenuItem({
			label: 'Copy',
			accelerator: 'CmdOrCtrl+C',
			role: 'copy'
		}));
		menu.append(new MenuItem({
			label: 'Paste',
			accelerator: 'CmdOrCtrl+V',
			role: 'paste'
		}));
		menu.append(new MenuItem({
			label: 'goto google search(external browser)',
			click: function(){
				const keyword = window.getSelection().toString();
				if(0 == keyword){
					alert("text no selected");
					return;
				}
				const link = 'https://www.google.com/search?q=' + keyword.replace(/\s+/, '+');
				//const src_lang =;
				//const dst_lang = '';
				//const link = ExternalBrowser.get_google_translate_url(
				//		keyword, src_lang, dst_lang);
				ExternalBrowser.open(link);
			}
		}));
		menu.append(new MenuItem({
			label: 'goto google translate(external browser)',
			click: function(){
				const keyword = window.getSelection().toString();
				if(0 == keyword){
					alert("text no selected");
					return;
				}
				const isEsp = Esperanto.is_esperanto_string(keyword);
				const src_lang = (isEsp ? Language.get_code_by_google() : 'ja');
				const dst_lang = ((! isEsp) ? Language.get_code_by_google() : 'ja');
				const link = ExternalBrowser.get_google_translate_url(
						keyword, src_lang, dst_lang);
				ExternalBrowser.open(link);
			}
		}));

		window.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			menu.popup(remote.getCurrentWindow());
		}, false);

		return true;
	}

	static get_platform_name()
	{
		return "electron";
	}
};

