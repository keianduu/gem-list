/* app/journals/[id]/page.js */
import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import RichTextRenderer from "@/components/RichTextRenderer";

// ★修正: 提示されたHTML形式 (<a href="/items/...">) に確実にマッチさせる正規表現
async function processBodyWithProducts(bodyContent) {
  if (!bodyContent) return "";

  // 正規表現の解説:
  // <a[^>]+href= ... <a タグの後に何か（スペース等）があり、href属性が来るパターン
  // ["']\/(?:items|products)\/ ... hrefの値が '/items/' または '/products/' で始まる
  // ([^"']+) ... その後の文字列（slug）をキャプチャする
  // ["'] ... 閉じクォート
  // [^>]*> ... 閉じタグまでの残り
  // [\s\S]*?<\/a> ... リンクテキスト（改行含む）と </a> 閉じタグ
  const regex = /<a[^>]+href=["']\/(?:items|products)\/([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  
  const matches = [...bodyContent.matchAll(regex)];

  // デバッグ用: マッチした個数と内容をサーバーログに出力
  console.log(`[Journal] Body processing matches: ${matches.length}`);

  if (matches.length === 0) return bodyContent;

  // Slug抽出
  const slugs = [...new Set(matches.map(m => m[1]))];
  console.log(`[Journal] Target slugs:`, slugs);

  // データ取得
  let productsData = { contents: [] };
  if (slugs.length > 0) {
    try {
      productsData = await client.get({
        endpoint: "archive",
        queries: { 
          filters: `slug[in]${slugs.join(',')}`,
          limit: 100
        }
      });
    } catch (e) {
      console.error("[Journal] Product fetch failed:", e);
    }
  }

  let newBody = bodyContent;

  // 置換実行
  for (const match of matches) {
    const matchedString = match[0]; // <a ...>...</a> 全体
    const slug = match[1];          // slug部分
    
    const product = productsData.contents.find(p => p.slug === slug);

    if (product) {
      const priceStr = product.price ? `¥${Number(product.price).toLocaleString()}` : "";
      const description = product.description || "";
      
      // 商品カードHTML (画像は img タグを使用)
      const cardHtml = `
        <a href="${product.affiliateUrl}" class="product-embed-card" target="_blank" rel="noopener noreferrer">
          <div class="embed-thumb">
            <img src="${product.thumbnailUrl}" alt="${product.title}" />
          </div>
          <div class="embed-info">
            <span class="embed-label">PICK UP ITEM</span>
            <h4 class="embed-title">${product.title}</h4>
            <p class="embed-description">${description}</p>
            <p class="embed-price">${priceStr}</p>
            <div class="embed-btn">View Details</div>
          </div>
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
    }
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
      <header className="site-header scrolled">
         <div className="header-left">
          <Link href="/" className="header-logo-container">
            <span className="logo-main">Jewelism</span>
            <span className="logo-sub">MARKET</span>
          </Link>
        </div>
      </header>

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

      <footer className="gem-footer">
        <p className="copyright">&copy; 2025 Jewelism Market.</p>
      </footer>
    </>
  );
}