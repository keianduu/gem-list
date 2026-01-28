/* app/page.js */
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import CategorySlider from "@/components/CategorySlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TopContentManager from "@/components/TopContentManager";
import HeroSearch from "@/components/HeroSearch";
import { client } from "@/libs/microcms";
import GemStoneLinks from "@/components/GemStoneLinks";
import { PAGE_METADATA } from "@/libs/meta";
// 💎 ★追加: 診断トリガーのインポート
import DiagnosisTrigger from '@/components/diagnosis/DiagnosisTrigger';

// アーカイブ取得
async function getArchives() {
  try {
    const data = await client.get({
      endpoint: "archive",
      queries: {
        limit: 24,
        orders: "-priority,-publishedAt",
        fields: "id,title,slug,publishedAt,thumbnail,thumbnailUrl,type,relatedJewelries,relatedAccessories,price,description,affiliateUrl,color,priority"
      },
      customRequestInit: {
        next: {
          tags: ['gem']
        }
      }
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
    const data = await client.get({
      endpoint: "jewelry-categories",
      queries: {
        filters: 'isVisible[equals]true',
        limit: 100,
        orders: "name"
      },
      customRequestInit: {
        next: {
          tags: ['gem']
        }
      }
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
      endpoint: "accessory",
      queries: { limit: 100 },
      customRequestInit: { next: { tags: ['gem'] } }
    });
    return data.contents;
  } catch (err) {
    console.error("Accessories fetch error:", err);
    return [];
  }
}

// 原石データ取得
async function getRoughStones() {
  try {
    const data = await client.get({
      endpoint: "rough-stones",
      queries: { limit: 100 },
      customRequestInit: { next: { tags: ['gem'] } }
    });
    return data.contents;
  } catch (err) {
    console.error("Rough Stones fetch error:", err);
    return [];
  }
}

export const metadata = {
  title: PAGE_METADATA.top.title,
  description: PAGE_METADATA.top.description,
};

export default async function Home() {
  const [archives, categories, accessories, roughStones] = await Promise.all([
    getArchives(),
    getCategories(),
    getAccessories(),
    getRoughStones()
  ]);

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

  return (
    <>
      <SiteHeader />

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>

          <HeroSearch
            archives={items}
            categories={categories}
            roughStones={roughStones}
            gemLinks={
              <GemStoneLinks style={{ marginTop: '32px', marginBottom: '0' }} />
            }
          />
        </div>

        <div className="hero-bottom-categories">
          <CategorySlider categories={categories} />
        </div>
      </section>

      <main className="main-container">
        <Suspense fallback={<div className="skeleton-container fade-in"><div className="skeleton-text" style={{ width: '100%' }}>Loading...</div></div>}>
          <TopContentManager
            initialItems={items}
            categories={categories}
            accessories={accessories}
          />
        </Suspense>
      </main>
      <SiteFooter />

      {/* 💎 ★追加: 宝石診断トリガー */}
      <DiagnosisTrigger />
    </>
  );
}