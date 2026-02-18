/* app/rough-stones/[slug]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import ItemCollection from "@/components/ItemCollection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import GemStoneLinks from "@/components/GemStoneLinks";
import { SITE_NAME } from "@/libs/meta";
import SmartRichText from "@/components/SmartRichText";

// ★追加: この原石に関連する宝石カテゴリを取得
async function getRelatedJewelryCategories(roughStoneId) {
  if (!roughStoneId) return [];
  try {
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: {
        filters: `roughStones[equals]${roughStoneId}`,
        limit: 10,
        orders: "name",
        fields: "id,slug,name,yomigana,nameJa,image"
      }
    });
    return data.contents;
  } catch (err) {
    console.error("Related categories fetch error:", err);
    return [];
  }
}

// この原石に関連するアイテム（Journal/Product）を取得
async function getRoughStoneArchives(roughStoneId) {
  if (!roughStoneId) return [];

  try {
    // 1. この原石を参照している宝石カテゴリを取得
    const categoriesData = await client.get({
      endpoint: "jewelry-categories",
      queries: {
        filters: `roughStones[equals]${roughStoneId}`,
        limit: 20
      }
    });

    const categoryIds = categoriesData.contents.map(c => c.id);
    if (categoryIds.length === 0) return [];

    // 2. 取得したカテゴリのいずれかに関連するアイテムを取得
    const filtersQuery = categoryIds
      .map(id => `relatedJewelries[contains]${id}`)
      .join('[or]');

    const archivesData = await client.get({
      endpoint: "archive",
      queries: {
        filters: filtersQuery,
        limit: 100,
        orders: "-priority,-publishedAt",
        fields: "id,title,slug,publishedAt,thumbnail,thumbnailUrl,type,price,description,affiliateUrl,relatedJewelries"
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
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  const data = await client.get({
    endpoint: "rough-stones",
    queries: { filters: `slug[equals]${urlSlug}` },
    customRequestInit: { cache: "no-store" },
  });

  const roughStone = data.contents[0];

  if (!roughStone) {
    return { title: "Rough Stone not found" };
  }

  const jaName = roughStone.nameJa ? `(${roughStone.nameJa})` : "";
  const title = `${roughStone.name} ${jaName} - 原石図鑑`;
  const description = `宝石の原点である${roughStone.name}${jaName}のデータ。結晶構造や生成環境など、鉱物としての魅力を深掘りします。`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/rough-stones/${urlSlug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: description,
      images: roughStone.image?.url ? [roughStone.image.url] : [],
    },
  };
}

export default async function RoughStonePage({ params }) {
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  // 原石データの取得
  const data = await client.get({
    endpoint: "rough-stones",
    queries: {
      filters: `slug[equals]${urlSlug}`,
      fields: "id,name,nameJa,yomigana,slug,image,description",
      customRequestInit: { cache: "no-store" },
    },
  });

  const roughStone = data.contents[0];

  if (!roughStone) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Rough Stone not found</h2>
        <Link href="/" style={{ color: "#0058a3", textDecoration: "underline" }}>Top Page</Link>
      </div>
    );
  }

  // ★追加: 関連する宝石カテゴリとアイテムを並行して取得
  const [relatedCategories, archives] = await Promise.all([
    getRelatedJewelryCategories(roughStone.id),
    getRoughStoneArchives(roughStone.id)
  ]);

  // データ整形
  const relatedItems = archives.map((content) => {
    const isProduct = content.type.includes('product');
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
            <div className="category-desc">
              <SmartRichText content={roughStone.description} />
            </div>
          )}
        </section>

        {/* ★追加: 関連する宝石カテゴリへのリンク (Derived Gemstones) */}
        {relatedCategories.length > 0 && (
          <section className="gem-infographic-section" style={{ marginTop: '20px', marginBottom: '80px' }}>
            <div className="infographic-header" style={{ marginBottom: '40px' }}>
              <span className="concept-label">RELATIONSHIP</span>
              <h2 className="infographic-title">Derived Gemstones</h2>
              <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>
                この原石から生まれる宝石たち
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/gems/${cat.slug}`}
                  className="category-index-card"
                  style={{ minWidth: '100px' }}
                >
                  <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '16px' }}>
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
                  {(cat.yomigana || cat.nameJa) && (
                    <span className="category-index-name-ja">{cat.nameJa || cat.yomigana}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <GemStoneLinks />

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