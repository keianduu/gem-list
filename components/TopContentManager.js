"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import MasonryGrid from './MasonryGrid';
import FilterPopup from './FilterPopup';
import { getItems } from '@/app/actions/itemActions';

const FULL_COLOR_LIST = [
  "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Black", "White", "Orange", "Clear", "Multi-color",
  "Brown", "Gray", "Violet", "Indigo"
];

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

  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(true); // 初期ロード分(24)があるので、あると仮定（ロード操作で判定）
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // 初期化: initialItemsが24件未満ならこれ以上ない
  useEffect(() => {
    if (initialItems.length < 24) {
      setHasMore(false);
    }
    setMounted(true);
  }, [initialItems]);

  // URLパラメータ復元
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
      // パラメータがある場合は初期ロードもトリガーする必要があるかも？
      // ただしpage.js等はSSRでパラメータを読んでinitialItemsを作っていない場合、ここでfetchが必要。
      // 今回は isSearchPage=false (TopPage) がメインなので、一旦パラメータ変更検知でのfetchに任せる
    }
  }, [isSearchPage, searchParams]);

  // フィルター変更時のデータ取得
  // 初回マウント時(initialItemsがある時)に走らないように注意
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    // フィルターが変わったらリセットして再取得
    const fetchFiltered = async () => {
      setIsLoading(true);
      // スクロール位置を少し戻すなどしたほうが親切だが、一旦データ更新のみ

      const { contents, totalCount } = await getItems({ offset: 0, limit: 24, filters });
      setItems(contents);
      setHasMore(contents.length < totalCount);
      setIsLoading(false);
    };

    // デバウンス的な処理を入れるか、即時実行か。とりあえず即時。
    fetchFiltered();
  }, [filters]);


  // 無限スクロール用 Load More
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const { contents, totalCount } = await getItems({
      offset: items.length,
      limit: 24,
      filters
    });

    setItems(prev => [...prev, ...contents]);

    // 続きがあるか判定
    if (items.length + contents.length >= totalCount) {
      setHasMore(false);
    }
    setIsLoading(false);
  }, [filters, hasMore, isLoading, items.length]);


  // IntersectionObserver for Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "400px", threshold: 0 } // 早めに読み込む
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);


  // フローティングボタン表示用のObserver (コンテナが見えているか)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBtn(entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 選択肢オプション
  const availableOptions = useMemo(() => {
    return {
      categories: categories || [],
      accessories: accessories || [],
      colors: FULL_COLOR_LIST,
      priceRanges: [
        { value: 'under-10000', label: 'Under ¥10,000' },
        { value: '10000-30000', label: '¥10,000 - ¥30,000' },
        { value: '30000-50000', label: '¥30,000 - ¥50,000' },
        { value: 'over-50000', label: 'Over ¥50,000' },
      ]
    };
  }, [categories, accessories]);


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ category: "", accessory: "", priceRange: "", color: "", contentType: "all" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // モーダルを閉じても、すでに state が変わって fetch されているので何もしなくて良い
    // URLを更新したい場合はここで router.replace 等
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.accessory ? 1 : 0) +
    (filters.color ? 1 : 0) +
    (filters.priceRange ? 1 : 0);

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
            isTopOnly={false} // 未使用だが念のため
            onToggleTopOnly={() => { }} // 未使用
            showOptionToggle={false} // トグル非表示
          />
        </>,
        document.body
      )}

      {isFirstRun.current === false && activeFilterCount > 0 && (
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '30px', color: '#888', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          Filtered Results
        </div>
      )}

      {items.length > 0 ? (
        <MasonryGrid items={items} />
      ) : (
        !isLoading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
            No items match your criteria.
          </div>
        )
      )}

      {/* Infinite Scroll Loader / Trigger */}
      <div ref={loaderRef} style={{ height: '60px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
        {isLoading && (
          <div className="skeleton-circle" style={{ width: '30px', height: '30px', border: '2px solid #ccc', borderTop: '2px solid #333' }}></div>
        )}
      </div>
    </div>
  );
}