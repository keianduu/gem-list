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
│   ├── globals.css         # グローバルスタイル・デザインシステム
│   └── page.js             # トップページ（ヒーローエリア・Swiper）
├── components/
│   ├── CategorySlider.js   # 共通スライダーコンポーネント
│   └── MasonryGrid.js      # 商品/記事カードのグリッド表示
├── libs/
│   ├── microcms.js         # microCMS APIクライアント設定
│   └── data.js             # ローカルモックデータ（開発用）
├── public/                 # 静的資産（ロゴ、アイコン）
└── README.md

## 今後の展望

- 月間Traffic：1万くらいまでアフィリエイトで運用を行う（CVR 0.1%程度を見込む）
- 産地からの逆引き検索や、宝石が見られる美術館情報、宝石店などの情報も広く拡張して行く
- ブラウザベースの「お気に入り」「閲覧履歴」などを早期に実装し、後の会員化に備える
- 会員化もひとつのKPIとし、「宝石の購入意欲のあるユーザーリスト」を作る
- WEBの収益が安定してきたら、アプリを作る。アプリは宝石購入体験＋CtoCの宝石売買などを実現したい
- 同時にアフィリエイトから直接契約に切り替え、利益率を高め販売促進を行う
- これらのロードマップ踏まえ、システムのアップデートも計画しておく

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
