'use strict';


/** 非electron環境で機能拡張等するための機構なので、electronターゲットの本環境では何もしない */
class Platform{
	init()
	{
		return true;
	}

	get_platform_name(){
		return "electron";
	}
};

