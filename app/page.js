import Link from "next/link";
import Image from "next/image";
// MasonryGridはTopContentManagerの中で使うのでここでは不要になりますが、念のため残しておいてもエラーにはなりません
import CategorySlider from "@/components/CategorySlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
// ★追加: これを忘れていたのがエラーの原因です
import TopContentManager from "@/components/TopContentManager";
import { client } from "@/libs/microcms";

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      // relatedJewelries (カテゴリ) を取得したいため depth を指定するか、デフォルトで取得されるか確認
      // 通常microCMSは深度1まで取得しますが、念のため
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
    // 関連カテゴリの情報を取得
    const relatedCategory = content.relatedJewelries?.[0];
    const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
    // ★追加: カテゴリのメイン画像があれば取得
    const categoryIcon = relatedCategory?.image?.url || null;

    return {
      id: content.slug,
      type: isProduct ? 'product' : 'journal',
      name: content.title,
      price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
      rawPrice: isProduct && content.price ? Number(content.price) : 0, // ★フィルタ用に追加
      desc: content.description,
      image: isProduct ? content.thumbnailUrl : content.thumbnail,
      link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
      category: categoryName,
      categoryIcon: categoryIcon, // ★追加: アイコン用URL
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
          </div>
        </div>

        <div className="hero-bottom-categories">
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
        <TopContentManager initialItems={items} categories={categories} />
      </main>

      <SiteFooter />
    </>
  );
}