/* app/products/[id]/page.js */
import { client } from "@/libs/microcms";

// ▼▼▼ 追加: こちらも動的レンダリングを強制します ▼▼▼
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product Detail - Management Only',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `/products/${id}`,
  },
};

export default async function ProductPage({ params }) {
  const { id } = await params; // slug

  // slugで検索して1件取得
  const data = await client.get({
    endpoint: "archive",
    queries: { filters: `slug[equals]${id}` },
    customRequestInit: { next: { revalidate: 0 } }
  });
  const product = data.contents[0];

  if (!product) return <div style={{ padding: 100 }}>Product Not Found</div>;

  return (
    <div className="item-admin-container">
      <div className="admin-notice">
        ※このページは管理用です（noindex）。一般ユーザーには公開されません。
      </div>

      <div className="item-detail-card">
        <div className="item-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.thumbnailUrl} alt={product.title} />
        </div>

        <div className="item-info">
          <span className="item-badge">PRODUCT CHECK</span>
          <h1>{product.title}</h1>
          <p className="price">¥{Number(product.price).toLocaleString()}</p>
          <p className="desc">{product.description}</p>

          <div className="action-area">
            <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="affiliate-btn">
              アフィリエイトリンクを確認 (Shop)
            </a>

            <div className="copy-area">
              <p>Journal埋め込み用URL:</p>
              <code>{`/products/${product.slug}`}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}