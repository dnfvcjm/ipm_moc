# DN IPM Spectral Scouting Mock

農業圃場で使う「スペクトルカメラによるScouting体験」と「解析後の局所対応判断体験」を確認するためのReact/Viteモックです。

現場作業者は、事前に決まっている `House-01 / Lane 03` を確認し、レーン入口のQR読取Mockから80株を順番に撮影します。撮影後はピンボケ確認を行い、有効写真だけをSDカード保存MockとしてlocalStorageに保存します。管理者画面では未解析データを疑似解析し、5m / 3株単位のArea Heatmap、週次の時間軸Heatmap、防除記録とリスク推移を確認できます。

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
8. Plant 007とPlant 042は初回のみピンボケ画像が表示される
9. 80株分の有効写真が保存される
10. 撮影完了画面でSDカード保存Mockの状態を確認する

### 2. 解析する

1. ホームで「解析・Heatmapを見る」を押す
2. 未解析バッチを確認する
3. 「未解析データを解析」を押す
4. 写真単位に `riskScore`、`classification`、`isProblem` が付与される
5. Area単位に問題写真数 / 有効写真総数が集計される
6. バッチの解析ステータスが `解析済み` になる

### 3. Heatmapでリスクを見る

1. エリア別リスクHeatmapを開く
2. Area 01〜Area 27のリスク分布を見る
3. 問題写真数 / 有効写真総数と推奨ボトル数を確認する
4. 時間軸スライダーで5週前〜今週を切り替える
5. Areaセルをクリックして詳細へ進む

### 4. 防除効果を見る

1. エリア詳細を開く
2. 元画像とスペクトル画像を確認する
3. 防除記録で「いつ、何本撒いたか」を確認する
4. リスクグレードとボトル数の時系列チャートを見る

## 使用画像

画像URLが未指定だったため、プロジェクト内に確認用のSVGモック画像を配置しています。

- 元画像: `public/assets/images/original-leaf.svg`
- ピンボケ元画像: `public/assets/images/original-leaf-blur.svg`
- スペクトル画像: `public/assets/images/spectral-leaf.svg`

実画像が入手できた場合は、同じパスに差し替えるか、`src/data/appConfig.ts` の `IMAGE_PATHS` を更新してください。

## モックとして代替しているもの

- スペクトルカメラ実機連携
- QRコード実読み取り
- SDカード実アクセス
- AI解析モデル
- 防除記録入力
- 本番DB

## 今後の拡張候補

- 実QR読取
- 実SDカード / ファイル取り込み
- スペクトルカメラ連携
- 実AI解析API連携
- 防除記録入力画面
- 作業指示・タスク連携
- オフライン対応
- 圃場全体マップ連携

## Vercel公開設定

VercelでGitHubリポジトリをImportする場合は、以下の設定にしてください。

対象リポジトリ:

```text
https://github.com/jmiyanaga/ipm_moc
```

| 項目 | 設定値 |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

`vercel.json` で全パスを `index.html` にrewriteしているため、`/heatmap` や `/area/Area%2010` などのReact Router URLを直接開いても表示できます。

## 更新手順

```powershell
npm.cmd run build
git add .
git commit -m "update"
git push
```

`main` ブランチにpushすると、VercelのGitHub連携により自動デプロイされます。
