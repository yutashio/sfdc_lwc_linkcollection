import { LightningElement, api } from 'lwc';
import linkCollectionData from '@salesforce/resourceUrl/linkCollectionData';

export default class LinkCollection extends LightningElement {
	@api title; //コンポーネントのタイトル
	@api collectionKey; //JSONファイルの配列のキー名
	@api isCollapsible = false; //折り畳みの有効化
	links = [];
	error;

	connectedCallback() {
		//キーの取得確認
		if(this.collectionKey == undefined || this.collectionKey == null || this.collectionKey == ''){
			this.error = 'コレクションキーを設定してください。';
			return;
		}

		//静的リソース「linkCollectionData」の取得確認
		if (!linkCollectionData) {
			this.error = '組織に静的リソース「linkCollectionData」が存在しません。';
			return;
		}

		const key = this.collectionKey; // ← キーを使用してリンク集を出し分け

		fetch(linkCollectionData)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`静的リソースの取得に失敗しました。 \n (ステータスコード: ${response.status})`);
				}
				return response.text();
			})
			.then((rawText) => {
				let jsonData;
				try {
					jsonData = JSON.parse(rawText);
				} catch (parseError) {
					this.error = `JSONの構文に誤りがあります。\n 静的リソース「linkCollectionData」を確認してください。`;
					return;
				}

				const data = jsonData[key];
				if(data == undefined || data == null || data == ''){
					this.error = `キー "${key}" が見つかりません。\n 静的リソース「linkCollectionData」を確認してください。`;
					return;
				} else if(!Array.isArray(data)) {
					this.error = `キー "${key}" のデータが配列形式ではありません。\n 静的リソース「linkCollectionData」を確認してください。`;
					return;
				}

				//必要項目チェック
				const areLinkItemsValid  = data.every(
					item =>
						item &&
						typeof item.label === 'string' &&
						typeof item.url === 'string'
				);
				if (!areLinkItemsValid ) {
					this.error = `キー "${key}" のデータに不備があります。\n 必要な項目("label" "url")が不足しているか、形式に誤りがあります。\n 静的リソース「linkCollectionData」を確認してください。`;
					return;
				}

				// 正常データを反映
				this.links = data;
				this.error = null;
			})
			.catch((e) => {
				this.error = e;
				console.error('fetch error:', e);
			});
	}
}