/* components/HeroSearch.js */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSearch({ archives = [], categories = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 検索ロジック
 // 検索ロジック
 useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // 1. カテゴリから検索 (英語名、日本語名、読み仮名)
    const matchedCategories = categories.filter((cat) => {
      const en = cat.name?.toLowerCase() || "";
      const ja = cat.nameJa?.toLowerCase() || "";
      const yomi = cat.yomigana?.toLowerCase() || "";
      
      // ▼▼▼ 修正: includes → startsWith に変更（前方一致） ▼▼▼
      return en.startsWith(lowerQuery) || ja.startsWith(lowerQuery) || yomi.startsWith(lowerQuery);
    }).map(cat => ({
      // ... (マッピング処理はそのまま)
      type: 'category',
      id: cat.id,
      name: cat.name,
      sub: cat.nameJa || cat.yomigana,
      link: `/category/${cat.slug}`,
      image: cat.image?.url
    }));

    // 2. アイテム/記事から検索 (タイトル)
    const matchedArchives = archives.filter((item) => {
      const title = item.name?.toLowerCase() || "";
      
      // ▼▼▼ 修正: includes → startsWith に変更（前方一致） ▼▼▼
      return title.startsWith(lowerQuery);
    }).map(item => ({
      // ... (マッピング処理はそのまま)
      type: item.type === 'product' ? 'item' : 'journal',
      id: item.id,
      name: item.name,
      sub: item.type === 'product' ? 'Item' : 'Journal',
      link: item.link,
      image: typeof item.image === 'string' ? item.image : item.image?.url
    }));

    // ... (結果結合などはそのまま)
    setResults([...matchedCategories, ...matchedArchives].slice(0, 8));
    setIsOpen(true);

  }, [query, categories, archives]);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hero-search-wrapper" ref={wrapperRef} style={{ position: 'relative', zIndex: 50 }}>
      {/* Search Input Box */}
      <div style={{ position: 'relative' }}>
        
        {/* Search Input Box */}
        <div className={`hero-search-container ${isOpen && query ? 'active' : ''}`}>
          <svg className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="hero-search-input" 
            placeholder="宝石名、色、アイテム名で検索..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(query) setIsOpen(true); }}
          />
          {query && (
            <button 
              onClick={() => { setQuery(""); setResults([]); }}
              style={{ border:'none', background:'transparent', color:'#999', cursor:'pointer', padding:'4px' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestion Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="search-suggestions fade-in">
            {results.map((item, idx) => (
              <Link 
                href={item.link || '#'} 
                key={`${item.type}-${item.id}-${idx}`} 
                className="suggestion-item" 
                onClick={() => setIsOpen(false)}
              >
                <div className="suggestion-thumb">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt="" 
                      width={40} 
                      height={40} 
                      style={{ objectFit: 'contain', width:'100%', height:'100%' }} 
                    />
                  ) : (
                    <div style={{width:'100%', height:'100%', background:'#eee', borderRadius:'4px'}}></div>
                  )}
                </div>
                <div className="suggestion-info">
                  <p className="suggestion-name">
                    {item.name}
                    {item.type === 'category' && <span className="suggestion-badge">CATEGORY</span>}
                  </p>
                  {item.sub && <p className="suggestion-sub">{item.sub}</p>}
                </div>
                <div className="suggestion-arrow">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Not found message */}
        {isOpen && query && results.length === 0 && (
          <div className="search-suggestions fade-in" style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
            No results found for &quot;{query}&quot;
          </div>
        )}
      </div>
      {/* 既存のリンク (View All Gemstones) */}
      <Link href="/category" className="hero-search-sublink" onClick={() => setIsOpen(false)}>
        {/* Diamond Icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
        </svg>
        <span>View All Gemstones</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>

    </div>
  );
}