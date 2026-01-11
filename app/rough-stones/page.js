/* app/rough-stones/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";

// 全原石取得
async function getAllRoughStones() {
  try {
    const data = await client.get({
      endpoint: "rough-stones",
      queries: { 
        limit: 100, 
        // filters: 'isVisible[equals]true' // 原石APIにisVisibleがある場合は有効化
      },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Rough stones fetch error:", err);
    return [];
  }
}

export const metadata = {
  title: "Rough Stones Index - Jewelism MARKET",
  description: "宝石の原点である原石（Rough Stones）の一覧です。",
};

export default async function RoughStoneIndexPage() {
  const roughStones = await getAllRoughStones();

  // アルファベット順にソート (A -> Z)
  const sortedRoughStones = roughStones.sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Rough Stones", path: "/rough-stones" } 
  ];
  
  return (
    <>
      <SiteHeader />

      <main className="journal-main">

        <section style={{ maxWidth: '1000px', margin: '40px auto 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <span style={{ 
              fontFamily: 'var(--font-en)', fontSize: '0.8rem', letterSpacing: '0.1em', 
              color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px' 
            }}>
              Encyclopedia
            </span>
            <h1 className="section-title">Rough Stone Index</h1>
            <p className="section-subtitle">原石一覧（A-Z）</p>
          </div>

          {sortedRoughStones.length > 0 ? (
            <div className="category-index-grid">
              {sortedRoughStones.map((stone) => (
                <Link 
                  href={`/rough-stones/${stone.slug}`} 
                  key={stone.id} 
                  className="category-index-card"
                >
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '16px' }}>
                    {stone.image?.url ? (
                      <Image 
                        src={stone.image.url} 
                        alt={stone.name} 
                        fill
                        sizes="150px"
                        style={{ objectFit: 'contain' }}
                        className="category-index-thumb"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#eee', borderRadius: '50%' }}></div>
                    )}
                  </div>
                  <span className="category-index-name">{stone.name}</span>
                  {stone.yomigana && (
                    <span className="category-index-name-ja">{stone.yomigana}</span>
                  )}
                  {stone.nameJa && (
                    <span className="category-index-name-ja">{stone.nameJa}</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
              Rough Stones Not Found.
            </p>
          )}
        </section>
        
      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}