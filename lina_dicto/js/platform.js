'use strict';
/** 環境依存の機能をここに書く(非electron環境で機能拡張する等) */

// const remote = require('electron').remote;
// const Menu = remote.Menu;

class Platform{
	init()
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

		window.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			menu.popup(remote.getCurrentWindow());
		}, false);

		return true;
	}

	get_platform_name(){
		return "electron";
	}
};

