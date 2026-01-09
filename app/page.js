/* app/page.js */
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
      customRequestInit: { next: { revalidate: 0 } } // キャッシュ無効
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
      customRequestInit: { next: { revalidate: 0 } } // 念のため無効
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
      endpoint: "accessories", // ★ここがAPIのエンドポイント名と一致している必要があります
      queries: { limit: 100 },
      // ▼▼▼ 修正: ここもキャッシュを無効化 ▼▼▼
      customRequestInit: { next: { revalidate: 0 } } 
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

  // ▼▼▼ デバッグログ: アクセサリマスタの取得状況確認 ▼▼▼
  console.log("--------------------------------------------------");
  if (accessories.length === 0) {
    console.log("⚠️ Accessories Master List is EMPTY! (0 items)");
    console.log("   -> microCMSのAPI設定でエンドポイント名が 'accessories' か確認してください。");
  } else {
    console.log(`✅ Accessories Master List: ${accessories.length} items fetched.`);
    accessories.forEach(a => console.log(`   - Master Item: ${a.name}`));
  }
  // ▲▲▲--------------------------------------------------

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

    // ▼▼▼ デバッグログ: 商品ごとの紐付け確認 ▼▼▼
    if (isProduct) {
        if (accessoryName) {
            console.log(`   [Product] ${content.title} -> Accessory: ${accessoryName}`);
        } else {
            console.log(`   [Product] ${content.title} -> No Accessory Linked`);
        }
    }
    // ▲▲▲-------------------------------------

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
  console.log("--------------------------------------------------");

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