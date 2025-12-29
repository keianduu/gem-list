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

  // ▼▼▼ 追加：表示確認用のダミーデータ ▼▼▼
  const dummyColorVariations = [
    {
      id: 1,
      name: "Color less",
      nameJa: "カラーレス",
      description: "無色透明",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&q=80&fm=webp" // ダミー: 白い宝石
    },
    {
      id: 2,
      name: "Pink",
      nameJa: "ピンク",
      description: "天然は希少",
      image: "https://images.unsplash.com/photo-1600003014608-c2ccc1570a65?w=200&q=80&fm=webp" // ダミー: ピンクの宝石
    },
    {
      id: 3,
      name: "Blue",
      nameJa: "ブルー",
      description: "現在主流。色の濃さでスカイ、スイス、ロンドンと呼び分けられる",
      image: "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=200&q=80&fm=webp" // ダミー: 青い宝石
    },
    {
      id: 4,
      name: "Sherry",
      nameJa: "シェリー（インペリアル）",
      description: "最高級とされる、赤みがかった黄金色",
      image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=200&q=80&fm=webp" // ダミー: 黄/オレンジの宝石
    }
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


        {/* インフォグラフィックセクション */ }
        <section className="gem-infographic-section">
          <div className="infographic-header">
            <span className="concept-label">Encyclopedia</span>
            <h2 className="infographic-title">{category.name} Analysis</h2>
          </div>

          <div className="infographic-grid">

            {/* --- MINING LOCATION カード (50%幅に変更) --- */}
            {/* full-width クラスを削除しました */}
            <div className="info-glass-card">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="info-label">MAJOR MINING LOCATIONS</h3>
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

            {/* --- ROUGH STONE カード (右隣に配置) --- */}
            <div className="info-glass-card">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="info-label">ROUGH STONE</h3>
              </div>

              {category.roughStones ? (
                <div className="info-content-row">
                  {category.roughStones.image && (
                    <img
                      src={`${category.roughStones.image.url}?w=150&h=150&q=80&fm=webp`}
                      alt={category.roughStones.name}
                      className="info-thumb"
                    />
                  )}
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
                <div className="info-content">
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>No rough stone info.</p>
                </div>
              )}
            </div>

            {/* --- ACCESSORY カード (100%幅・3列表示) --- */}
            {/* full-width を追加し、中身を3列レイアウトに変更 */}
            <div className="info-glass-card full-width">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="7" />
                    <path d="M12 5V3m0 18v-2m9-7h-2M5 12H3" strokeLinecap="round" />
                    <path d="M12 5l2-2m-2 2l-2-2" />
                  </svg>
                </div>
                <h3 className="info-label">ACCESSORY</h3>
              </div>

              {/* 3列レイアウトのコンテナ */}
              <div className="accessory-grid">
                
                {/* Item 1 */}
                <div className="accessory-item">
                  <img 
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&q=80" 
                    alt="Ring" 
                    className="acc-thumb" 
                  />
                  <div className="acc-text">
                    <h4>RING</h4>
                    <p>劈開性があるため、ぶつけないよう注意が必要。</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="accessory-item">
                  <img 
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&q=80" 
                    alt="Earring" 
                    className="acc-thumb" 
                  />
                  <div className="acc-text">
                    <h4>Earing</h4>
                    <p>顔色を明るく健康的に見せる効果が高い。</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="accessory-item">
                  <img 
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&q=80" 
                    alt="Ring" 
                    className="acc-thumb" 
                  />
                  <div className="acc-text">
                    <h4>RING</h4>
                    <p>劈開性があるため、ぶつけないよう注意が必要。</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="color-variation-block">
            <h3 className="color-section-title">{category.name} Color Variation</h3>
            
            <div className="color-grid">
              {dummyColorVariations.map((color) => (
                <div key={color.id} className="color-card">
                  <div className="color-img-wrapper">
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="color-img"
                    />
                  </div>
                  <div className="color-info">
                    <h4 className="color-name-en">{color.name}</h4>
                    <p className="color-name-ja">{color.nameJa}</p>
                    <p className="color-desc">{color.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="infographic-footer">
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