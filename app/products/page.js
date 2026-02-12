import ProductsInfiniteList from "@/components/ProductsInfiniteList";
import Link from "next/link";
import { client } from "@/libs/microcms";
import SiteHeader from "@/components/SiteHeader";

// ▼▼▼ 追加: これでビルド時の静的生成エラーを回避し、常に最新データを取得します ▼▼▼
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products List - Management Only',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsListPage() {
  // Productのみ取得 (typeにproductが含まれるもの)
  const data = await client.get({
    endpoint: "archive",
    queries: {
      filters: 'type[contains]product',
      limit: 24, // ★変更: 100 -> 24
      orders: "-publishedAt",
      fields: "id,slug,title,price,thumbnailUrl,description,type,publishedAt"
    },
    customRequestInit: { next: { revalidate: 0 } } // 管理用なのでキャッシュなし
  });

  const products = data.contents.map((content) => ({
    id: content.slug,
    type: "product",
    name: content.title,
    price: content.price ? `¥${Number(content.price).toLocaleString()}` : "",
    image: content.thumbnailUrl, // 文字列を渡す
    desc: content.description,
    // linkを指定しない -> MasonryGridが /products/[id] を生成する
  }));

  return (
    <>
      <SiteHeader />

      <main className="main-container" style={{ paddingTop: "120px" }}>
        <div style={{ marginBottom: "40px", padding: "20px", background: "#f0f0f0", borderRadius: "8px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Products Management List</h1>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            ※管理用商品一覧（noindex）。クリックで詳細（ID/リンク確認）へ移動。
          </p>
        </div>
        <ProductsInfiniteList initialItems={products} />
      </main>

      <footer className="gem-footer">
        <p className="copyright">&copy; 2025 Jewelism Market.</p>
      </footer>
    </>
  );
}