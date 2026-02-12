/* app/journals/[id]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import RichTextRenderer from "@/components/RichTextRenderer";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ItemCollection from "@/components/ItemCollection";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME } from "@/libs/meta";
import { AUTHORS, DEFAULT_AUTHOR_ID } from "@/libs/authors"; // ★追加
import SmartRichText from "@/components/SmartRichText";
import JournalPagination from "@/components/JournalPagination";

export const dynamic = 'force-dynamic';

// --- 関連アイテム取得関数 ---
async function getRelatedItems(categoryId, currentContentId) {
  if (!categoryId) return [];

  try {
    const data = await client.get({
      endpoint: "archive",
      queries: {
        filters: `relatedJewelries[contains]${categoryId}[and]id[not_equals]${currentContentId}`,
        limit: 6,
        orders: "-publishedAt",
      },
      customRequestInit: { next: { tags: ['journal'] } }
    });

    return data.contents.map((content) => {
      const isProduct = content.type.includes('product');
      const relatedCategory = content.relatedJewelries?.[0];
      const categoryName = relatedCategory?.name || (isProduct ? "Item" : "Journal");
      const categoryIcon = relatedCategory?.image?.url || null;

      return {
        id: content.slug,
        type: isProduct ? 'product' : 'journal',
        name: content.title,
        price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
        desc: content.description,
        image: isProduct ? content.thumbnailUrl : content.thumbnail,
        link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
        category: categoryName,
        categoryIcon: categoryIcon,
      };
    });
  } catch (e) {
    console.error("Related items fetch error:", e);
    return [];
  }
}

// --- 本文処理 ---
async function processBodyWithProducts(bodyContent) {
  if (!bodyContent) return "";
  const regex = /<a[^>]+href=["']\/?(?:items|products?)\/([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  const matches = [...bodyContent.matchAll(regex)];

  if (matches.length === 0) return bodyContent;

  const slugs = [...new Set(matches.map(m => m[1]))];
  let productsData = { contents: [] };

  if (slugs.length > 0) {
    try {
      const filtersQuery = slugs.map(slug => `slug[equals]${slug}`).join('[or]');
      productsData = await client.get({
        endpoint: "archive",
        queries: { filters: filtersQuery, limit: 100 },
        customRequestInit: { next: { tags: ['journal'] } }
      });
    } catch (e) {
      console.error("[Journal] Product fetch failed:", e);
    }
  }

  let newBody = bodyContent;

  for (const match of matches) {
    const matchedString = match[0];
    const slug = match[1];
    const product = productsData.contents.find(p => p.slug === slug);

    if (product) {
      const priceStr = product.price ? `¥${Number(product.price).toLocaleString()}` : "";
      const description = product.description || "";
      const cardHtml = `
          <a href="${product.affiliateUrl}" class="product-embed-card" target="_blank" rel="noopener noreferrer">
            <span class="embed-thumb">
              <img src="${product.thumbnailUrl}" alt="${product.title}" />
            </span>
            <span class="embed-info">
              <span class="embed-label">PICK UP ITEM</span>
              <span class="embed-title">${product.title}</span>
              <span class="embed-description">${description}</span>
              <span class="embed-price">${priceStr}</span>
              <span class="embed-btn">View Details</span>
            </span>
          </a>
        `;
      newBody = newBody.replace(matchedString, cardHtml);
    }
  }
  return newBody;
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const data = await client.get({
      endpoint: "archive",
      queries: { filters: `slug[equals]${id}` },
      customRequestInit: { next: { tags: ['journal'] } }
    });
    const journal = data.contents[0];

    if (!journal) return { title: "Journal not found" };

    const ogImageUrl = journal.thumbnail?.url
      ? `${journal.thumbnail.url}?w=1200&h=630&fit=crop&q=85`
      : null; // 画像がない場合は空にしておけば layout.js のデフォルト画像が使われます

    return {
      title: journal.title,
      description: journal.description || "Jewelism MARKETの記事詳細です。",
      alternates: {
        canonical: `/journals/${id}`,
      },
      openGraph: {
        title: `${journal.title} | ${SITE_NAME}`,
        description: journal.description,
        type: 'article',
        // ↓ 加工したURLを設定
        images: ogImageUrl ? [ogImageUrl] : [],
        publishedTime: journal.publishedAt,
      },
    };
  } catch (e) {
    return { title: "Journal not found" };
  }
}

export default async function JournalPage({ params }) {
  const { id } = await params;

  const data = await client.get({
    endpoint: "archive",
    queries: {
      filters: `slug[equals]${id}`,
      depth: 2
    },
    customRequestInit: { next: { tags: ['journal'] } }
  });
  const journal = data.contents[0];

  if (!journal) return <div className="main-container" style={{ padding: 100 }}>Journal Not Found</div>;

  const processedBody = await processBodyWithProducts(journal.body);

  const categoryData = journal.relatedJewelries?.[0] || null;
  const categoryLink = categoryData ? `/gems/${categoryData.slug}` : "/";
  const categoryName = categoryData ? categoryData.name : "Journal";
  const categoryIcon = categoryData?.image?.url || null;

  const publishedDate = new Date(journal.publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const relatedItems = categoryData
    ? await getRelatedItems(categoryData.id, journal.id)
    : [];

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "All Gemstones", path: "/gems" }
  ];

  if (categoryData) {
    breadcrumbItems.push({ label: categoryName, path: categoryLink });
  } else {
    breadcrumbItems.push({ label: "Journal", path: null });
  }

  breadcrumbItems.push({ label: journal.title, path: `/journals/${journal.slug}` });

  // ★追加: Authorデータの取得
  // microCMSから 'author' フィールド (ID文字列) が返ってくると想定
  // 未設定の場合はデフォルトIDを使用
  const authorId = journal.author || DEFAULT_AUTHOR_ID;
  const author = AUTHORS[authorId] || AUTHORS[DEFAULT_AUTHOR_ID];

  // ★追加: 前後の記事を取得
  const [prevArticle, nextArticle] = await Promise.all([
    // 前の記事 (古い) : publishedAt < current
    client.get({
      endpoint: "archive",
      queries: {
        filters: `publishedAt[less_than]${journal.publishedAt}[and]type[contains]journal`,
        limit: 1,
        orders: "-publishedAt",
        fields: "id,slug,title,thumbnail,publishedAt"
      },
      customRequestInit: { next: { tags: ['journal'] } }
    }).then(res => res.contents[0] || null),

    // 次の記事 (新しい) : publishedAt > current
    client.get({
      endpoint: "archive",
      queries: {
        filters: `publishedAt[greater_than]${journal.publishedAt}[and]type[contains]journal`,
        limit: 1,
        orders: "publishedAt",
        fields: "id,slug,title,thumbnail,publishedAt"
      },
      customRequestInit: { next: { tags: ['journal'] } }
    }).then(res => res.contents[0] || null)
  ]);

  return (
    <>
      <SiteHeader />

      <main className="journal-main">

        <article className="journal-article-container">
          <div className="journal-header">
            <div className="journal-meta">
              <Link href={categoryLink} className="journal-category-badge">
                {categoryIcon && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={categoryIcon} alt="" className="category-badge-icon" />
                )}
                <span>{categoryName}</span>
              </Link>
              <span className="journal-date">{publishedDate}</span>
            </div>
            <h1 className="journal-title">{journal.title}</h1>
            <p className="journal-description">{journal.description}</p>
          </div>

          <div className="journal-content-glass">
            {journal.thumbnail && (
              <div className="journal-cover-in-glass">
                <Image
                  src={journal.thumbnail.url}
                  alt={journal.title}
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 820px) 100vw, 820px"
                />
              </div>
            )}
            <SmartRichText content={processedBody} />

            {/* ★追加: ページネーション (Authorセクションの上) */}
            <JournalPagination prev={prevArticle} next={nextArticle} />

            {/* ★修正: Authorセクションを動的にレンダリング */}
            <div className="journal-author-section">
              <div className="author-icon-wrapper">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.nameEn}
                    width={80}
                    height={80}
                    className="author-icon"
                  />
                ) : (
                  <div className="author-icon" style={{ background: '#eee' }}></div>
                )}
              </div>
              <div className="author-info">
                <span className="author-label">Written by</span>
                <h3 className="author-name">{author.nameEn}</h3>
                <p className="author-bio" style={{ whiteSpace: 'pre-line' }}>
                  {author.bio}
                </p>
              </div>
            </div>
          </div>
        </article>

        <ItemCollection
          items={relatedItems}
          title="Related Contents"
          subtitle="More Stories & Items"
          emptyMessage="関連する商品がありません"
        />

      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}