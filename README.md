# Hicord

Hicordは、「位置」の概念を取り入れた新感覚のビデオチャットツールです。

使いやすさを追及した様々な新機能を備えています。

## Getting Started

### 初期インストール

#### Node.jsのインストール

#### Yarnのインストール

```bash
npm i -g corepack # Node.js < 16.10 の場合
corepack enable
yarn set version stable
```

[Volta](https://volta.sh/) を使用する場合

```bash
volta install yarn
yarn set version stable
```

#### Dependenciesのインストール

```bash
yarn install
```

### 実行

```bash
yarn dev
```

Electronが立ち上がったらOKです

### Available commands

Available commands:

```bash
"build-renderer": build and transpile Next.js layer
"build-electron": transpile electron layer
"build": build both layers
"dev": start dev version
"dist": create production electron build
"type-check": check TypeScript in project
```
