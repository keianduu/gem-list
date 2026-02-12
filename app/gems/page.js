import Link from "next/link";
import Image from "next/image";
import { client } from "@/libs/microcms";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import GemTabNavigation from "@/components/GemTabNavigation";
import GemCard from "@/components/GemCard";
import PageTitle from "@/components/PageTitle";

// 全カテゴリ取得
async function getAllCategories() {
  try {
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: {
        limit: 100,
        filters: 'isVisible[equals]true',
      },
      customRequestInit: { next: { revalidate: 3600 } }
    });
    return data.contents;
  } catch (err) {
    console.error("Categories fetch error:", err);
    return [];
  }
}

export const metadata = {
  title: "Gemstone Index - Jewelism MARKET",
  description: "取り扱い宝石カテゴリの一覧です。名前からお好みの宝石をお探しいただけます。",
  alternates: {
    canonical: '/gems',
  },
};

export default async function CategoryIndexPage() {
  const categories = await getAllCategories();

  // アルファベット順にソート (A -> Z)
  const sortedCategories = categories.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // パンくずデータ定義
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "All Gemstones", path: "/gems" }
  ];

  return (
    <>
      <SiteHeader />

      <main className="journal-main">

        <section style={{ maxWidth: '1000px', margin: '40px auto 80px' }}>
          <PageTitle
            enLabel="Encyclopedia"
            title="Gemstone Index"
            subtitle="宝石カテゴリ一覧"
          />

          <GemTabNavigation activeTab="all" />

          {sortedCategories.length > 0 ? (
            <div className="category-index-grid">
              {sortedCategories.map((cat) => (
                <GemCard key={cat.id} cat={cat} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
              Category Not Found.
            </p>
          )}

        </section>

      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}