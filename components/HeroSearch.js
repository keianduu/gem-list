/* components/HeroSearch.js */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSearch({ archives = [], categories = [], roughStones = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // ★追加: アイコン用画像の取得 (Diamond & Beryl)
  const diamondCategory = categories.find(c => c.name.toLowerCase() === 'diamond');
  const berylRough = roughStones.find(r => r.name.toLowerCase() === 'beryl');

  // 検索ロジック
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // 1. カテゴリから検索 (前方一致)
    const matchedCategories = categories.filter((cat) => {
      const en = cat.name?.toLowerCase() || "";
      const ja = cat.nameJa?.toLowerCase() || "";
      const yomi = cat.yomigana?.toLowerCase() || "";
      return en.startsWith(lowerQuery) || ja.startsWith(lowerQuery) || yomi.startsWith(lowerQuery);
    }).map(cat => ({
      type: 'category',
      id: cat.id,
      name: cat.name,
      sub: cat.nameJa || cat.yomigana,
      link: `/gems/${cat.slug}`,
      image: cat.image?.url
    }));

    // 原石から検索 (前方一致)
    const matchedRoughStones = roughStones.filter((stone) => {
      const en = stone.name?.toLowerCase() || "";
      const ja = stone.nameJa?.toLowerCase() || "";
      const yomi = stone.yomigana?.toLowerCase() || "";
      return en.startsWith(lowerQuery) || ja.startsWith(lowerQuery) || yomi.startsWith(lowerQuery);
    }).map(stone => ({
      type: 'rough',
      id: stone.id,
      name: stone.name,
      sub: stone.nameJa || "Rough Stone",
      link: `/rough-stones/${stone.slug}`,
      image: stone.image?.url
    }));

    // 2. アイテム/記事から検索 (部分一致)
    const matchedArchives = archives.filter((item) => {
      const title = item.name?.toLowerCase() || "";
      return title.includes(lowerQuery);
    }).map(item => ({
      type: item.type === 'product' ? 'item' : 'journal',
      id: item.id,
      name: item.name,
      sub: item.type === 'product' ? 'Item' : 'Journal',
      link: item.link,
      image: typeof item.image === 'string' ? item.image : item.image?.url
    }));

    // 結果を結合
    setResults([...matchedCategories, ...matchedRoughStones, ...matchedArchives].slice(0, 10));
    setIsOpen(true);

  }, [query, categories, archives, roughStones]); 

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
        
        <div className={`hero-search-container ${isOpen && query ? 'active' : ''}`}>
          <svg className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="hero-search-input" 
            placeholder="宝石名、原石、アイテム名..." 
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
                    {item.type === 'rough' && <span className="suggestion-badge" style={{background:'#666'}}>ROUGH</span>}
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

      {/* CTA Links Area */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        {/* 1. View All Gemstones */}
        <Link href="/gems" className="hero-search-sublink" style={{ marginTop: 0 }} onClick={() => setIsOpen(false)}>
          {/* ★修正: Diamond画像があればそれを表示、なければSVG */}
          {diamondCategory?.image?.url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={diamondCategory.image.url} 
              alt="" 
              style={{ width:'20px', height:'20px', objectFit:'contain', marginRight:'4px' }} 
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
            </svg>
          )}
          <span>宝石一覧</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </Link>

        {/* 2. Rough Stones */}
        <Link href="/rough-stones" className="hero-search-sublink" style={{ marginTop: 0 }} onClick={() => setIsOpen(false)}>
          {/* ★修正: Beryl画像があればそれを表示、なければSVG */}
          {berylRough?.image?.url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={berylRough.image.url} 
              alt="" 
              style={{ width:'20px', height:'20px', objectFit:'contain', marginRight:'4px' }} 
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v9l-9 4.5-9-4.5v-9z" />
            </svg>
          )}
          <span>原石一覧</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </Link>

      </div>

    </div>
  );
}