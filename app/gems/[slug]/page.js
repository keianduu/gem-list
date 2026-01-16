/* app/gems/[slug]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import ItemCollection from "@/components/ItemCollection";
import { COUNTRY_FLAGS } from "@/libs/constants";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import GemStoneLinks from "@/components/GemStoneLinks";
import { SITE_NAME } from "@/libs/meta";

async function getCategoryArchives(categoryId) {
  if (!categoryId) return [];

  try {
    const data = await client.get({
      endpoint: "archive",
      queries: {
        filters: `relatedJewelries[contains]${categoryId}`,
        limit: 100,
        orders: "-publishedAt",
      },
      customRequestInit: { next: { revalidate: 60 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Category archives fetch error:", err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  // メタデータ生成用にデータ取得
  // (page本体と重複しますが、Next.jsが自動で重複除去(dedupe)するためパフォーマンスへの影響は軽微です)
  const data = await client.get({
    endpoint: "jewelry-categories",
    queries: { filters: `slug[equals]${urlSlug}` },
    customRequestInit: { cache: "no-store" }, // 必要に応じて調整
  });

  const category = data.contents[0];

  if (!category) {
    return { title: "Gemstone not found" };
  }

  const jaName = category.nameJa ? `(${category.nameJa})` : "";
  const title = `${category.name} ${jaName} の意味・産地・特徴`;
  const description = `${category.name}${jaName}の鉱物学的データ、主な産地、石言葉を解説。関連するジュエリーや原石の成り立ちについても紹介します。`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: description,
      images: category.image?.url ? [category.image.url] : [],
    },
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const urlSlug = decodeURIComponent(resolvedParams.slug);

  const data = await client.get({
    endpoint: "jewelry-categories",
    queries: {
      filters: `slug[equals]${urlSlug}`,
      customRequestInit: {
        cache: "no-store",
      },
    },
  });

  const category = data.contents[0];

  if (!category) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Category not found</h2>
        <p>URLスラッグ: <strong>{urlSlug}</strong></p>
        <Link href="/" style={{ color: "#0058a3", textDecoration: "underline", marginTop: "20px", display: "inline-block" }}>
          トップページに戻る
        </Link>
      </div>
    );
  }

  const archives = await getCategoryArchives(category.id);

  const categoryItems = archives.map((content) => {
    const isProduct = content.type.includes('product');
    const displayCategoryName = category.name;
    const displayCategoryIcon = category.image?.url || null;

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

  const dummyColorVariations = [
    { id: 1, name: "Color less", nameJa: "カラーレス", description: "無色透明", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0" },
    { id: 2, name: "Pink", nameJa: "ピンク", description: "天然は希少", image: "https://images.unsplash.com/photo-1600003014608-c2ccc1570a65" },
    { id: 3, name: "Blue", nameJa: "ブルー", description: "現在主流。色の濃さでスカイ、スイス、ロンドンと呼び分けられる", image: "https://images.unsplash.com/photo-1615655114865-4cc1bda5901e" },
    { id: 4, name: "Sherry", nameJa: "シェリー（インペリアル）", description: "最高級とされる、赤みがかった黄金色", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75" }
  ];

  const miningLocations = category.miningLocations || category.miningLocation || [];

  // パンくずデータ定義
  // ★修正: ここを /gems に書き換え
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "All Gemstones", path: "/gems" },
    { label: category.name, path: `/gems/${category.slug}` }
  ];

  return (
    <>
      <SiteHeader />

      <main className="category-main">

        <section className="category-header">
          {/* 1. アイコン画像 */}
          <div className="category-header-icon-wrapper" style={{ position: 'relative' }}>
            {category.image && (
              <Image
                src={category.image.url}
                alt={category.name}
                fill
                sizes="100px"
                style={{ objectFit: 'contain' }}
                className="category-header-img"
              />
            )}
          </div>

          {/* 2. 英語タイトル */}
          <h1 className="category-title-en">{category.name}</h1>

          {/* 3. 読みがな & 日本語名 (ここを追加しました) */}
          <div style={{ marginBottom: '24px' }}>
            {category.yomigana && (
              <p className="category-title-ja" style={{ marginBottom: category.nameJa ? '4px' : '0' }}>
                {category.yomigana}
              </p>
            )}
            {category.nameJa && (
              <p className="category-title-ja" style={{ marginBottom: '0' }}>
                {category.nameJa}
              </p>
            )}
          </div>

          {/* 4. 説明文 (ここが消えていないか確認してください) */}
          {category.description && (
            <div
              className="category-desc"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
        </section>

        <section className="gem-infographic-section">
          <div className="infographic-header">
            <span className="concept-label">Encyclopedia</span>
            <h2 className="infographic-title">{category.name} Analysis</h2>
          </div>

          <div className="infographic-grid">

            <div className="info-glass-card">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="info-label">MAJOR MINING LOCATIONS</h3>
              </div>
              <div className="location-flags-container">
                {miningLocations.length > 0 ? (
                  miningLocations.map((loc, index) => {
                    const rawName = loc.name;
                    const nameStr = Array.isArray(rawName) ? rawName[0] : rawName;
                    const countryName = nameStr ? String(nameStr).trim() : "";
                    const flag = COUNTRY_FLAGS[countryName] || "🌍";
                    return (
                      <div key={index} className="flag-item">
                        <span className="flag-icon">{flag}</span>
                        <span className="flag-name">{countryName}</span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#999', fontSize: '0.8rem', width: '100%', textAlign: 'center' }}>
                    No location data.
                  </p>
                )}
              </div>
            </div>

            <div className="info-glass-card">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="info-label">ROUGH STONE</h3>
              </div>
              {category.roughStones ? (
                <Link
                  href={`/rough-stones/${category.roughStones.slug}`}
                  className="info-content-row"
                  style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}
                >
                  {category.roughStones.image && (
                    <div className="rough-stone-img-wrapper">
                      <Image
                        src={category.roughStones.image.url}
                        alt={category.roughStones.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="info-text-col">
                    <span className="info-main-name">{category.roughStones.name}</span>
                    <span className="info-sub-name">{category.roughStones.yomigana}</span>
                    {category.roughStones.subtitle && (
                      <p className="info-desc-text">{category.roughStones.subtitle}</p>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="info-content">
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>No rough stone info.</p>
                </div>
              )}
            </div>

            <div className="info-glass-card full-width">
              <div className="info-header-row">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="7" />
                    <path d="M12 5V3m0 18v-2m9-7h-2M5 12H3" strokeLinecap="round" />
                    <path d="M12 5l2-2m-2 2l-2-2" />
                  </svg>
                </div>
                <h3 className="info-label">ACCESSORY</h3>
              </div>
              <div className="accessory-grid">
                {category.accessories && category.accessories.length > 0 ? (
                  category.accessories.map((acc, index) => (
                    <div key={index} className="accessory-item">
                      <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                        {acc.item?.image?.url ? (
                          <Image
                            src={acc.item.image.url}
                            alt={acc.item.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: 'contain' }}
                            className="acc-thumb"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#eee', borderRadius: '50%' }}></div>
                        )}
                      </div>
                      <div className="acc-text">
                        <h4>{acc.item?.name}</h4>
                        <p>{acc.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#999', fontSize: '0.8rem', padding: '10px 0' }}>
                    No accessory data available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* <div className="color-variation-block">
            <h3 className="color-section-title">{category.name} Color Variation</h3>
            <div className="color-grid">
              {dummyColorVariations.map((color) => (
                <div key={color.id} className="color-card">
                  <div className="color-img-wrapper" style={{ position: 'relative', height: '60px', width: '100%' }}>
                    <Image 
                      src={color.image} 
                      alt={color.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'contain' }}
                      className="color-img"
                    />
                  </div>
                  <div className="color-info">
                    <h4 className="color-name-en">{color.name}</h4>
                    <p className="color-name-ja">{color.nameJa}</p>
                    <p className="color-desc">{color.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* <div className="infographic-footer">
            <div className="keyword-tags left-align">
              <span>#4月</span>
              <span>#4C</span>
              <span>#アーガイル鉱山</span>
            </div>
          </div> */}
        </section>

        <GemStoneLinks />

        <ItemCollection
          items={categoryItems}
          title={`${category.name} Collection`}
          subtitle="Curated Selection"
          emptyMessage="現在、関連するアイテムはありません。"
        />

      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}