# Jewelism MARKET

歴史に磨かれた一石との出会い。洗練された宝石の世界を探索する、モダンなジュエリー・デジタル図鑑＆マーケットプレイス。

## 概要

Jewelism MARKETは、宝石の美しさ（Brilliance）からアフィリエイト購入体験につなげるサービスです
単なる商品一覧ではなく、宝石ごとの学術的データ（産出環境、原産国など）を高いデザイン性と情報性を両立させています。

## 主な機能

- **動的なカテゴリ探索**: Swiperを使用したスムーズな宝石カテゴリのナビゲーション。
- **インテリジェント・サーチ**: 宝石名や特徴による直感的な検索体験（未実装）
- **デジタル・エンサイクロペディア**: microCMSと連動した、各宝石の詳細データ表示（国旗アイコンによる原産地表示など）。
- **レスポンシブ・デザイン**: Masonryレイアウトを採用し、PC・タブレット・スマホの全デバイスでPinterest風の美しいカード表示を実現。

## 今後の展望

- 月間Traffic：1万くらいまでアフィリエイトで運用を行う（CVR 0.1%程度を見込む）
- 産地からの逆引き検索や、宝石が見られる美術館情報、宝石店などの情報も広く拡張して行く
- ブラウザベースの「お気に入り」「閲覧履歴」などを早期に実装し、後の会員化に備える
- 会員化もひとつのKPIとし、「宝石の購入意欲のあるユーザーリスト」を作る
- WEBの収益が安定してきたら、アプリを作る。アプリは宝石購入体験＋CtoCの宝石売買などを実現したい
- 同時にアフィリエイトから直接契約に切り替え、利益率を高め販売促進を行う
- これらのロードマップ踏まえ、システムのアップデートも計画しておく

## 技術スタック / システム構成

| カテゴリ | 技術 / ツール | 役割 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | Reactフレームワーク、SSR/ISR |
| **Styling** | CSS Modules / Global CSS | グラスモーフィズム、レスポンシブデザイン |
| **Headless CMS** | microCMS | コンテンツ管理（カテゴリ、宝石データ、画像） |
| **Libraries** | Swiper | カテゴリスライダー |
| | react-masonry-css | Pinterest風グリッドレイアウト |
| **Deployment** | Vercel | ホスティング、CI/CD |

## ディレクトリ構成

```text
.
├── app/
│   ├── category/[slug]/    # 宝石カテゴリ別詳細ページ
│   ├── items/[id]/         # 商品詳細ページ (Product/Item)
│   ├── journals/[id]/      # 記事詳細ページ (Journal/Article)
│   ├── globals.css         # グローバルスタイル・デザインシステム
│   └── page.js             # トップページ（ヒーローエリア・Swiper）
├── components/
│   ├── CategorySlider.js   # 共通スライダーコンポーネント
│   └── MasonryGrid.js      # 商品/記事カードのグリッド表示
├── libs/
│   ├── microcms.js         # microCMS APIクライアント設定
│   ├── constants.js        # 定数ファイル（国旗マッピング等）
│   └── data.js             # ローカルモックデータ（開発用）
├── public/                 # 静的資産（ロゴ、アイコン）
└── README.md

```

## URL設計 / ルーティング (Routing)

本プロジェクトでは、リソース管理のしやすさとSEO/ユーザー体験（UX）のバランスを考慮し、以下のハイブリッド構成を採用しています。

### URL構造とID運用ルール

URL構造はリソースごとにフラット化しつつ、IDの命名規則によってSEOと管理性を使い分けます。

| ページ種類 | URLパターン | Next.js Page | ID運用 (microCMS) | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| **Top** | `/` | `app/page.js` | - | |
| **宝石カテゴリ** | `/category/[slug]` | `app/category/[slug]/` | **宝石名 (英語)** | 例: `topaz`, `emerald` |
| **記事詳細 (Journal)** | `/journals/[id]` | `app/journals/[id]/` | **手動設定 (SEO重視)** | 記事内容を表す英単語<br>例: `topaz-history` |
| **商品詳細 (Item)** | `/items/[id]` | `app/items/[id]/` | **手動設定 (管理重視)** | 管理番号や型番<br>例: `item0001`, `R-001` |

### パンくずリスト設計 (Breadcrumbs)

