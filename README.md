# Discussion with AI

React + TypeScript + Viteで作成した第1段階のアプリです。Cloudflare Workerの`POST /api/chat`を経由してGeminiに質問します。

## 設定

`src/config.ts`の`WORKER_API_URL`に、既存のCloudflare Worker URLを設定してください。Gemini APIキーはこのリポジトリに保存しません。

## 開発

```bash
npm install
npm run dev
```

## ビルド確認

```bash
npm run build
npm run preview
```
