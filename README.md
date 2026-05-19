# DN IPM Spectral Scouting Mock

農業の圃場で使う「スペクトルカメラによるScouting体験」と「病害予兆確認体験」をブラウザ上で確認するためのモックアプリです。

現場作業者がハウス内でレーン・株を選び、葉をスペクトルカメラで撮影して保存します。その後、管理者が解析結果をA/B/C/Z分類やヒートマップで確認し、重点観察や天敵散布などの判断につなげる流れを体験できます。

## 技術スタック

- React
- TypeScript
- Vite
- react-router-dom
- localStorage

## セットアップ

```powershell
npm.cmd install
```

## ローカル起動

```powershell
npm.cmd run dev
```

標準では以下のURLで確認できます。

```text
http://127.0.0.1:5173/
```

## ビルド

```powershell
npm.cmd run build
```

ビルド成果物は `dist/` に出力されます。

## 画面一覧

- ホーム
- S-01 Scouting開始
- S-02 レーン・株番号入力
- S-03 撮影ガイド
- S-04 撮影確認
- S-05 保存完了
- A-01 DN IPM Appホーム
- A-02 解析結果一覧
- A-03 分類結果表示
- A-04 ヒートマップ
- A-05 詳細確認・判断

## 主要な操作シナリオ

### シナリオ1: 撮影する

1. ホーム画面で「Scoutingを開始」を押す
2. Scouting開始画面で「Start」を押す
3. レーンNoと株Noを入力し「次へ」を押す
4. 撮影ガイドで「撮影」を押す
5. 撮影完了画面でメタデータを確認し「保存」を押す
6. 保存完了画面で「次の株へ」を押すと株Noが1つ進む

### シナリオ2: 解析結果を見る

1. ホーム画面で「解析結果を確認」を押す
2. 「スペクトルカメラ画像解析を開く」を押す
3. 解析結果一覧で「モック解析を実行」を押す
4. 「分類結果を見る」からA/B/C/Z分類を確認する
5. 「ヒートマップを見る」で圃場全体の分布を見る
6. セルをクリックして詳細確認・判断画面を開く
7. 判断メモを入力して「判断を保存」を押す

## Vercel公開手順

このプロジェクトはViteアプリです。VercelではGitHubリポジトリをImportして公開します。

VercelのProject Settingsでは以下を指定してください。

| 項目 | 設定値 |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

手順:

1. GitHubリポジトリ `https://github.com/jmiyanaga/ipm_moc` をVercelにImportする
2. Framework Presetで `Vite` を選択する
3. Build Commandが `npm run build` になっていることを確認する
4. Output Directoryが `dist` になっていることを確認する
5. Deployする

`main` ブランチにpushすると、VercelのGitHub連携により自動で再デプロイされます。

## React Router向けVercel設定

`vercel.json` で全パスを `index.html` にrewriteしています。これにより、`/admin/analysis` や `/admin/heatmap` などのURLを直接開いても404にならず、React Routerで画面を表示できます。

## GitHubへの反映例

```powershell
git add .
git commit -m "Prepare Vercel deployment"
git push
```

## 今後の更新手順

```powershell
npm.cmd run build
git add .
git commit -m "update"
git push
```

push後、Vercelが自動でビルドとデプロイを実行します。

## モックであり本番連携していないもの

- スペクトルカメラ実機連携
- AI解析モデル
- バックエンドDB
- QRコード実読み取り

## 今後の拡張候補

- 実カメラ連携
- QR読取
- オフライン対応
- API連携
- 実圃場マップ連携
- 分類モデル接続
