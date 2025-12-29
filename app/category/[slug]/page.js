/* app/category/[slug]/page.js */
import Link from "next/link";
import { client } from "@/libs/microcms";
import { items } from "@/libs/data"; 
import MasonryGrid from "@/components/MasonryGrid";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  return { title: `${slug} - Jewelism MARKET` };
}

export default async function CategoryPage({ params }) {
  // 1. URLの [slug] を取得
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  // 2. microCMSからデータを取得
  const data = await client.get({
    endpoint: "jewelry-categories",
    queries: { 
      filters: `slug[equals]${urlSlug}` 
    },
  });

  const category = data.contents[0];

  // カテゴリが見つからない場合の処理
  if (!category) {
    return (
      <div style={{padding: "100px 20px", textAlign:"center", minHeight: "60vh"}}>
        <h2 style={{fontSize: "2rem", marginBottom: "20px"}}>Category not found</h2>
        <p>URLスラッグ: <strong>{urlSlug}</strong></p>
        <Link href="/" style={{color: "#0058a3", textDecoration: "underline", marginTop: "20px", display: "inline-block"}}>
          トップページに戻る
        </Link>
      </div>
    );
  }

  // 3. ローカルの商品データからフィルタリング
  const categoryItems = items.filter(item => item.category === category.name);

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

      <main className="category-main">
        {/* パンくず */}
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">{category.name}</span>
          </div>
        </nav>

        {/* カテゴリ詳細ヘッダー */}
        <section className="category-header">
          <div className="category-header-icon-wrapper">
             {category.image && (
               <img src={`${category.image.url}?w=160&q=80&fm=webp`} alt={category.name} className="category-header-img" />
             )}
          </div>
          <h1 className="category-title-en">{category.name}</h1>
          <p className="category-title-ja">{category.yomigana}</p>
          
          {category.description && (
            <div 
                className="category-desc"
                dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
        </section>

        {/* インフォグラフィックセクション */}
        <section className="gem-infographic-section">
          <div className="infographic-header">
            <span className="concept-label">Encyclopedia</span>
            <h2 className="infographic-title">{category.name} Analysis</h2>
          </div>

          <div className="infographic-grid">
            
            {/* --- Mining Location カード --- */}
            <div className="info-glass-card full-width">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="info-label">Mining Location</h3>
              </div>
              
              <div className="location-flags-container">
                <div className="flag-item">
                  <span className="flag-icon">🇷🇺</span>
                  <span className="flag-name">Russia</span>
                </div>
                <div className="flag-item">
                  <span className="flag-icon">🇧🇼</span>
                  <span className="flag-name">Botswana</span>
                </div>
                <div className="flag-item">
                  <span className="flag-icon">🇨🇦</span>
                  <span className="flag-name">Canada</span>
                </div>
                <div className="flag-item">
                  <span className="flag-icon">🇦🇺</span>
                  <span className="flag-name">Australia</span>
                </div>
              </div>
            </div>

            {/* --- ROUGH STONE カード --- */}
            <div className="info-glass-card">
            {/* ヘッダー部分: アイコンとタイトル */}
            <div className="info-header-row">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="info-label">ROUGH STONE</h3>
            </div>

            {/* データ表示部分 */}
            {category.roughStones ? (
                <div className="info-content-row">
                  {/* 画像 */}
                  {category.roughStones.image && (
                    <img
                      src={`${category.roughStones.image.url}?w=150&h=150&q=80&fm=webp`}
                      alt={category.roughStones.name}
                      className="info-thumb"
                    />
                  )}
                  
                  {/* テキスト情報 */}
                  <div className="info-text-col">
                    <span className="info-main-name">{category.roughStones.name}</span>
                    <span className="info-sub-name">{category.roughStones.yomigana}</span>
                    
                    {category.roughStones.subtitle && (
                      <p className="info-desc-text">
                        {category.roughStones.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // データがない場合
                <div className="info-content">
                  <p style={{color: '#999', fontSize: '0.9rem'}}>No rough stone info.</p>
                </div>
              )}
          </div>

            {/* --- STYLING カード --- */}
            <div className="info-glass-card">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                     <circle cx="12" cy="12" r="7" />
                     <path d="M12 5V3m0 18v-2m9-7h-2M5 12H3" strokeLinecap="round" />
                     <path d="M12 5l2-2m-2 2l-2-2" />
                  </svg>
                </div>
                <h3 className="info-label">STYLING</h3>
              </div>

              <div className="info-content-row">
                <img 
                  src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=150&q=80" 
                  alt="Styling Ring" 
                  className="info-thumb"
                />
                <div className="info-text-col">
                  <span className="info-main-name" style={{ marginBottom: '8px' }}>RING</span>
                  <p className="info-desc-text">
                    モース硬度10という極めて高い耐久性を持つため、日常的に身につけるリングに最適です。
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="infographic-footer">
            {/* タグ (左寄せクラスを適用) */}
            <div className="keyword-tags left-align">
              <span>#4月</span>
              <span>#4C</span>
              <span>#アーガイル鉱山</span>
            </div>
          </div>
        </section>

        {/* 商品一覧 (Pinterest形式) */}
        <section className="category-items-container">
           {categoryItems.length > 0 ? (
             <MasonryGrid items={categoryItems} />
           ) : (
             <p style={{textAlign:"center", color:"#999", marginTop: 40}}>
               現在、関連するアイテムはありません。
             </p>
           )}
        </section>
      </main>
      
      <footer className="gem-footer">
        <p className="copyright">&copy; 2025 Jewelism Market.</p>
      </footer>
    </>
  );
}