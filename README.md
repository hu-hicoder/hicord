# Hicord

Hicord は、「位置」の概念を取り入れた新感覚のボイスチャットツールです。

使いやすさを追及した様々な新機能を備えています。

## Getting Started

### 初期インストール

#### Node.js のインストール

[公式サイト](https://nodejs.org/)からダウンロードしてインストールします。他にも [Volta](https://volta.sh) という CLI ツールからインストールする方法などもあります。

#### pnpm のインストール

```bash
npm install -g pnpm
pnpm add -g pnpm
```

[Volta](https://volta.sh/) を使用する場合

```bash
volta install pnpm
pnpm add -g pnpm
```

#### Dependencies のインストール

```bash
pnpm install
```

#### API キーの設定

1. [https://webrtc.ecl.ntt.com](SkyWay)にログインし、新しいアプリケーションを作成し、API キーを取得
2. `.env.example`ファイルを複製
3. ファイル名を`.env.local`に変更
4. API キーを入力

### 開発サーバを起動

```bash
pnpm dev
```

### 本番環境用のビルド

```bash
pnpm build
```
