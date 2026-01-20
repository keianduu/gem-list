/* libs/authors.js */

export const AUTHORS = {
  // microCMSのセレクトフィールドの「値」をキーにします
  "kei_ando": {
    id: "kei_ando",
    nameEn: "Kei Ando",
    role: "Jewelry Stylist / Writer",
    bio: "ジュエリースタイリスト / ライター。\n宝石の歴史的背景や、現代のファッションに取り入れるスタイリングを提案しています。",
    // 仮: Unsplash画像 (後でmicroCMSにアップした画像のURLに書き換えてください)
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200"
  },
  "editorial": {
    id: "editorial",
    nameEn: "Jewelism Editorial",
    role: "Editor",
    bio: "Jewelism Market 編集部。宝石の「歴史」と「個性」にフォーカス。石そのものが持つ美しさと、背景にある奥深い世界をお届けします。",
    // 仮: ロゴなど
    image: "https://images.microcms-assets.io/assets/6d7124b9fc1b47d5a5579cbebaf7fa4c/f9f582de0a9a484ea82b28ec54662d0f/keiandu_A_cat_is_lying_on_the_ground_surrounded_by_crystals_a_209c6bb8-8160-4c73-a65c-4532ff850fd8_1.jpg" // publicフォルダ等のパス、または絶対URL
  },
  "editorial2": {
    id: "ayu_ogawa",
    nameEn: "月野 結絵（Tsukino Yue）",
    role: "Editor",
    bio: "ジュエリーの魅力を言葉で磨くライター。天然石の美しさやコーディネートの楽しさを、瑞々しい感性でお伝えします。現在、宝石学やトレンドを勉強中。Jewelism Marketを通じて、皆様と素敵なジュエリーとの「結び目」になれるような記事をお届けします。",
    // 仮: ロゴなど
    image: "https://images.microcms-assets.io/assets/6d7124b9fc1b47d5a5579cbebaf7fa4c/84832ef95bef40c98188e6e02f158443/ashley_neko_rabbit.png" // publicフォルダ等のパス、または絶対URL
  }
};

// 執筆者が未設定の場合のデフォルト
export const DEFAULT_AUTHOR_ID = "editorial";