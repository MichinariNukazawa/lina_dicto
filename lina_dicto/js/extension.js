'use strict';

class Extension{
	/**
	 * @brief 初期化
	 * @param 作業ディレクトリ
	 * @return 初期化の成否
	 */
	init(){
		// extensionのCSSをページに挿入する
		var css_path = "./default_extension/style.css";
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', css_path);
		document.head.appendChild(link);

		return true;
	}
};

