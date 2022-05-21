# Hicord
Hicordは、「位置」の概念を取り入れた新感覚のビデオチャットツールです。

使いやすさを追及した様々な新機能を備えています。

## Getting Started

### 初期インストール

#### Node.jsのインストール

#### pnpmのインストール

npmを使用している人
```
npm install -g pnpm
```

[volta](https://volta.sh/) を使用している人
```
volta install pnpm@latest
```

#### Dependenciesのインストール
```
pnpm install
```

### 実行
```
pnpm dev
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

