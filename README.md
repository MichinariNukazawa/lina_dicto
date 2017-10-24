lina\_dicto
====
\- Dictionary for Japanese to Esperanto -

# About
lina\_dicto は日本語/Esperanto変換を検索できる辞書アプリケーションです。  

# Screenshot/Image
![lina\_dicto](document/image/lina_dicto_0_1_3_windows.png)  

# Project goal
初学者に使いやすく、見た目がよい、クロスプラットフォームな日本語/Esperanto変換辞書アプリケーションを提供する。  

# 辞書データについて
外部の辞書データを改変し収録させて頂きました。感謝いたします。  
[data/README.md](lina_dicto/data/README.md)参照  

# Get lina\_dicto
get source:  
`git clone git@github.com:MichinariNukazawa/lina_dicto.git`  

[Download for latest release](https://github.com/MichinariNukazawa/lina_dicto/releases)  

<img src="document/image/download_link.png" width="500">  


# Donate/Buy
@todo  
Online store [project daisy bell][pixiv_booth_project_daisy_bell] and [RuneAMN fonts Pro][gumroad_runeamn_fonts_pro] is product by daisy bell.  
And please contact.  

# Environment
Linux. (Ubuntu 16.04LTS+), Windows. (64bit)  

## Build
setup:`sudo bash setup/library_for_ubuntu.sh`  
```
cd lina_dict/lina_dict/
npm run build
```

### Windows package
`bash packaging_win64.sh`  

### MacOSX package
`bash packaging_darwin.sh`  

## Develop
Depend: nodejs, electron and other npm packages.  

# Specification

## Already implement
- エス和辞書
 - インクリメンタルサーチ(検索候補表示)
 - 代用表現変換表示(^-sistemo)
 - 多代用表記対応(^-sistemo x-sistemo alfabeto)
 - 「もしかして」機能(スペルミス時の候補推定)
- 和エス辞書
 - 候補推定(ミスヒット時の部分一致候補推定)
- 簡易検索履歴
- 文章検索(エスペラント文で検索を行うと、単語毎の検索結果を表示)

## Todo
- デフォルト設定スキンのデザイン
- ユーザー設定スキン(ユーザ設定フォント)
- 検索履歴の保持

## Long Todo
やるかどうかわからないものたち  
- 語根表示(接頭辞・接尾辞解析)
- 語根推定検索
- 辞書編集機能(項目追加等)
- 辞書選択機能(辞書追加)

## License
Clause-2 BSD License  
Exclude dictionary data.(辞書ファイルは辞書ファイル毎のライセンスに準じます)  

# Contact
mail: [michinari.nukazawa@gmail.com][mailto]  
twitter: [@MNukazawa][twitter]  

Develop by Michinari.Nukazawa, in project "daisy bell".  

[pixiv_booth_project_daisy_bell]: https://daisy-bell.booth.pm/
[gumroad_runeamn_fonts_pro]: https://gumroad.com/l/UNWF
[mailto]: mailto:michinari.nukazawa@gmail.com
[twitter]: https://twitter.com/MNukazawa

