'use strict';
/** 環境依存の機能をここに書く(非electron環境で機能拡張する等) */

// const remote = require('electron').remote;
// const Menu = remote.Menu;

module.exports = class Platform{
	static init()
	{
		/*
		window.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			menu.popup(remote.getCurrentWindow());
		}, false);
		*/

		return true;
	}

	static get_platform_name()
	{
		return "electron";
	}
};

