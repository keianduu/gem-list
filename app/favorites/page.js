/* app/favorites/page.js */
"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MasonryGrid from "@/components/MasonryGrid";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  return (
    <>
      <SiteHeader />

      {/* ★修正: 
        className を "main-container" から "journal-main" に変更
        style の paddingTop 指定を削除（CSS側で制御されるため）
      */}
      <main className="journal-main">
        
        {/* パンくずリスト */}
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Favorites</span>
          </div>
        </nav>

        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 className="hero-title" style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
            Your Favorites
          </h1>
          <p className="hero-subtitle" style={{ color: "#666" }}>
            あなたが選んだ、特別なコレクション。
          </p>
        </div>

        {/* ロード中 または データがない場合の表示分岐 */}
        {!isLoaded ? (
          <div className="skeleton-container fade-in" style={{ justifyContent: 'center' }}>
             <div className="skeleton-text" style={{ width: '200px', height: '20px' }}></div>
          </div>
        ) : favorites.length > 0 ? (
          <MasonryGrid items={favorites} />
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
            <p style={{ marginBottom: "20px" }}>まだお気に入りのアイテムはありません。</p>
            <Link href="/" className="embed-btn" style={{ display: 'inline-block' }}>
              アイテムを探す
            </Link>
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}