/* app/page.js */
import Link from "next/link";
import Image from "next/image";
import CategorySlider from "@/components/CategorySlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopContentManager from "@/components/TopContentManager";
import { client } from "@/libs/microcms";

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      // ★修正: accessory (参照フィールド) も取得するため depth を確保
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

// ★追加: アクセサリマスター取得
async function getAccessories() {
  try {
    const data = await client.get({
      endpoint: "accessories",
      queries: { limit: 100 },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Accessories fetch error:", err);
    return [];
  }
}

export default async function Home() {
  // 並列でデータ取得
  const [archives, categories, accessories] = await Promise.all([
    getArchives(),
    getCategories(),
    getAccessories()
  ]);

// ▼▼▼ 追加: ダイヤモンドのカテゴリ情報を抽出 ▼▼▼
  // スラッグが 'diamond' のものを優先して探します
  const alexandriteCategory = categories.find(c => c.slug === 'alexandrite' || c.name === 'alexandrite');
  const alexandriteIconUrl = alexandriteCategory?.image?.url;
  const moonstoneCategory = categories.find(c => c.slug === 'moonstone' || c.name === 'moonstone');
  const moonstoneIconUrl = moonstoneCategory?.image?.url;
  const diamondCategory = categories.find(c => c.slug === 'diamond' || c.name === 'Diamond');
  const diamondIconUrl = diamondCategory?.image?.url;
  // ▲▲▲ 追加ここまで ▲▲▲

  // MasonryGrid用にデータを整形
  const items = archives.map((content) => {
    const isProduct = content.type.includes('product');
    const relatedCategory = content.relatedJewelries?.[0];
    const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
    const categoryIcon = relatedCategory?.image?.url || null;

    // ★追加: アクセサリ情報の取得 (archive APIに accessory フィールドがある前提)
    // 参照フィールドが配列か単体かで処理を分けますが、基本は単体を想定
    const relatedAccessory = Array.isArray(content.accessory) 
      ? content.accessory[0] 
      : content.accessory;
    
    const accessoryName = relatedAccessory?.name || null;

    return {
      id: content.slug,
      type: isProduct ? 'product' : 'journal',
      name: content.title,
      price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
      rawPrice: isProduct && content.price ? Number(content.price) : 0,
      desc: content.description,
      image: isProduct ? content.thumbnailUrl : content.thumbnail,
      link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
      category: categoryName,
      categoryIcon: categoryIcon,
      accessory: accessoryName, // ★フィルタ用に追加
    };
  });

  return (
    <>
      <SiteHeader />

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
          
          <div className="hero-search-wrapper">
            <div className="hero-search-container">
              <svg className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" className="hero-search-input" placeholder="宝石名、色などで検索..." />
            </div>
            <Link href="/category" className="hero-search-sublink">
              
              {diamondIconUrl ? (
                /* APIから取得した画像がある場合 */
                <Image 
                  src={diamondIconUrl} 
                  alt="Diamond" 
                  width={20} 
                  height={20} 
                  style={{ objectFit: 'contain', marginRight: '2px' }}
                />
              ) : (
                /* フォールバック用（データがない場合）のSVG */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
                </svg>
              )}
              {alexandriteIconUrl ? (
                /* APIから取得した画像がある場合 */
                <Image 
                  src={alexandriteIconUrl} 
                  alt="Alexandrite" 
                  width={20} 
                  height={20} 
                  style={{ objectFit: 'contain', marginRight: '2px' }}
                />
              ) : (
                /* フォールバック用（データがない場合）のSVG */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
                </svg>
              )}
              {moonstoneIconUrl ? (
                /* APIから取得した画像がある場合 */
                <Image 
                  src={moonstoneIconUrl} 
                  alt="Moonstone" 
                  width={20} 
                  height={20} 
                  style={{ objectFit: 'contain', marginRight: '2px' }}
                />
              ) : (
                /* フォールバック用（データがない場合）のSVG */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
                </svg>
              )}
              <span>View All Gemstones</span>
              
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="hero-bottom-categories">
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
        {/* ★修正: accessories も渡す */}
        <TopContentManager 
          initialItems={items} 
          categories={categories} 
          accessories={accessories}
        />
      </main>

      <SiteFooter />
    </>
  );
}