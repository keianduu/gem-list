/* app/page.js */
import Link from "next/link";
import Image from "next/image";
import MasonryGrid from "@/components/MasonryGrid";
import CategorySlider from "@/components/CategorySlider"; // ★追加
import { client } from "@/libs/microcms";

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      queries: { limit: 100, orders: "-publishedAt" },
      customRequestInit: { next: { revalidate: 60 } } 
    });
    return data.contents;
  } catch (err) {
    console.error("Archive fetch error:", err);
    return [];
  }
}

// カテゴリ取得
async function getCategories() {
  try {
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: { filters: 'isVisible[equals]true', limit: 100 },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    return [];
  }
}

export default async function Home() {
  const archives = await getArchives();
  const categories = await getCategories();

  // MasonryGrid用にデータを整形
  const items = archives.map((content) => {
    const isProduct = content.type.includes('product');
    return {
      id: content.slug,
      type: isProduct ? 'product' : 'journal',
      name: content.title,
      price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
      desc: content.description,
      image: isProduct ? content.thumbnailUrl : content.thumbnail,
      link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
    };
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
        <div className="header-icons">
          {/* アイコン類が必要であれば記述 */}
        </div>
      </header>

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
          
          {/* ▼▼▼ 復活: 検索バー ▼▼▼ */}
          <div className="hero-search-wrapper">
            <div className="hero-search-container">
              <svg className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" className="hero-search-input" placeholder="宝石名、色などで検索..." />
            </div>
          </div>
          {/* ▲▲▲ ここまで ▲▲▲ */}
        </div>

        <div className="hero-bottom-categories">
          {/* ▼▼▼ 復活: スライダーコンポーネント呼び出し ▼▼▼ */}
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
        {items.length > 0 ? (
          <MasonryGrid items={items} />
        ) : (
          <p style={{textAlign:"center", padding: "40px", color: "#999"}}>No Contents...</p>
        )}
      </main>

      <footer className="gem-footer">
        <Link href="/" className="footer-logo-container">
          <span className="logo-main">Jewelism</span>
          <span className="logo-sub">MARKET</span>
        </Link>
        <div className="footer-links">
           <Link href="#">ブランドについて</Link>
           <Link href="#">お問い合わせ</Link>
           <Link href="#">プライバシーポリシー</Link>
           <Link href="#">特定商取引法に基づく表記</Link>
        </div>
        <p className="copyright">&copy; 2025 Jewelism Market. All Rights Reserved.</p>
      </footer>
    </>
  );
}