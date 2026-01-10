/* app/page.js */
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import CategorySlider from "@/components/CategorySlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopContentManager from "@/components/TopContentManager";
import HeroSearch from "@/components/HeroSearch"; 
import { client } from "@/libs/microcms";

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      queries: { limit: 100, orders: "-publishedAt" },
      // キャッシュ設定を復元 (60秒)
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
      // キャッシュ設定を復元 (1時間)
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    return [];
  }
}

// アクセサリマスター取得
async function getAccessories() {
  try {
    const data = await client.get({
      endpoint: "accessory", // ★修正: accessories -> accessory (単数形に)
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
  const [archives, categories, accessories] = await Promise.all([
    getArchives(),
    getCategories(),
    getAccessories()
  ]);

  const items = archives.map((content) => {
    const isProduct = content.type.includes('product');
    const relatedCategory = content.relatedJewelries?.[0];
    const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
    const categoryIcon = relatedCategory?.image?.url || null;

    // アクセサリ紐付け
    const relatedAccessory = Array.isArray(content.relatedAccessories) && content.relatedAccessories.length > 0
      ? content.relatedAccessories[0] 
      : null;
    
    const accessoryName = relatedAccessory?.name || null;

    // URLフォールバック
    let itemLink = `/journals/${content.slug}`;
    if (isProduct) {
      itemLink = content.affiliateUrl || `/products/${content.slug}`;
    }

    // カラー情報
    let colorName = null;
    if (isProduct && content.color && Array.isArray(content.color.color)) {
      colorName = content.color.color[0] || null;
    }

    return {
      id: content.slug,
      type: isProduct ? 'product' : 'journal',
      name: content.title,
      price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
      rawPrice: isProduct && content.price ? Number(content.price) : 0,
      desc: content.description,
      image: isProduct ? content.thumbnailUrl : content.thumbnail,
      link: itemLink,
      category: categoryName,
      categoryIcon: categoryIcon,
      accessory: accessoryName,
      color: colorName, 
    };
  });

  return (
    <>
      <SiteHeader />

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
          
          <HeroSearch archives={items} categories={categories} />
        </div>

        <div className="hero-bottom-categories">
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
        <Suspense fallback={<div className="skeleton-container fade-in"><div className="skeleton-text" style={{width: '100%'}}>Loading...</div></div>}>
          <TopContentManager 
            initialItems={items} 
            categories={categories} 
            accessories={accessories}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </>
  );
}