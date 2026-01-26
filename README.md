# Jewelism MARKET

歴史に磨かれた一石との出会い。洗練された宝石の世界を探索する、モダンなジュエリー・デジタル図鑑＆マーケットプレイス。

## 概要

Jewelism MARKETは、宝石の美しさ（Brilliance）からアフィリエイト購入体験につなげるサービスです
単なる商品一覧ではなく、宝石ごとの学術的データ（産出環境、原産国など）を高いデザイン性と情報性を両立させています。

## 主な機能

- **動的なカテゴリ探索**: Swiperを使用したスムーズな宝石カテゴリのナビゲーション。
- **インテリジェント・サーチ**: 
  - **リアルタイムサジェスト**: 入力に合わせてカテゴリや商品を即座に提案（カテゴリは前方一致、商品は部分一致）。
  - **多軸フィルタリング**: カテゴリ、アイテム種別、価格帯、**カラー**による絞り込み。
- **デジタル・エンサイクロペディア**: microCMSと連動した、各宝石の詳細データ表示（国旗アイコンによる原産地表示など）。
- **レスポンシブ・デザイン**: PC・タブレット・スマホ全デバイス対応のMasonryグリッドレイアウト。
- **お問い合わせ機能**: Server Actions + Resend を使用したメール配信システム。
- **誕生石一覧 (Birthstone List)**: 1月から12月までの誕生石を月ごとに美しくグルーピング表示。
- **無限スクロール (Infinite Scroll)**: `IntersectionObserver` を使用した、パフォーマンス重視の商品リスト読み込み。
- **宝石診断 (Gem Diagnosis)**:
  - **インタラクティブ診断**: `Framer Motion` を活用したTinder風のカードスワイプUIによる直感的な診断体験。
  - **デュアルフェーズ**: 表層意識（20問）と深層意識（+20問: Deep Dive）の2段階構成で、ユーザーの深層心理を分析。
  - **ロジック強化**:
    - **序盤固定質問**: G属性（世界観）とR属性（役割）をバランスよく判定する質問を冒頭に配置。
    - **イレギュラー検知**: ユーザーの回答矛盾（トップ属性の否定など）を検知し、検証質問を優先的に出題する適応型アルゴリズム。
  - **相性診断 (Compatibility)**: 診断結果に基づき、相性の良い「最高の相棒」と「癒やしの相手」をリコメンド表示。microCMSと連動し、詳細なジュエルデータをカード形式で提示。
  - **レーダーチャート分析**: `Chart.js` を使用し、8つのパラメータ（情熱、知性、調和など）を可視化。


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
| **Frontend** | Next.js 16.1.1 (App Router) | Reactフレームワーク、SSR/ISR |
| **Styling** | CSS Modules / Global CSS | グラスモーフィズム、レスポンシブデザイン |
| **Headless CMS** | microCMS | コンテンツ・商品データ管理 |
| **Libraries** | Swiper, react-masonry-css, framer-motion, chart.js | UIコンポーネント / アニメーション / データ可視化 |
| **Email** | Resend | お問い合わせメール送信 |
| **Deployment** | Vercel | ホスティング、CI/CD |

