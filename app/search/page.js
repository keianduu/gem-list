/* app/search/page.js */
import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import TopContentManager from "@/components/TopContentManager"; // フィルタリング機能を再利用
import { client, getAllContents } from "@/libs/microcms"; // ★拡張した全件取得関数をインポート
import { PAGE_METADATA } from "@/libs/meta";

// 全アーカイブ取得（件数制限なし）
async function getInitialArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      queries: {
        limit: 24, // 初期ロードは24件に制限
        orders: "-priority,-publishedAt",
        // 必要なフィールドのみ指定（軽量化維持）
        fields: "id,title,slug,publishedAt,thumbnail,thumbnailUrl,type,relatedJewelries,relatedAccessories,price,description,affiliateUrl,color,priority"
      },
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
    // カテゴリも増えてきたら全件取得が必要ですが、当面は100件制限でOK（またはgetAllContentsを使用）
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: { filters: 'isVisible[equals]true', limit: 100, fields: "id,name" },
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
      queries: { limit: 100, fields: "id,name" },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Accessories fetch error:", err); // エラーログも見やすく修正
    return [];
  }
}

export const metadata = {
  title: PAGE_METADATA.search.title,
  description: PAGE_METADATA.search.description,
  alternates: {
    canonical: '/search',
  },
};

export default async function SearchPage() {
  const [archives, categories, accessories] = await Promise.all([
    getInitialArchives(),
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

        <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}>
          <TopContentManager
            initialItems={items}
            categories={categories}
            accessories={accessories}
            title="All Collections"
            subtitle={`全${items.length}件のコレクション`}
            isSearchPage={true}
          />
        </Suspense>

      </main>

      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}