URL構造はフラットですが、パンくずリストでは「どの宝石の文脈か（Encyclopedia）」を重視し、**宝石カテゴリを経由する階層構造**として表現します。

* **表示ルール**: `HOME` > `[宝石カテゴリ]` > `[詳細ページタイトル]`
* **実装ロジック**: 記事や商品データに紐付いている `category` (microCMS参照フィールド) の情報を取得し、親カテゴリへのリンクを生成します。


## microCMS データ設計 (Schema)

本プロジェクトでは、宝石カテゴリを中心に、原石データやアクセサリデータを参照・連携する設計となっています。

### 1. アクセサリAPI (`accessories`)
アクセサリの種類を管理するマスターデータです。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `name` | アクセサリ名 (英語) | テキスト | 〇 | 例: Ring |
| `yomigana` | 読み (yomigana) | テキスト | - | 例: リング |
| `slug` | スラッグ | テキスト | 〇 | 例: ring |
| `image` | アイコン画像 | 画像 | 〇 | |

### 2. 原石API (`rough-stones`)
原石（Rough Stone）の詳細情報を管理するマスターデータです。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `name` | 原石名 (英語) | テキスト | 〇 | 例: Topaz |
| `nameJa` | 原石名 (日本語) | テキスト | - | 例: 黄玉（おうぎょく） |
| `yomigana` | 読み (yomigana) | テキスト | - | 例: トパーズ |
| `subtitle` | サブタイトル | テキスト | - | 特徴の要約 |
| `description` | 説明文 | リッチエディタ | - | 詳細な解説文 (HTML) |
| `image` | 原石画像 | 画像 | 〇 | |

### 3. 宝石カテゴリAPI (`jewelry-categories`)
メインの宝石データを管理します。原石やアクセサリ情報を参照します。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `isVisible` | 表示フラグ | 真偽値 | 一覧に表示するかどうか |
| `name` | 宝石名 (英語) | テキスト | 例: Topaz |
| `nameJa` | 宝石名 (日本語) | テキスト | 例: 黄玉（おうぎょく） |
| `yomigana` | 読み | テキスト | |
| `slug` | スラッグ | テキスト | URLに使用 (例: topaz) |
| `image` | 宝石画像 | 画像 | トップページ等で使用 |
| `description` | 説明文 | リッチエディタ | カテゴリ詳細説明 |
| `roughStones` | 関連する原石 | コンテンツ参照 | 参照先API: `rough-stones` (1つ) |
| `accessories` | おすすめアクセサリ | 繰り返し | 下記のカスタムフィールドを使用 |

#### カスタムフィールド: `accessory_relation` (繰り返しフィールド内)
宝石カテゴリごとに、推奨アクセサリとその理由を設定します。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `item` | アクセサリ選択 | コンテンツ参照 | 参照先API: `accessories` |
| `description` | この宝石での特徴 | テキストエリア | その宝石ならではの注意点や魅力 |

#### カスタムフィールド: `miningLocation` (繰り返しフィールド内)
主要産地を登録します。表示時に `libs/constants.js` の辞書を参照して国旗に変換されます。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `name` | 国名 | セレクト | `libs/constants.js` に定義された英語名と一致させること |

## 画像処理・最適化 (Image Optimization)

本プロジェクトでは、パフォーマンス向上（LCP短縮）と転送量削減のため、原則として Next.js 標準の `<Image />` コンポーネントを使用します。

### `next/image` の採用理由
通常の `<img>` タグではなく `<Image />` を使用することで、以下の最適化が自動的に適用されます。

1.  **自動リサイズ & 圧縮**: アクセスするデバイス（スマホ/PC）に合わせて、最適なサイズ・WebP形式等の画像をサーバーサイドで生成・配信します。
2.  **遅延読み込み (Lazy Load)**: 画面に入っていない画像は読み込まず、初期表示速度を向上させます。
3.  **レイアウトシフトの防止**: 画像読み込み時のガタつき（CLS）を防ぎます。

### 外部画像の許可設定 (`next.config.mjs`)
microCMSやUnsplashなどの外部ドメインの画像を最適化対象とするため、以下の設定を行っています。

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io', // microCMS画像用
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ダミー画像用
      },
    ],
  },
};

## Reference

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