## ディレクトリ構成
```text
.
├── app/
│   ├── about/              # 運営者情報・免責事項・お問い合わせフォーム
│   │   └── page.js
│   ├── category/           # [Legacy] 宝石カテゴリ関連
│   │   └── [slug]/
│   │       └── page.js
│   ├── favorites/          # お気に入り一覧ページ
│   │   └── page.js
│   ├── gems/               # 宝石一覧
│   │   ├── [slug]/         # 宝石詳細 (Encyclopedia)
│   │   │   ├── diagnosis/  # [New] 診断結果ページ
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   └── page.js         # 宝石インデックス
│   ├── journals/           # 記事詳細ページ
│   │   └── [id]/
│   │       └── page.js
│   ├── privacy-policy/     # プライバシーポリシー
│   │   └── page.js
│   ├── products/           # [管理用] 商品データ確認用 (noindex)
│   │   ├── [id]/
│   │   │   └── page.js
│   │   └── page.js
│   ├── rough-stones/       # [New] 原石一覧
│   │   ├── [id]/
│   │   │   └── page.js     # 原石詳細
│   │   └── page.js         # 原石インデックス
│   ├── search/             # [New] 検索結果ページ
│   │   └── page.js
│   ├── actions/            # Server Actions (サーバーサイド処理)
│   │   └── contact.js      # メール送信ロジック (Resend連携)
│   ├── contexts/           # [New] Global Contexts
│   │   └── DiagnosisContext.js # 診断エンジンの状態管理
│   ├── favicon.ico
│   ├── globals.css         # グローバルスタイル (Tailwind / CSS Modules / Custom CSS)
│   ├── layout.js           # 共通レイアウト (RootLayout)
│   └── page.js             # TOPページ (検索・フィルタリング・一覧表示の集約)
│
├── components/             # UIコンポーネント
│   ├── BirthstoneList.js   # [New] 誕生石一覧表示
│   ├── Breadcrumb.js       # [New] パンくずリスト
│   ├── CategorySlider.js   # カテゴリの横スクロールスライダー
│   ├── ContactForm.js      # お問い合わせフォーム (Client Component)
│   ├── FavoritesContent.js # お気に入りリスト表示
│   ├── FilterPopup.js      # 詳細絞り込みモーダル (Color/Accessory対応)
│   ├── GemStoneLinks.js    # [New] TOPページの宝石・原石一覧リンク
│   ├── HeroSearch.js       # リアルタイム検索・サジェスト機能
│   ├── diagnosis/          # [New] 診断機能関連コンポーネント
│   │   ├── DiagnosisModal.js   # 診断モーダル全体
│   │   ├── DiagnosisTrigger.js # 診断起動ボタン
│   │   ├── SwipeableCard.js    # スワイプ可能な質問カード
│   │   ├── RadarChart.js       # チャート表示
│   │   └── ResultView.js       # 簡易結果表示
│   ├── ItemCollection.js   # アイテム一覧セクションのラッパー
│   ├── MasonryGrid.js      # Masonryレイアウトの商品/記事カードグリッド
│   ├── NavigationMenu.js   # [New] 全画面ナビゲーションメニュー
│   ├── ProductsInfiniteList.js # [New] 無限スクロール対応リスト
│   ├── RichTextRenderer.js # 記事本文のレンダリング & 商品埋め込み処理
│   ├── SearchFilter.js     # 検索結果ページのフィルタリングUI
│   ├── SiteFooter.js       # 共通フッター
│   ├── SiteHeader.js       # 共通ヘッダー
│   └── TopContentManager.js# TOPページのフィルタリング状態管理・リスト表示
│
├── hooks/                  # カスタムフック
│   ├── useDiagnosisEngine.js # [New] 診断ロジック・スコアリング計算 (Client Side)
│   └── useFavorites.js     # お気に入り機能の状態管理 (LocalStorage連携)
│
├── libs/                   # ユーティリティ・定数・API設定
│   ├── authors.js          # [New] 執筆者データ
│   ├── constants.js        # 定数ファイル (国旗マッピングデータ等)
│   ├── diagnosisData.js    # [New] 診断用マスタデータ（質問・ロジック・宝石DB）
│   ├── data.js             # (旧) ダミーデータ ※現在はmicroCMSに移行済み
│   ├── meta.js             # [New] メタデータ設定
│   └── microcms.js         # microCMS APIクライアント設定 (再帰取得対応)
│
├── public/                 # 静的アセット
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs         # Next.js設定 (画像ドメイン許可等)
├── package-lock.json
├── package.json
└── README.md
```

## URL設計 / ルーティング (Routing)

本プロジェクトでは、リソース管理のしやすさとSEO/ユーザー体験（UX）のバランスを考慮し、以下のハイブリッド構成を採用しています。

### URL構造とID運用ルール

URL構造はリソースごとにフラット化しつつ、IDの命名規則によってSEOと管理性を使い分けます。

