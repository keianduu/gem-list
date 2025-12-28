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

  // ★地図用データ（経度, 緯度の順）
  // 宝石の種類によって場所を変える場合は、本来はmicroCMSから取得するように拡張します
  const gemLocations = [
    { name: "Russia", coordinates: [105, 61] },
    { name: "Botswana", coordinates: [24, -22] },
    { name: "Canada", coordinates: [-106, 56] },
    { name: "Australia", coordinates: [133, -25] },
  ];

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
            {/* Mining Location カード */}
 
<div className="info-glass-card full-width">
  <div className="info-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  </div>
  <h3 className="info-label">Mining Location</h3>
  
  <div className="location-flags-container">
    {/* 国旗アイコン：画像を使わず、まずは絵文字や軽量なWebフォントでの対応がおすすめ */}
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

            {/* Formation カード */}
            <div className="info-glass-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="info-label">Formation</h3>
              <div className="info-content">
                <p><strong>キンバーライト:</strong> 特殊な火山岩に含まれるマグマの結晶</p>
              </div>
            </div>

            {/* Evaluation (4C) カード */}
            <div className="info-glass-card full-width">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3l9 6-9 12-9-12 9-6z" />
                </svg>
              </div>
              <h3 className="info-label">Evaluation (4C)</h3>
              <div className="info-4c-container">
                <div className="c-item"><span>Color</span><small>Dランク〜ファンシー</small></div>
                <div className="c-item"><span>Clarity</span><small>透明度・内包物</small></div>
                <div className="c-item"><span>Cut</span><small>輝きの生命線</small></div>
                <div className="c-item"><span>Carat</span><small>重量と価値</small></div>
              </div>
            </div>

            {/* Styling カード */}
            <div className="info-glass-card">
              <div className="info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <h3 className="info-label">Styling</h3>
              <div className="info-content">
                <p>Ring / Pierce / Necklace</p>
              </div>
            </div>
          </div>

          <div className="infographic-footer">
            <div className="raw-stone">
              <span className="raw-label">Rough Stone</span>
              <p>キンバレーライト / ランプロアイト</p>
            </div>
            <div className="keyword-tags">
              <span>#4月</span><span>#4C</span><span>#アーガイル鉱山</span>
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