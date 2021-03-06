lina\_dicto リリーステスト
====

# esperanto単語・文章検索
## bona
期待する挙動：
- esperanto単語のkeywordで検索ヒットする(日本語訳を返す)。
``` : 表示例
`bona`
良い, 善良な, りっぱな
`bon/a`:{Ｂ}良い,善良な,りっぱな
```

## vocxo voc^o est/i
期待する挙動：
- x-sistemo入力で検索ヒットする。
- ^-sistemo入力で検索ヒットする。
- 語根区切り有り入力で検索ヒットする。
``` : 表示例
voc^o
声, 声音, 発音, （裁決時の）票, 意見, 声部, 態
`voc^/o`:{Ｂ}声,声音,発音;（裁決時の）票,意見;【楽】声部;【Ｇ】態
voc^o
声, 声音, 発音, （裁決時の）票, 意見, 声部, 態
`voc^/o`:{Ｂ}声,声音,発音;（裁決時の）票,意見;【楽】声部;【Ｇ】態
`esti`
（〜）である, いる, 存在する
`est/i`:{Ｂ}［自］（〜）である;いる,存在する
```

## bonan matenon
期待する挙動：
- esperanto単語２つからなるkeywordで検索ヒットする。
``` : 表示例
`bonan matenon`
おはよう！
`Bon/an maten/on!`:［間］おはよう！
```

## Kio estas cxi tio.
期待する挙動：
- "Kio"が大文字小文字(case)を無視してヒットする。
- 検索にヒットしない"estas"に"esti"を候補として返す(動詞型末尾変換による)。
- 文章内でもesperanto単語２つからなるkeywordで検索ヒットする。
``` : 表示例
`Kio estas ĉi tio.`
Kio
何, 何事
`kio`:{Ｂ}［代］何,何事
estas
`estas` is not match.if your search to `est/i`?
c^i tio
これ, このこと
`c^i tio`:{Ｂ}［代］これ,このこと
```

# 日本語単語検索
## 恋愛関係
期待する挙動：
- 日本語の文章(単語扱い)で検索ヒットする(esperanto単語を返す)。
``` : 表示例
`恋愛関係`
am/rilat/o
恋愛関係
```

# もしかして機能(candidates)
## kalviklo estas
esperantoの単語で検索ヒットしなかった場合  
期待する挙動：
- keywordに編集距離が近く検索ヒットする単語を「もしかして機能」する
- `goto google translete`を表示
``` : 表示例
`kalviklo` is not match. If your search to `klavikl/o`?(goto google translate)
```
``` : 正誤対応表
kalviklo	-> klaviklo	// type順番ミス( https://twitter.com/MNukazawa/status/934076015806070785 )
estas		-> esti		// 動詞末尾変換による
amlirato	-> amrilato	// 間違えやすい文字(未実装！)
```

`amlyrato`と入力すると検索ヒットせず、もしかして機能の候補に`amrilato`(`am/rilat/o`)が表示される。
[issue 4]( https://github.com/MichinariNukazawa/lina_dicto/issues/4 )  

`am/rilat/o`と入力すると検索ヒットする。  
[issue ]( https://github.com/MichinariNukazawa/lina_dicto/issues/7 )  
本アプリはslashによる語根区切りを、検索時に単に無視する。  
よって語根区切りが間違っていても検索結果に影響しない。  

空文字・半角空白文字のみの文字・全角空白文字のみの文字を入力して検索実行すると、検索されない。
[issue 5]( https://github.com/MichinariNukazawa/lina_dicto/issues/5 )  
(先頭・末尾に空白を含む有効なesperantoまたは日本語文字は検索実行できる)  

## 恋愛
日本語の文章(単語扱い)で検索ヒットしなかった場合  
期待する挙動：
- keywordを含む検索ヒットする単語を「もしかして機能」する
- `goto google translete`を表示
``` : 表示例
`恋愛`
`恋愛` is not match.if your search to `恋愛事件,恋愛関係,恋愛詩`? (goto google translate)
```

# 該当なし
## ーーーー
検索ヒットせず「もしかして機能」も該当がない場合  
期待する挙動：
- 該当なしの旨を表示
- `goto google translete`を表示
``` : 表示例
`ーーーー`
`ーーーー` is not match. (goto google translate)
```

## xxxxxx
検索ヒットせず「もしかして機能」も該当がない場合  
期待する挙動：
- 該当なしの旨を表示
- `goto google translete`を表示
``` : 表示例
`xxxxx`
`xxxxx` is not match. (goto google translate)
```