| ページ種類 | URLパターン | Next.js Page | ID運用 (microCMS) | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| **Top** | `/` | `app/page.js` | - | |
| **宝石一覧** | `/gems` | `app/gems/page.js` | - | インデックス |
| **宝石詳細** | `/gems/[id]` | `app/gems/[id]/page.js` | **宝石英名** | `ruby`, `alexandrite` 等 |
| **原石一覧** | `/rough-stones` | `app/rough-stones/page.js` | - | インデックス |
| **原石詳細** | `/rough-stones/[id]` | `app/rough-stones/[id]/page.js` | **原石英名** | `corundum` 等 |
| **検索結果** | `/search` | `app/search/page.js` | - | クエリパラメータで制御 |
| **閲覧履歴** | - | - | (Local Storage) | 将来実装予定 |
| **記事詳細 (Journal)** | `/journals/[id]` | `app/journals/[id]/` | **手動設定 (SEO重視)** | 記事内容を表す英単語<br>例: `topaz-history` |

### パンくずリスト設計 (Breadcrumbs)

URL構造はフラットですが、パンくずリストでは「どの宝石の文脈か（Encyclopedia）」を重視し、**宝石カテゴリを経由する階層構造**として表現します。

* **表示ルール (宝石詳細)**: `HOME` > `宝石図鑑` > `[宝石名]`
* **表示ルール (記事)**: `HOME` > `[宝石名]` > `[記事タイトル]`
* **実装ロジック**: `components/Breadcrumb.js` にて、パスに応じた階層を動的に生成します。


## microCMS データ設計 (Schema)

## 💎 microCMS データ設計 (Schema)

本プロジェクトは、**宝石カテゴリ (`jewelry-categories`)** を中心とし、**商品・記事 (`archive`)** がそれを参照するリレーショナルな構造を持っています。

### 1. アーカイブAPI (`archive`)
商品 (Product) と 記事 (Journal) を統合管理するメインコンテンツAPIです。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `title` | タイトル | テキスト | 〇 | 商品名または記事タイトル |
| `slug` | スラッグ | テキスト | 〇 | URL末尾 (例: `ruby-ring-001`) |
| `type` | 投稿タイプ | 複数選択 | 〇 | `product` (商品) / `journal` (記事) |
| `thumbnail` | サムネイル画像 | 画像 | - | microCMSに直接アップロードする場合 |
| `thumbnailUrl` | サムネイルURL | テキスト | - | 外部画像URLを使用する場合 (Amazon/楽天など) |
| `description` | 概要 / ディスクリプション | テキストエリア | - | 一覧表示やmeta description用 |
| `body` | 本文 | リッチエディタ | - | 記事本文。商品紹介の場合は空でも可 |
| `price` | 価格 | 数値 | - | 商品の場合のみ入力 (カンマなし数値) |
| `affiliateUrl` | アフィリエイトURL | テキスト | - | 商品の購入先リンク |
| `relatedJewelries` | 関連宝石カテゴリ | コンテンツ参照 | - | 参照先API: `jewelry-categories` (複数可) |
| `relatedAccessories` | 関連アクセサリ | コンテンツ参照 | - | 参照先API: `accessories` (複数可) |
| `color` | カラー設定 | カスタムフィールド | - | 下記 `color_table` を使用 |

#### カスタムフィールド: `color_table`
商品の色情報を管理します。フィルタリング機能（Color）で使用されます。

| フィールドID | 表示名 | 種類 | 設定値例 |
| :--- | :--- | :--- | :--- |
| `color` | カラー | セレクト(複数可) | `red`, `blue`, `green`, `white / plain`, `black`, `pink`, `yellow` 等 |

---

### 2. 宝石カテゴリAPI (`jewelry-categories`)
宝石自体の情報を管理します（図鑑用データ）。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `isVisible` | 表示フラグ | 真偽値 | 一覧に表示するかどうか |
| `name` | 宝石名 (英語) | テキスト | 例: Ruby |
| `nameJa` | 宝石名 (日本語) | テキスト | 例: 紅玉 |
| `yomigana` | 読み | テキスト | |
| `slug` | スラッグ | テキスト | URLに使用 (例: `ruby`) |
| `image` | 宝石画像 | 画像 | アイコンとして使用 |
| `description` | 説明文 | リッチエディタ | カテゴリ詳細説明 |
| `roughStones` | 関連する原石 | コンテンツ参照 | 参照先API: `rough-stones` (1つ) |
| `miningLocations` | 産地情報 | 繰り返し | 下記 `mining_locations` を使用 |
| `accessories` | おすすめアクセサリ | 繰り返し | 下記 `accessory_relation` を使用 |

