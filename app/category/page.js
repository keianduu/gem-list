/* app/category/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// 全カテゴリ取得（上限を大きめに設定）
async function getAllCategories() {
  try {
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: { 
        limit: 100, 
        filters: 'isVisible[equals]true' 
      },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Categories fetch error:", err);
    return [];
  }
}

export const metadata = {
  title: "Gemstone Index - Jewelism MARKET",
  description: "取り扱い宝石カテゴリの一覧です。名前からお好みの宝石をお探しいただけます。",
};

export default async function CategoryIndexPage() {
  const categories = await getAllCategories();

  // アルファベット順にソート (A -> Z)
  const sortedCategories = categories.sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <SiteHeader />

      <main className="journal-main">
        {/* パンくずリスト */}
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">All Gemstones</span>
          </div>
        </nav>

        <section style={{ maxWidth: '1000px', margin: '40px auto 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <span style={{ 
              fontFamily: 'var(--font-en)', fontSize: '0.8rem', letterSpacing: '0.1em', 
              color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px' 
            }}>
              Encyclopedia
            </span>
            <h1 className="section-title">Gemstone Index</h1>
            <p className="section-subtitle">宝石カテゴリ一覧（A-Z）</p>
          </div>

          {sortedCategories.length > 0 ? (
            <div className="category-index-grid">
              {sortedCategories.map((cat) => (
                <Link 
                  href={`/category/${cat.slug}`} 
                  key={cat.id} 
                  className="category-index-card"
                >
                  <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '12px' }}>
                    {cat.image?.url ? (
                      <Image 
                        src={cat.image.url} 
                        alt={cat.name} 
                        fill
                        sizes="100px"
                        style={{ objectFit: 'contain' }}
                        className="category-index-thumb"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#eee', borderRadius: '50%' }}></div>
                    )}
                  </div>
                  <span className="category-index-name">{cat.name}</span>
                  {cat.yomigana && (
                    <span className="category-index-name-ja">{cat.yomigana}</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
              Category Not Found.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}