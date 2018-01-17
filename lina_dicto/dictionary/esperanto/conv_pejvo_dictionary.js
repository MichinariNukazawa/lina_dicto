'use strict';

const fs = require('fs');
const path = require('path');

console.log("hello!");

class EsperantoPreprocess{
	/** @brief (辞書データ内の)略号の展開 */
	expand_abbreviation(text){
		text = text
			.replace(/《転》/g, "《転義》")
			.replace(/《般》/g, "《一般語・日常語》")
			.replace(/《稀》/g, "《稀な用法》")
			.replace(/《詩》/g, "《詩語》")
			.replace(/《廃》/g, "《廃用語》")
			.replace(/《古》/g, "《古語》")
			.replace(/《俗》/g, "《俗語》")
			.replace(/《誤》/g, "《誤用》")
			.replace(/【医】/g, "【医学】")
			.replace(/【修】/g, "【修辞学】")
			.replace(/【Ｅ】/g, "【エスペラント】")
			.replace(/【商】/g, "【商業】")
			.replace(/【印】/g, "【印刷】")
			.replace(/【情】/g, "【情報科学】")
			.replace(/【運】/g, "【運動・スポーツ】")
			.replace(/【植】/g, "【植物・植物学】")
			.replace(/【映】/g, "【映画】")
			.replace(/【織】/g, "【織物】")
			.replace(/【園】/g, "【園芸】")
			.replace(/【心】/g, "【心理学】")
			.replace(/【カ】/g, "【カトリック】")
			.replace(/【神】/g, "【神学・神話】")
			.replace(/【化】/g, "【化学】")
			.replace(/【人名】/g, "【人名】")
			.replace(/【果】/g, "【果実】")
			.replace(/【数】/g, "【数学】")
			.replace(/【菓】/g, "【菓子】")
			.replace(/【政】/g, "【政治】")
			.replace(/【貨】/g, "【通貨・貨幣】")
			.replace(/【聖】/g, "【聖書】")
			.replace(/【解】/g, "【解剖学・人体】")
			.replace(/【生】/g, "【生物学】")
			.replace(/【海】/g, "【海事・船舶】")
			.replace(/【声】/g, "【音声学】")
			.replace(/【貝】/g, "【貝類】")
			.replace(/【単】/g, "【単位】")
			.replace(/【学】/g, "【学術】")
			.replace(/【地質】/g, "【地質学】")
			.replace(/【楽】/g, "【音楽】")
			.replace(/【地名】/g, "【地名】")
			.replace(/【環】/g, "【環境問題】")
			.replace(/【地理】/g, "【地理学】")
			.replace(/【キ】/g, "【キリスト教】")
			.replace(/【虫】/g, "【昆虫】")
			.replace(/【機】/g, "【機械】")
			.replace(/【鳥】/g, "【鳥類】")
			.replace(/【気】/g, "【気象】")
			.replace(/【通】/g, "【通信】")
			.replace(/【魚】/g, "【魚類】")
			.replace(/【哲】/g, "【哲学】")
			.replace(/【菌】/g, "【菌類】")
			.replace(/【鉄】/g, "【鉄道】")
			.replace(/【空】/g, "【航空】")
			.replace(/【天】/g, "【天文学】")
			.replace(/【軍】/g, "【軍事】")
			.replace(/【電】/g, "【電気】")
			.replace(/【経】/g, "【経済】")
			.replace(/【統】/g, "【統計学】")
			.replace(/【芸】/g, "【芸術】")
			.replace(/【動】/g, "【動物学】")
			.replace(/【劇】/g, "【演劇】")
			.replace(/【日】/g, "【日本事情】")
			.replace(/【建】/g, "【建築】")
			.replace(/【農】/g, "【農学】")
			.replace(/【古生】/g, "【古生物】")
			.replace(/【馬】/g, "【馬術】")
			.replace(/【古地名】/g, "【古地名】")
			.replace(/【美】/g, "【美術】")
			.replace(/【語】/g, "【言語学】")
			.replace(/【病】/g, "【病名・病理学】")
			.replace(/【光】/g, "【光学】")
			.replace(/【服】/g, "【服飾・織物】")
			.replace(/【交】/g, "【交通】")
			.replace(/【仏】/g, "【仏教】")
			.replace(/【鉱】/g, "【鉱物学】")
			.replace(/【文】/g, "【文学・詩歌】")
			.replace(/【考古】/g, "【考古学】")
			.replace(/【法】/g, "【法律】")
			.replace(/【国名】/g, "【国名】")
			.replace(/【薬】/g, "【薬学】")
			.replace(/【史】/g, "【歴史】")
			.replace(/【遊】/g, "【遊戯・ゲーム】")
			.replace(/【Ｇ】/g, "【文法】")
			.replace(/【理】/g, "【物理学】")
			.replace(/【写】/g, "【写真】")
			.replace(/【料】/g, "【料理】")
			.replace(/【車】/g, "【自動車】")
			.replace(/【論】/g, "【論理学】")
			.replace(/【社】/g, "【社会学】")
			.replace(/【イ】/g, "【イスラム】")
			.replace(/【宗】/g, "【宗教】")
			//.replace(/{Ｏ}/g, "{公認語根}")
			//.replace(/{Ｂ}/g, "{公認基礎語根}")
			.replace(/{Ｏ}/g, "")
			.replace(/{Ｂ}/g, "")
			.replace(/《Ｎ》/g, "《新語》")
			.replace(/［自］/g, "［自動詞］")
			.replace(/［他］/g, "［他動詞］")
			.replace(/［形］/g, "［形容詞］")
			.replace(/［副］/g, "［副詞］")
			.replace(/［代］/g, "［代名詞］")
			.replace(/［前］/g, "［前置詞］")
			.replace(/［接］/g, "［接続詞］")
			.replace(/［間］/g, "［間投詞］")
			.replace(/［擬］/g, "［擬態語・擬音語］")
			.replace(/［略］/g, "［略語］")
			;





		return text;
	}
};

const esperanto = new EsperantoPreprocess();

const datafile = path.join(__dirname, 'dictionary00.json');

const t = fs.readFileSync(datafile, 'utf8');
let a = esperanto.expand_abbreviation(t);
fs.writeFileSync(datafile, a);

