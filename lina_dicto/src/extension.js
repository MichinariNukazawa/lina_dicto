'use strict';

module.exports = class Extension{
	/**
	 * @brief 初期化
	 * @param 作業ディレクトリ
	 * @return 初期化の成否
	 */
	static init(){
		// extensionのCSSをページに挿入する
		let css_path = "./default_extension/style.css";
		let link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', css_path);
		document.head.appendChild(link);

		return true;
	}
};

