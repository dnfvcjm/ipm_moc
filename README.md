# DN IPM Spectral Scouting Mock

農業圃場で使う「スペクトルカメラによるScouting体験」と「解析後の局所対応判断体験」を確認するためのReact/Viteモックです。

作業者は、事前に決まっている `House-01 / Lane 03` を確認し、レーン入口のQR読取Mockから80株を順番に撮影します。撮影後はピンボケ確認を行い、有効写真だけをSDカード保存MockとしてlocalStorageへ保存します。管理画面では未解析データの疑似解析、エリア別Heatmap、時間軸Heatmap、防除記録とリスク推移を確認できます。

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
- 今日の対象圃場
- レーンQR読取
- Lane 03 撮影セッション
- ピンボケ確認
- Lane 03 撮影完了
- SDカード保存データ
- 未解析データ一覧
- ハイパースペクトル解析中 / 解析結果
- エリア別リスクHeatmap
- 時間軸Heatmap
- エリア詳細
- 全体リスク推移

## 主要シナリオ

### 1. 撮影する

1. ホームで「今日の圃場を確認」を押す
2. 対象圃場と対象レーンを確認する
3. 「レーン入口へ移動した」を押す
4. QR読取Mockで `Lane 03` を取得する
5. 「撮影を開始」を押す
6. Plant 001からPlant 080まで順番に撮影する
7. ピンボケ確認で「問題なし・保存」または「ピンボケ・再撮影」を選ぶ
8. 80株分の有効写真を保存する
9. 撮影完了画面でSDカード保存Mockの状態を確認する

### 2. 解析する

1. ホームで「解析・Heatmapを見る」を押す
2. 未解析バッチを確認する
3. 「解析する」を押す
4. 通常画像とハイパースペクトル解析画像を比較する
5. 「ヒートマップで確認する」を押す

### 3. Heatmapでリスクを見る

1. Area 01からArea 27のリスク分布を見る
2. 問題写真数 / 有効写真総数と推奨ボトル数を見る
3. 時間軸スライダーで5週前から今週までを切り替える
4. Areaセルをクリックして詳細へ進む

## 使用画像

- 撮影用トマト葉画像: `public/images/tomato-leaf.jpg`
- 解析前画像: `public/images/AdobeStock_159772561-768x512.jpeg`
- ハイパースペクトル解析画像: `public/images/c033f113-f253-474d-be29-944804835778.png`

## モックとして代替しているもの

- スペクトルカメラ実機連携
- QRコード実読み取り
- SDカード実アクセス
- AI解析モデル
- 防除記録入力
- 本番DB

## GitHub管理手順

新規リポジトリへ初回pushする場合は、PowerShellで以下を実行します。

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin <GitHub repository URL>
git branch -M main
git push -u origin main
```

この作業フォルダでは、現在 `origin` は以下に設定されています。

```text
https://github.com/jmiyanaga/ipm_moc.git
```

既存の `origin` を使う場合は、`git remote add origin ...` は不要です。

## Vercel公開設定

VercelでGitHubリポジトリをImportし、以下の設定でDeployしてください。

| 項目 | 設定値 |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

`vercel.json` で全パスを `index.html` にrewriteしているため、`/heatmap` や `/area/Area%2010` などのReact Router URLを直接開いても表示できます。

## 今後の更新手順

```powershell
npm.cmd run build
git add .
git commit -m "update"
git push
```

`main` ブランチにpushすると、VercelのGitHub連携により自動デプロイされます。

## 今後の拡張候補

- 実QR読取
- 実SDカード / ファイル取り込み
- スペクトルカメラ連携
- 実AI解析API連携
- 防除記録入力画面
- 作業指示・タスク連携
- オフライン対応
- 圃場全体マップ連携
