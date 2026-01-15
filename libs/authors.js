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
    bio: "Jewelism Market 編集部。\n宝石の「歴史」と「個性」にフォーカス。石そのものが持つ美しさと、背景にある奥深い世界をお届けします。",
    // 仮: ロゴなど
    image: "https://images.microcms-assets.io/assets/6d7124b9fc1b47d5a5579cbebaf7fa4c/bc01b72deab54d7dbd29a26362afa93e/keiandu_httpss.mj.runM7iX73antPQ_A_cat_is_lying_on_the_ground_aedab3b0-5df5-44f7-99e7-9b768f5849eb_0.jpg" // publicフォルダ等のパス、または絶対URL
  },
  "editorial2": {
    id: "ayu_ogawa",
    nameEn: "Jewelism Editorial2",
    role: "Editor",
    bio: "Jewelism Market 編集部。\n世界中の宝石市場のトレンドや、原石の買い付け情報を発信します。",
    // 仮: ロゴなど
    image: "/images/editorial_thumb.jpg" // publicフォルダ等のパス、または絶対URL
  }
};

// 執筆者が未設定の場合のデフォルト
export const DEFAULT_AUTHOR_ID = "editorial";