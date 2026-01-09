/* app/page.js */
import Link from "next/link";
import Image from "next/image";
import CategorySlider from "@/components/CategorySlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopContentManager from "@/components/TopContentManager";
import HeroSearch from "@/components/HeroSearch"; // 新しい検索コンポーネント
import { client } from "@/libs/microcms";

// --- データ取得関数群 (ここが抜けていました！) ---

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      // accessory (参照フィールド) も取得するため depth を確保する必要があるかもしれません
      // depth: 1 などを queries に追加すると確実ですが、まずは現状の設定で
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
    console.error("Categories fetch error:", err);
    return [];
  }
}

// アクセサリマスター取得
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

// --- メインコンポーネント ---

export default async function Home() {
  // 並列でデータ取得
  const [archives, categories, accessories] = await Promise.all([
    getArchives(),
    getCategories(),
    getAccessories()
  ]);

  // アイテムデータの整形（検索と表示に使用）
  const items = archives.map((content) => {
    const isProduct = content.type.includes('product');
    const relatedCategory = content.relatedJewelries?.[0];
    const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
    const categoryIcon = relatedCategory?.image?.url || null;

    const relatedAccessory = Array.isArray(content.accessory) 
      ? content.accessory[0] 
      : content.accessory;
    
    const accessoryName = relatedAccessory?.name || null;

    let itemLink = `/journals/${content.slug}`; // デフォルトは記事リンク
    
    if (isProduct) {
      // アフィリエイトURLがあればそれを使う。なければ管理用詳細ページへ逃がす（エラー回避）
      itemLink = content.affiliateUrl || `/products/${content.slug}`;
    }
    
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
      accessory: accessoryName,
    };
  });

  return (
    <>
      <SiteHeader />

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
          
          {/* HeroSearchコンポーネント: 検索機能付き */}
          <HeroSearch archives={items} categories={categories} />

        </div>

        <div className="hero-bottom-categories">
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
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