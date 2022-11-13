'use strict';
/** 環境依存の機能をここに書く(非electron環境で機能拡張する等) */

module.exports = class Platform{
	static init()
	{
		return true;
	}

	static get_platform_name()
	{
		return "electron";
	}
};