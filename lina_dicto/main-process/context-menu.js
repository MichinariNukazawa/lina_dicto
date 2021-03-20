'use strict';
/**
@file
@brief 右クリックメニュー
*/

//! context menu (light click menu)

{
const {Menu, MenuItem, app, ipcMain} = require('electron')
let menu = new Menu();

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

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup(win, params.x, params.y)
  })
})

ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})
}

