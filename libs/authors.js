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
      bio: "Jewelism Market 編集部。\n世界中の宝石市場のトレンドや、原石の買い付け情報を発信します。",
      // 仮: ロゴなど
      image: "/images/editorial_thumb.jpg" // publicフォルダ等のパス、または絶対URL
    },
    "editorial": {
        id: "ayu_ogawa",
        nameEn: "Jewelism Editorial2",
        role: "Editor",
        bio: "Jewelism Market 編集部。\n世界中の宝石市場のトレンドや、原石の買い付け情報を発信します。",
        // 仮: ロゴなど
        image: "/images/editorial_thumb.jpg" // publicフォルダ等のパス、または絶対URL
      }
  };
  
  // 執筆者が未設定の場合のデフォルト
  export const DEFAULT_AUTHOR_ID = "kei_ando";