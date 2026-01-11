/* app/rough-stones/[slug]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import ItemCollection from "@/components/ItemCollection";
import SiteHeader from "@/components/SiteHeader"; 
import SiteFooter from "@/components/SiteFooter"; 
import Breadcrumb from "@/components/Breadcrumb";

// この原石に関連するアイテム（Journal/Product）を取得
// ロジック: 原石 -> 宝石カテゴリ(Jewelry Category) -> アイテム(Archive)
async function getRoughStoneArchives(roughStoneId) {
  if (!roughStoneId) return [];
  
  try {
    // 1. この原石を参照している宝石カテゴリを取得
    // 例: Corundum (roughStoneId) を参照している Ruby, Sapphire を探す
    const categoriesData = await client.get({
      endpoint: "jewelry-categories",
      queries: {
        filters: `roughStones[equals]${roughStoneId}`,
        limit: 20 // 1つの原石に紐づく変種は通常そこまで多くない
      }
    });

    const categoryIds = categoriesData.contents.map(c => c.id);
    if (categoryIds.length === 0) return [];

    // 2. 取得したカテゴリのいずれかに関連するアイテムを取得
    // filters: relatedJewelries[contains]cat1[or]relatedJewelries[contains]cat2...
    const filtersQuery = categoryIds
      .map(id => `relatedJewelries[contains]${id}`)
      .join('[or]');

    const archivesData = await client.get({
      endpoint: "archive",
      queries: {
        filters: filtersQuery,
        limit: 100, 
        orders: "-publishedAt",
      },
      customRequestInit: { next: { revalidate: 60 } } 
    });

    return archivesData.contents;
  } catch (err) {
    console.error("Rough stone archives fetch error:", err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  return { title: `${slug} (Rough Stone) - Jewelism MARKET` };
}

export default async function RoughStonePage({ params }) {
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  // 原石データの取得
  const data = await client.get({
    endpoint: "rough-stones",
    queries: { 
      filters: `slug[equals]${urlSlug}`,
      customRequestInit: { cache: "no-store" },
    },
  });

  const roughStone = data.contents[0];

  if (!roughStone) {
    return (
      <div style={{padding: "100px 20px", textAlign:"center", minHeight: "60vh"}}>
        <h2 style={{fontSize: "2rem", marginBottom: "20px"}}>Rough Stone not found</h2>
        <Link href="/" style={{color: "#0058a3", textDecoration: "underline"}}>Top Page</Link>
      </div>
    );
  }

  // 関連アイテム取得
  const archives = await getRoughStoneArchives(roughStone.id);

  // データ整形
  const relatedItems = archives.map((content) => {
    const isProduct = content.type.includes('product');
    // 表示用カテゴリ名は、アイテムが直接紐づいているものを優先
    const relatedCategory = content.relatedJewelries?.[0];
    const displayCategoryName = relatedCategory?.name || roughStone.name;
    const displayCategoryIcon = relatedCategory?.image?.url || null;

    return {
      id: content.slug,
      type: isProduct ? 'product' : 'journal',
      name: content.title,
      price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
      desc: content.description,
      image: isProduct ? content.thumbnailUrl : content.thumbnail,
      link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
      category: displayCategoryName,
      categoryIcon: displayCategoryIcon,
    };
  });

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Rough Stones", path: "/rough-stones" },
    { label: roughStone.name, path: `/rough-stones/${roughStone.slug}` }
  ];

  return (
    <>
      <SiteHeader />

      <main className="category-main">

        {/* ヘッダーエリア */}
        <section className="category-header">
          <div className="category-header-icon-wrapper" style={{ position: 'relative' }}>
             {roughStone.image && (
               <Image 
                 src={roughStone.image.url} 
                 alt={roughStone.name} 
                 fill
                 sizes="150px"
                 style={{ objectFit: 'contain' }}
                 className="category-header-img"
               />
             )}
          </div>
          
          <h1 className="category-title-en">{roughStone.name}</h1>
          <p className="category-title-ja">{roughStone.yomigana}</p>
          
          {roughStone.description && (
            <div 
                className="category-desc"
                dangerouslySetInnerHTML={{ __html: roughStone.description }}
            />
          )}
        </section>

        {/* 関連アイテム (Varieties Collection) */}
        <ItemCollection 
          items={relatedItems}
          title={`${roughStone.name} Varieties`}
          subtitle="Related Journals & Products"
          emptyMessage="現在、関連するアイテムはありません。"
        />
        
      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}