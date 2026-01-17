/* libs/meta.js */

export const SITE_NAME = "Jewelism MARKET";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jewelism-market.com";
export const SITE_DESCRIPTION = "宝石や原石、鉱石に秘められた歴史や物語を、図鑑をめくるようなコラムでご紹介します。Jewelism Marketが大切にしているのは、スペックよりも石との「出会い」。奥深い宝石の世界を、もっと身近に、もっと気楽に楽しんでみませんか。";
export const SITE_OG_IMAGE = "https://images.microcms-assets.io/assets/6d7124b9fc1b47d5a5579cbebaf7fa4c/83bede7f39f5448e88f41b4c4403804e/ogp_jewelism_market.png";

// 静的ページのメタデータ定義
export const PAGE_METADATA = {
  top: {
    title: "Jewelism MARKET - 宝石の世界を、もっと身近に。", // テンプレートで " | Jewelism MARKET" が付く
    description: SITE_DESCRIPTION,
  },
  search: {
    title: "Search Collections - 全ての宝石・記事を探す",
    description: "ジュエリー、ルース、宝石に関する読みものまで。Jewelism MARKETの全コレクションから、宝石名やカテゴリで検索できます。",
  },
  favorites: {
    title: "Your Favorites - お気に入りコレクション",
    description: "あなたが選んだ特別な宝石コレクションリスト。保存したジュエリーや記事をいつでも確認・比較できます。",
  },
  about: {
    title: "About & Disclaimer - 運営情報とコンセプト",
    description: "\"Discover the Unseen Brilliance\" 見えざる輝きを発見する。Jewelism MARKETの運営理念、免責事項、お問い合わせはこちら。",
  },
  privacy: {
    title: "Privacy Policy - プライバシーポリシー",
    description: "Jewelism MARKETにおける個人情報の取り扱い方針、利用目的、および保護に関する指針を記載しています。",
  },
};