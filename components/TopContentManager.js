/* components/TopContentManager.js */
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import MasonryGrid from './MasonryGrid';
import FilterPopup from './FilterPopup';

export default function TopContentManager({ initialItems, categories, accessories }) {
  // フィルター状態
  const [filters, setFilters] = useState({
    category: "",
    accessory: "",
    priceRange: "",
    color: "", // ★追加
    contentType: "all",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const containerRef = useRef(null);

  // スクロール検知
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBtn(entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 選択肢の計算
  const availableOptions = useMemo(() => {
    const activeCategoryNames = new Set();
    const activeAccessoryNames = new Set();
    const activeColorNames = new Set(); // ★追加
    const activePriceKeys = new Set();

    initialItems.forEach(item => {
      // コンテンツタイプでフィルタリングされた候補から選択肢を作る
      if (filters.contentType !== 'all' && item.type !== filters.contentType) return;

      if (item.category) activeCategoryNames.add(item.category);
      if (item.accessory) activeAccessoryNames.add(item.accessory);
      if (item.color) activeColorNames.add(item.color); // ★追加

      if (item.type === 'product' && typeof item.rawPrice === 'number') {
        const p = item.rawPrice;
        if (p < 10000) activePriceKeys.add('under-10000');
        else if (p < 30000) activePriceKeys.add('10000-30000');
        else if (p < 50000) activePriceKeys.add('30000-50000');
        else activePriceKeys.add('over-50000');
      }
    });

    const priceDefinitions = [
      { value: 'under-10000', label: 'Under ¥10,000' },
      { value: '10000-30000', label: '¥10,000 - ¥30,000' },
      { value: '30000-50000', label: '¥30,000 - ¥50,000' },
      { value: 'over-50000', label: 'Over ¥50,000' },
    ];

    let validAccessories = [];
    if (accessories && accessories.length > 0) {
      // マスタデータがある場合はそれを使う（IDなどの情報が正確なため）
      validAccessories = accessories.filter(acc => activeAccessoryNames.has(acc.name));
    } else {
      // マスタがない場合は、商品データにある名前から即席でリストを作る
      validAccessories = Array.from(activeAccessoryNames).sort().map(name => ({
        id: name, // IDの代わりに名前を使う
        name: name
      }));
    }
    
    return {
      categories: categories.filter(cat => activeCategoryNames.has(cat.name)),
      accessories: validAccessories,
      colors: Array.from(activeColorNames).sort(), // ★追加: 文字列配列として返す
      priceRanges: priceDefinitions.filter(p => activePriceKeys.has(p.value))
    };
  }, [initialItems, categories, accessories, filters.contentType]);

  // フィルタリングロジック
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      if (filters.contentType !== 'all' && item.type !== filters.contentType) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.accessory && item.accessory !== filters.accessory) return false;
      if (filters.color && item.color !== filters.color) return false; // ★追加
      
      if (filters.priceRange) {
        if (item.type !== 'product') return false;
        const price = item.rawPrice;
        if (filters.priceRange === 'under-10000' && price >= 10000) return false;
        if (filters.priceRange === '10000-30000' && (price < 10000 || price >= 30000)) return false;
        if (filters.priceRange === '30000-50000' && (price < 30000 || price >= 50000)) return false;
        if (filters.priceRange === 'over-50000' && price < 50000) return false;
      }
      return true;
    });
  }, [initialItems, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ category: "", accessory: "", priceRange: "", color: "", contentType: "all" }); // ★colorリセット追加
  };

  // Refineボタン用のアクティブ数カウント
  const activeFilterCount = 
    (filters.category ? 1 : 0) + 
    (filters.accessory ? 1 : 0) + 
    (filters.color ? 1 : 0) + // ★追加
    (filters.priceRange ? 1 : 0);
  
  const isRefineActive = activeFilterCount > 0;

  return (
    <div className="content-manager" ref={containerRef} style={{ minHeight: '100vh' }}>
      
      <div className="content-header-wrapper">
        <h2 className="section-title">Journal & Products</h2>
        <p className="section-subtitle">読みもの & 新着アイテム</p>

        <div className="content-type-tabs">
          <button 
            className={`type-tab ${filters.contentType === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('contentType', 'all')}
          >
            All
          </button>
          <button 
            className={`type-tab ${filters.contentType === 'product' ? 'active' : ''}`}
            onClick={() => handleFilterChange('contentType', 'product')}
          >
            Jewelry
          </button>
          <button 
            className={`type-tab ${filters.contentType === 'journal' ? 'active' : ''}`}
            onClick={() => handleFilterChange('contentType', 'journal')}
          >
            Journal
          </button>
        </div>
      </div>

      <button 
        className={`floating-filter-btn ${showFloatingBtn ? 'visible' : ''}`}
        onClick={() => setIsModalOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        <span className="btn-text">Refine</span>
        {activeFilterCount > 0 && (
          <span style={{ 
            background: '#fff', color: '#111', 
            borderRadius: '50%', width: '20px', height: '20px', 
            fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', marginLeft: '8px'
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>

      <FilterPopup 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableOptions={availableOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters} 
      />

      {isRefineActive && (
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '30px', color: '#888', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          {filteredItems.length} ITEMS FOUND
        </div>
      )}

      {filteredItems.length > 0 ? (
        <MasonryGrid items={filteredItems} />
      ) : (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          No items match your criteria.
        </div>
      )}
    </div>
  );
}