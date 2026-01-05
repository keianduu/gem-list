/* app/journals/[id]/page.js */
import Link from "next/link";
import Image from "next/image";
import RichTextRenderer from "@/components/RichTextRenderer";

// ★ダミーデータ
const DUMMY_JOURNAL = {
  id: "dummy-001",
  title: "宝石の女王、ルビーが秘める情熱と歴史の物語",
  description: "古代より勝利と情熱の象徴として愛されてきたルビー。その深い赤色の秘密と、知られざる歴史的背景に迫ります。ミャンマー産「ピジョン・ブラッド」の真価とは。",
  publishedAt: "2025-04-12T10:00:00Z",
  category: {
    name: "Ruby", 
    slug: "ruby",
    icon: "https://gem-list-seven.vercel.app/_next/image?url=https%3A%2F%2Fimages.microcms-assets.io%2Fassets%2F6d7124b9fc1b47d5a5579cbebaf7fa4c%2Fb00f95722ea34c478efa2fed719a56d4%2Fruby.png&w=384&q=75" 
  },
  coverImage: {
    url: "https://images.unsplash.com/photo-1639189728127-eabab9a524cd?q=80"
  },
  body: `
    <p>ルビーの語源はラテン語で「赤」を意味する「rubeus（ルベウス）」に由来します。古代インドでは「宝石の王（Ratnaraj）」と呼ばれ、戦場での勝利や長寿をもたらすと信じられていました。</p>
    <p>コランダムという鉱物の中で、クロムによって赤く発色したものだけがルビーと呼ばれ、それ以外の色はすべてサファイアに分類されます。</p>

    <h2>Recommended Item</h2>
    <p>Jewelism MARKETが厳選した、特別なコレクションをご紹介します。日常に寄り添う、確かな輝きを。</p>

    <a href="/items/ruby-ring-001" class="product-embed-card">
      <div class="embed-thumb">
        <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" alt="Ruby Ring" style="width:100%; height:100%; object-fit:cover; margin:0;" />
      </div>
      <div class="embed-info">
        <span class="embed-label">PICK UP ITEM</span>
        <h4 class="embed-title">K18 Pigeon Blood Ruby Ring - Antique Style</h4>
        <p class="embed-description">
          ミャンマー産ルビーを使用した、一点物のアンティークデザインリング。繊細なミル打ちが施されたアームに、深く鮮やかな真紅のルビーが輝きます。
        </p>
        <p class="embed-price">¥128,000</p>
        <div class="embed-btn">View Details</div>
      </div>
    </a>

    <h2>Origin & History</h2>
    <p>もっとも価値が高いとされるのは「ピジョン・ブラッド（鳩の血）」と呼ばれる深い赤色のルビーです。主にミャンマーのモゴック地方で産出されますが、近年ではモザンビーク産も高品質なものが多く流通しています。</p>
    <blockquote>
      "Ruby is the king of gems, and the gem of kings."
    </blockquote>
    <p>タイ産のルビーは鉄分を多く含むため、少し黒みがかった落ち着いた赤色が特徴です。</p>
  `
};

export async function generateMetadata({ params }) {
  return { 
    title: `${DUMMY_JOURNAL.title} - Jewelism MARKET`,
    description: DUMMY_JOURNAL.description,
  };
}

export default async function JournalPage({ params }) {
  const journal = DUMMY_JOURNAL;

  const category = journal.category || null;
  const categoryLink = category ? `/category/${category.slug}` : "/";
  const categoryName = category ? category.name : "Journal";
  const categoryIcon = category ? category.icon : null;

  const publishedDate = new Date(journal.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header className="site-header scrolled">
         <div className="header-left">
          <Link href="/" className="header-logo-container">
            <span className="logo-main">Jewelism</span>
            <span className="logo-sub">MARKET</span>
          </Link>
        </div>
      </header>

      {/* ▼▼▼ 修正: カテゴリページと同じ構造に合わせる ▼▼▼ */}
      <main className="journal-main">
        {/* パンくず（カテゴリページと全く同じクラスを使用） */}
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            {category ? (
              <Link href={categoryLink}>{categoryName}</Link>
            ) : (
              <span>Journal</span>
            )}
            <span className="separator">/</span>
            <span className="current">{journal.title}</span>
          </div>
        </nav>

        {/* 記事本体エリア（ここは中央寄せ） */}
        <article className="journal-article-container">
          
          {/* Header Area (左寄せ・700px制限) */}
          <div className="journal-header">
            <div className="journal-meta">
              <Link href={categoryLink} className="journal-category-badge">
                {categoryIcon && (
                  <img 
                    src={categoryIcon} 
                    alt="" 
                    className="category-badge-icon" 
                  />
                )}
                <span>{categoryName}</span>
              </Link>
              <span className="journal-date">{publishedDate}</span>
            </div>
            <h1 className="journal-title">{journal.title}</h1>
            <p className="journal-description">{journal.description}</p>
          </div>

          {/* Body Area (枠内) */}
          <div className="journal-content-glass">
            {journal.coverImage && (
              <div className="journal-cover-in-glass">
                <Image
                  src={journal.coverImage.url}
                  alt={journal.title}
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 820px) 100vw, 820px"
                />
              </div>
            )}
            
            <RichTextRenderer content={journal.body} />
          </div>
        </article>
      </main>

      <footer className="gem-footer">
        <p className="copyright">&copy; 2025 Jewelism Market.</p>
      </footer>
    </>
  );
}