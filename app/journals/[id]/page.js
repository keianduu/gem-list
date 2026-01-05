/* app/journals/[id]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import RichTextRenderer from "@/components/RichTextRenderer";
import SiteHeader from "@/components/SiteHeader"; // ★追加
import SiteFooter from "@/components/SiteFooter"; // ★追加

// ★開発中はキャッシュを無効化して即時反映させる設定（本番では外してもOK）
// これを入れると、npm run build時に静的化されなくなりますが、今は動作確認優先です。
export const dynamic = 'force-dynamic';

async function processBodyWithProducts(bodyContent) {
  if (!bodyContent) return "";

  // ★最強正規表現: 
  // href="/product/..." も "/products/..." も許容
  // href='...' (シングルクォート) も許容
  // 前後に属性があってもOK
  const regex = /<a[^>]+href=["']\/?(?:items|products?)\/([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  
  const matches = [...bodyContent.matchAll(regex)];

  // ★このログは「VS Codeのターミナル」に出ます
  console.log(`[Journal] Body processing matches: ${matches.length}`);

  if (matches.length === 0) return bodyContent;

  const slugs = [...new Set(matches.map(m => m[1]))];
  console.log(`[Journal] Target slugs:`, slugs);

  let productsData = { contents: [] };
  if (slugs.length > 0) {
    try {
      // 修正: [in] ではなく [equals] を [or] で繋ぐクエリを作成
      const filtersQuery = slugs.map(slug => `slug[equals]${slug}`).join('[or]');
      
      console.log(`[Journal] Fetching filters: ${filtersQuery}`); // デバッグログ

      productsData = await client.get({
        endpoint: "archive",
        queries: { 
          filters: filtersQuery, // ここを変更
          limit: 100
        },
        customRequestInit: { next: { revalidate: 0 } }
      });
      
      // デバッグログ：何件取れたか確認
      console.log(`[Journal] Fetched count: ${productsData.contents.length}`);

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
        console.log(`[Journal] Found product data for: ${slug}`);
        const priceStr = product.price ? `¥${Number(product.price).toLocaleString()}` : "";
        const description = product.description || "";
        
        // ▼▼▼ 修正箇所: div を span に変更し、入れ子構造を安全にする ▼▼▼
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
      } else {
      console.warn(`[Journal] Product data NOT found for slug: ${slug}`);
    }
  }

  return newBody;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const data = await client.get({ endpoint: "archive", queries: { filters: `slug[equals]${id}` } });
    const journal = data.contents[0];
    return { 
      title: `${journal.title} - Jewelism MARKET`,
      description: journal.description,
    };
  } catch(e) {
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
    // ★開発中はキャッシュなし（0）にして、修正がすぐ反映されるようにします
    customRequestInit: { next: { revalidate: 0 } } 
  });
  const journal = data.contents[0];

  if (!journal) return <div className="main-container" style={{padding:100}}>Journal Not Found</div>;

  const processedBody = await processBodyWithProducts(journal.body);

  const category = journal.relatedJewelries?.[0] || null;
  const categoryLink = category ? `/category/${category.slug}` : "/";
  const categoryName = category ? category.name : "Journal";
  const categoryIcon = category?.image?.url || null;

  const publishedDate = new Date(journal.publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <SiteHeader />

      <main className="journal-main">
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            {category ? (
              <Link href={categoryLink}>{categoryName}</Link>
            ) : (
              <span>Journal</span>
            )}
            <span className="separator">/</span>
            <span className="current">{journal.title}</span>
          </div>
        </nav>

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
            <RichTextRenderer content={processedBody} />
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}