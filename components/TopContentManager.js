/* components/TopContentManager.js */
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom'; // ★追加
import MasonryGrid from './MasonryGrid';
import FilterPopup from './FilterPopup';

export default function TopContentManager({ 
  initialItems, 
  categories, 
  accessories,
  title = "Journal & Products", 
  subtitle = "読みもの & 新着アイテム",
  isSearchPage = false 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // フィルター状態
  const [filters, setFilters] = useState({
    category: "",
    accessory: "",
    priceRange: "",
    color: "", 
    contentType: "all",
  });

  const [isTopOnly, setIsTopOnly] = useState(!isSearchPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const containerRef = useRef(null);
  
  // ★追加: クライアントサイドでのみポータルを有効にするためのフラグ
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // URLパラメータ復元 (変更なし)
  useEffect(() => {
    if (isSearchPage) {
      const p_category = searchParams.get('category') || "";
      const p_accessory = searchParams.get('accessory') || "";
      const p_color = searchParams.get('color') || "";
      const p_price = searchParams.get('priceRange') || "";
      const p_type = searchParams.get('contentType') || "all";

      setFilters({
        category: p_category,
        accessory: p_accessory,
        color: p_color,
        priceRange: p_price,
        contentType: p_type
      });
      
      setIsTopOnly(false);
    }
  }, [isSearchPage, searchParams]);

  // スクロール検知 (変更なし)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBtn(entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 選択肢の計算 (変更なし)
  const availableOptions = useMemo(() => {
    const activeCategoryNames = new Set();
    const activeAccessoryNames = new Set();
    const activeColorNames = new Set();
    const activePriceKeys = new Set();

    initialItems.forEach(item => {
      if (filters.contentType !== 'all' && item.type !== filters.contentType) return;
      if (item.category) activeCategoryNames.add(item.category);
      if (item.accessory) activeAccessoryNames.add(item.accessory);
      if (item.color) activeColorNames.add(item.color);
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
      validAccessories = accessories.filter(acc => activeAccessoryNames.has(acc.name));
    } else {
      validAccessories = Array.from(activeAccessoryNames).sort().map(name => ({
        id: name, name: name
      }));
    }
    
    return {
      categories: categories.filter(cat => activeCategoryNames.has(cat.name)),
      accessories: validAccessories,
      colors: Array.from(activeColorNames).sort(),
      priceRanges: priceDefinitions.filter(p => activePriceKeys.has(p.value))
    };
  }, [initialItems, categories, accessories, filters.contentType]);

  // フィルタリングロジック (変更なし)
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      if (filters.contentType !== 'all' && item.type !== filters.contentType) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.accessory && item.accessory !== filters.accessory) return false;
      if (filters.color && item.color !== filters.color) return false;
      
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
    setFilters({ category: "", accessory: "", priceRange: "", color: "", contentType: "all" });
    if (!isSearchPage) setIsTopOnly(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isSearchPage && !isTopOnly) {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.accessory) params.set('accessory', filters.accessory);
      if (filters.color) params.set('color', filters.color);
      if (filters.priceRange) params.set('priceRange', filters.priceRange);
      if (filters.contentType !== 'all') params.set('contentType', filters.contentType);
      router.push(`/search?${params.toString()}`);
    }
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) + 
    (filters.accessory ? 1 : 0) + 
    (filters.color ? 1 : 0) + 
    (filters.priceRange ? 1 : 0);
  
  const isRefineActive = activeFilterCount > 0;

  return (
    <div className="content-manager" ref={containerRef} style={{ minHeight: '100vh' }}>
      
      <div className="content-header-wrapper">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

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

      {/* ★修正: ポータルを使用してbody直下に描画 */}
      {mounted && createPortal(
        <>
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
            onClose={handleCloseModal}
            availableOptions={availableOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters} 
            isTopOnly={isTopOnly}
            onToggleTopOnly={() => setIsTopOnly(!isTopOnly)}
            showOptionToggle={!isSearchPage}
          />
        </>,
        document.body
      )}

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