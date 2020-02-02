辞書データについて
====

本ディレクトリに収録されている辞書データは、以下サイト様よりダウンロードしたものを改変して使用させて頂きました。  
すばらしい辞書データを公開して頂き感謝致します。  
http://www.vastalto.com/jpn/  


# 変更履歴
辞書データの項目等に対する、lina_dictoシリーズ独自の変更の履歴は以下の通りです。  

## SukeraSparoに関する単語を追加
SukeraSparoタグを追加し、関連単語を追加収録。  
add dictionary_data.json 'Juliamo'  
https://github.com/MichinariNukazawa/lina_dicto/commit/42c633b1  
add dictionary_data SukeraSparo kinds  
https://github.com/MichinariNukazawa/lina_dicto/commit/185e340e  

## 色名の日本語訳を追加
色名のマッチングの強化を目的に、色名の日本語訳に追加(ex. 赤 -> 赤,赤色,赤の,赤色の)  
fix not match "赤" color, dictonary data add *色 -> * (basic japanese means)  
https://github.com/MichinariNukazawa/lina_dicto/commit/65dc491f  


# 変換処理
辞書データのライセンスに従い、辞書データに対する変更点を記載します。  
以下の通り変更を加えています。  
* Shift-JISをUTF-8に変換した
* 改行コードをCRLFからLFに変換した
* 元のテキストフォーマットから、見出し語と訳語を切り分けたJSONに変換した

## 変換手順
githubよりlina_dicto (for desktop)プロジェクトを取得。  
`git clone git@github.com:MichinariNukazawa/lina_dicto.git`  

取得元から、上記のデータ変換処理をした辞書ファイルを生成。  
`make dictionary_source`  

lina_dicto独自の変更を追加した辞書データから、実行用の辞書ファイルを生成。  
`make dictionary`  

iOS版固有辞書ファイルを作成。  
`make dictionary_ios`  