#### カスタムフィールド: `mining_locations` (繰り返しフィールド内)
主要産地を登録します。表示時に `libs/constants.js` の辞書を参照して国旗に変換されます。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `name` | 国名 | セレクト | `Myanmar`, `Thailand`, `Sri Lanka`, `Brazil` 等 |

#### カスタムフィールド: `accessory_relation` (繰り返しフィールド内)
宝石カテゴリごとに、推奨アクセサリとその理由を設定します。

| フィールドID | 表示名 | 種類 | 備考 |
| :--- | :--- | :--- | :--- |
| `item` | アクセサリ選択 | コンテンツ参照 | 参照先API: `accessory` |
| `description` | この宝石での特徴 | テキストエリア | おすすめ理由や注意点 |

---

### 3. アクセサリAPI (`accessory`)
ジュエリーの種類（指輪、ネックレス等）のマスタデータです。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `name` | アクセサリ名 (英語) | テキスト | 〇 | 例: `Ring`, `Necklace`, `Brooch` |
| `yomigana` | 読み (yomigana) | テキスト | - | |
| `slug` | スラッグ | テキスト | 〇 | 例: `ring` |
| `image` | アイコン画像 | 画像 | 〇 | フィルタリングUIや図鑑ページで使用 |

---

### 4. 原石API (`rough-stones`)
原石（Rough Stone）の詳細情報を管理するマスターデータです。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| `name` | 原石名 (英語) | テキスト | 〇 | 例: Corundum |
| `nameJa` | 原石名 (日本語) | テキスト | - | 例: 鋼玉 |
| `yomigana` | 読み (yomigana) | テキスト | - | |
| `subtitle` | サブタイトル | テキスト | - | 特徴の要約 |
| `description` | 説明文 | リッチエディタ | - | 詳細な解説文 |
| `image` | 原石画像 | 画像 | 〇 | |


## 画像処理・最適化 (Image Optimization)

本プロジェクトでは、パフォーマンス向上（LCP短縮）と転送量削減のため、原則として Next.js 標準の `<Image />` コンポーネントを使用します。

### 画像タグの使い分けルール

Next.jsの `<Image />` は、`next.config.mjs` で許可されたドメイン（microCMS等）の画像しか最適化できません。
そのため、アフィリエイトリンクなど**ドメインが動的または多岐にわたる外部画像**については、例外的に標準の `<img>` タグを使用します。

| 画像の種類 | 使用タグ | 理由 |
| :--- | :--- | :--- |
| **microCMS画像** | `<Image />` | ドメイン許可済み。自動最適化・CLS防止のため必須。 |
| **静的アセット** (`/public`) | `<Image />` | 内部画像のため最適化可能。 |
| **外部URL画像** (Amazon等) | `<img />` | ドメインが不定のため、Next.jsの最適化を通さず直接表示する。 |

### 外部画像の許可設定 (`next.config.mjs`)
microCMSやUnsplashなどの外部ドメインの画像を最適化対象とするため、以下の設定を行っています。

## お問い合わせ機能 (Contact Form)

ユーザーからのお問い合わせを受け付け、管理者へメール通知を行う機能を実装しています。
microCMSのAPI制限（無料枠API数）を回避するため、外部メール配信サービス「Resend」とNext.jsのServer Actionsを組み合わせた構成を採用しています。

### 技術スタックと構成

* **Email Service**: [Resend](https://resend.com/) (API経由でのメール配信)
* **Backend**: Next.js Server Actions (サーバーサイド処理)
* **Frontend**: React Hook Form (状態管理) ※今回は標準のHTML formActionを使用

### 実装ファイル

| ファイルパス | 役割 |
| :--- | :--- |
| `app/actions/contact.js` | **Server Action**。フォームデータを受け取り、Resend APIを叩いてメールを送信するサーバーサイド関数。 |
| `components/ContactForm.js` | **Client Component**。お問い合わせフォームのUI。送信状態（送信中、完了、エラー）の管理を行う。 |
| `app/about/page.js` | フォーム設置ページ。`ContactForm` コンポーネントを呼び出して表示。 |

### 環境変数 (.env.local)

機能の動作には以下の環境変数が必要です。

```bash
RESEND_API_KEY=re_12345678...  # Resendから発行されたAPIキー
CONTACT_EMAIL=admin@example.com # お問い合わせを受信する管理者のメールアドレス

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
