/* app/search/page.js */
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import TopContentManager from "@/components/TopContentManager"; // フィルタリング機能を再利用
import { client, getAllContents } from "@/libs/microcms"; // ★拡張した全件取得関数をインポート

// 全アーカイブ取得（件数制限なし）
async function getFullArchives() {
  try {
    // ページネーションを内部で回して全件取得
    const contents = await getAllContents("archive", {
      orders: "-publishedAt"
    });
    return contents;
  } catch (err) {
    console.error("Archive fetch error:", err);
    return [];
  }
}

// カテゴリ取得
async function getCategories() {
  try {
    // カテゴリも増えてきたら全件取得が必要ですが、当面は100件制限でOK（またはgetAllContentsを使用）
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
    return [];
  }
}

export const metadata = {
  title: "Search All Items - Jewelism MARKET",
  description: "全ての宝石、ジュエリー、記事からお好みのアイテムをお探しいただけます。",
};

export default async function SearchPage() {
  const [archives, categories, accessories] = await Promise.all([
    getFullArchives(),
    getCategories(),
    getAccessories()
  ]);

  // データ整形（TOPページと同様）
  const items = archives.map((content) => {
    const isProduct = content.type.includes('product');
    const relatedCategory = content.relatedJewelries?.[0];
    const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
    const categoryIcon = relatedCategory?.image?.url || null;

    const relatedAccessory = Array.isArray(content.relatedAccessories) && content.relatedAccessories.length > 0
      ? content.relatedAccessories[0] 
      : null;
    const accessoryName = relatedAccessory?.name || null;

    let itemLink = `/journals/${content.slug}`;
    if (isProduct) {
      itemLink = content.affiliateUrl || `/products/${content.slug}`;
    }

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

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Search All", path: "/search" }
  ];

  return (
    <>
      <SiteHeader />

      <main className="journal-main">
        
        {/* コンテンツ管理マネージャー (タイトルを変更して使用) */}
        <TopContentManager 
          initialItems={items} 
          categories={categories} 
          accessories={accessories}
          title="All Collections"
          subtitle={`全${items.length}件のコレクション`}
          isSearchPage={true}
        />

      </main>

      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}