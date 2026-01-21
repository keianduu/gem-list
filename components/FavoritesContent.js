/* components/FavoritesContent.js */
"use client";

import { useState, useMemo } from 'react';
import Link from "next/link";
import MasonryGrid from "@/components/MasonryGrid";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesContent() {
  const { favorites, isLoaded } = useFavorites();
  const [activeTab, setActiveTab] = useState("all"); // "all", "product", "journal"

  // フィルタリングロジック: 選択されたタブに基づいて表示アイテムを絞り込み
  const filteredFavorites = useMemo(() => {
    if (!isLoaded) return [];

    // 新しい順に並び替え (配列のコピーを作成してからreverse)
    const reversed = [...favorites].reverse();

    if (activeTab === "all") return reversed;
    return reversed.filter(item => item.type === activeTab);
  }, [favorites, activeTab, isLoaded]);

  // タブ切り替えハンドラ
  const handleTabChange = (type) => {
    setActiveTab(type);
  };

  return (
    <div className="content-manager" style={{ minHeight: '60vh' }}>

      {/* --- Header Section (Search Allページとスタイルを統一) --- */}
      <div className="content-header-wrapper">
        <h1 className="section-title">Your Favorites</h1>
        <p className="section-subtitle">
          {isLoaded ? `全${favorites.length}件のコレクション` : "Loading..."}
        </p>

        {/* コンテンツタイプ切り替えタブ */}
        <div className="content-type-tabs">
          <button
            className={`type-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
          <button
            className={`type-tab ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => handleTabChange('product')}
          >
            Jewelry
          </button>
          <button
            className={`type-tab ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => handleTabChange('journal')}
          >
            Journal
          </button>
        </div>
      </div>

      {/* --- Content Area --- */}
      {!isLoaded ? (
        // ローディング状態
        <div className="skeleton-container fade-in" style={{ justifyContent: 'center', marginTop: '40px' }}>
          <div className="skeleton-text" style={{ width: '200px', height: '20px' }}></div>
        </div>
      ) : favorites.length > 0 ? (
        // お気に入りデータがある場合
        filteredFavorites.length > 0 ? (
          <MasonryGrid items={filteredFavorites} />
        ) : (
          // フィルタリングの結果、表示するものがなくなった場合
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
            <p>このカテゴリのアイテムはありません。</p>
          </div>
        )
      ) : (
        // お気に入りが一件もない場合
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <p style={{ marginBottom: "20px" }}>まだお気に入りのアイテムはありません。</p>
          <Link href="/search" className="embed-btn" style={{ display: 'inline-block' }}>
            アイテムを探す
          </Link>
        </div>
      )}
    </div>
  );
}