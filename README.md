# Lightning Web コンポーネント(LWC)でリンク集作ってみた。  

## はじめに  
よく使うページや外部サイトへのリンクをまとめたリンク集が欲しい時ありますよね！  

標準機能では、リッチテキストコンポーネントにリンクを作成する方法がありますが、  
リンクの数が増えてくると編集が煩雑になったり、レイアウトも縦に間延びしてしまったり、なんだか使いづらさを感じる時があります。  

「もっと見た目がよくて、メンテナンスしやすいリンク集があれば…」と思い、Lightning Web コンポーネント(LWC)で、リンク集を作ってみました。  

## イメージ  
■ 通常イメージ  
![通常イメージ](/docs/normal.png)

■ 横幅の広いエリアに設置したイメージ  
![横幅の広いエリアに設置したイメージ](/docs/wide_area.png)

■ 横幅の狭いエリアに設置したイメージ  
![横幅の狭いエリアに設置したイメージ](/docs/narrow_area.png)

## コンポーネントの概要  
このコンポーネントは、画面上にリンク一覧を表示できるカスタムコンポーネントです。  
表示するリンクの情報（ラベル・URL・アイコン）は、静的リソースとして登録したJSONファイルで管理します。  

■特徴：  
- リンク情報はJSONで定義＆管理
  - ラベル・URL・アイコンを柔軟に設定可能
- 表示内容は**コレクションキー**で切り替え
  - キーに対応するリンクリストが画面に表示されます
- リンクの編集・追加はコードの改修不要
  - 静的リソースのJSONファイルを更新するだけでOK
> [!NOTE]
> コレクションキー？？  
> ・JSONファイル内でリンクグループを識別するためのキー  
> （例 ([JSONファイルのサンプル](#jsonファイルのサンプル))：`newsLinks`、`toolLinks`）

## 静的リソース（JSONファイル）の構成と使い方
リンク集コンポーネントは、静的リソース `linkCollectionData` に登録されたJSONファイルから、リンク情報を取得して表示します。  
> [!IMPORTANT]
> 静的リソースの名前は、`linkCollectionData`で登録してください。  

### JSONファイルの構成ルール
- 最上位のキー（＝コレクションキー）ごとにリンクグループを定義します。
  - （例：`newsLinks`）  
- 各キーの値はリンク情報の配列で、各リンクは以下の形式で記述します。  
```json
"newsLinks": [
	{
		"label": "日本経済新聞",
		"url": "https://www.nikkei.com/",
		"iconName": "utility:announcement"
	}
]
````

#### 各リンクオブジェクトの項目
| 項目名 | 必須 | 説明 |
| - | - | - |
| `label` | ✅ | ラベル（リンク名） |
| `url` | ✅ | 遷移先のURL |
| `iconName` | 任意 | 表示するアイコン |
> [!IMPORTANT]
> iconName には [Salesforce Lightning Design System(SLDS)](https://www.lightningdesignsystem.com/2e1ef8501/p/83309d-icons) のアイコンを使用します（例：utility:world）  

### JSONファイルのサンプル

```json
{
	"newsLinks": [
		{ "label": "日本経済新聞", "url": "https://www.nikkei.com/", "iconName": "utility:announcement" },
		{ "label": "Yahoo!ニュース", "url": "https://news.yahoo.co.jp/", "iconName": "utility:world" },
		{ "label": "朝日新聞デジタル", "url": "https://www.asahi.com/", "iconName": "utility:news" }
	],
	"toolLinks": [
		{ "label": "GitHub", "url": "https://github.com", "iconName": "utility:apex" },
		{ "label": "Slack", "url": "https://slack.com", "iconName": "utility:chat" },
		{ "label": "Notion", "url": "https://www.notion.so/", "iconName": "utility:table" }
	]
}
```


## コンポーネントの配置と設定  
- リンク集コンポーネントは下記箇所に配置できます。
    - ホーム画面
    - レコード画面
    - ユーティリティーバー  

■配置の際は、下記を設定します。
![コンポーネントの配置](/docs/component_placement.png)
| 項目名 | 必須 | 詳細 |
| - | - | - |
| タイトル | 任意 | コンポーネントの左上にタイトルとして表示されます。 |
| コレクションキー名 | ✅ | 静的リソースに定義された JSON データ内の、リンクグループを識別するためのキー名。</br>例：`newsLinks`, `toolLinks` など。</br>このキーに対応するリンクリストが画面に表示されます。 |

## ディレクトリ構成
```
force-app
    └─main
        └─default
            ├─lwc
            │  └─linkCollection
            │          linkCollection.css
            │          linkCollection.html
            │          linkCollection.js
            │          linkCollection.js-meta.xml
            │
            └─staticresources
                    linkCollectionData.json
```
