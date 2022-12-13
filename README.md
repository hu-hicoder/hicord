# Hicord

Hicord は、「位置」の概念を取り入れた新感覚のボイスチャットツールです。

使いやすさを追及した様々な新機能を備えています。

![](/docs/hicord-poster.png)

## 関連記事

- [サークル用のボイスチャットアプリ開発のために、ふれっしゅ IT あわ～どへ参加した話](https://bkbkb.net/articles/hicord-and-fresh-it-award)

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

1. [SkyWay](https://webrtc.ecl.ntt.com)にログインし、新しいアプリケーションを作成し、API キーを取得
   - ローカル環境で試す場合は利用可能ドメイン名に`localhost`を入力
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
