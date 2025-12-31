/* app/page.js */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Masonry from 'react-masonry-css';
import { client } from "@/libs/microcms";

const items = [
  { id: 1, type: "product", name: "北欧風ダイニングチェア オーク材", price: "¥12,990", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80" },
  { id: 2, type: "article", name: "【特集】初めてのダイヤモンド選び。4Cとは？", desc: "輝きを決めるカット、カラー、クラリティ、カラットの基礎知識。", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
  { id: 3, type: "product", name: "リネン100% デュベカバー ダブル グレー", price: "¥8,900", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80" },
  { id: 4, type: "product", name: "ヴィンテージ調 ペンダントライト 真鍮", price: "¥15,400", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80" },
  { id: 5, type: "article", name: "誕生石を身につける意味。歴史と伝承。", desc: "古代から伝わるお守りとしての宝石。あなたの守護石は？", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80" },
  { id: 6, type: "product", name: "木製フレーム ウォールミラー 丸型", price: "¥6,800", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80" },
  { id: 7, type: "product", name: "モダンアートキャンバス 抽象画", price: "¥4,500", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80" },
  { id: 8, type: "article", name: "ロイヤル・ブルーサファイアの魅力", desc: "英国王室も愛した深く青い輝き。その価値と見分け方。", image: "https://images.unsplash.com/photo-1610526881101-a1690930939c?w=600&q=80" },
  { id: 9, type: "product", name: "コンパクトなサイドテーブル スチール", price: "¥4,990", image: "https://images.unsplash.com/photo-1612372606404-0ab33c7d8727?w=600&q=80" },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // スクロール要素への参照
  const scrollRef = useRef(null);
  // アニメーションの一時停止フラグ
  const isPaused = useRef(false);
  
  // ▼▼▼ 追加: 正確な位置（小数）を管理するための変数 ▼▼▼
  const scrollPos = useRef(0);

  const breakpointColumnsObj = { default: 4, 1024: 3, 768: 2 };

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await client.get({ 
          endpoint: "jewelry-categories",
          queries: {
            filters: 'isVisible[equals]true',
            limit: 100,
          }
        });
        setCategories(data.contents);
      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchCategories();
  }, []);

  // 自動スクロール処理 (高精度版)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || categories.length === 0) return;

    // 初期位置を同期
    scrollPos.current = container.scrollLeft;

    let animationId;
    
    // ▼▼▼ 速度設定（0.1でも動くようになります） ▼▼▼
    const speed = 0.4; 
    // ▲▲▲ お好みで調整してください（例: 0.1, 0.15, 0.2） ▲▲▲

    const scrollLoop = () => {
      if (container) {
        if (!isPaused.current) {
          // 自動モード: 裏側の正確な数値を増やして、それを反映させる
          scrollPos.current += speed;
          container.scrollLeft = scrollPos.current;

          // ループ処理
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
            scrollPos.current = 0; // 裏側の数値もリセット
          }
        } else {
          // 手動モード中: ユーザーが動かした位置を裏側の数値に同期させる
          // (これをしないと、指を離した瞬間に元の位置に引き戻されてしまうため)
          scrollPos.current = container.scrollLeft;
        }
      }
      animationId = requestAnimationFrame(scrollLoop);
    };

    // アニメーション開始
    animationId = requestAnimationFrame(scrollLoop);

    return () => cancelAnimationFrame(animationId);
  }, [categories]);

  const pauseScroll = () => { isPaused.current = true; };
  const resumeScroll = () => { isPaused.current = false; };

  const loopCategories = categories.length > 0 
    ? [...categories, ...categories]
    : [];

  return (
    <>
      <header className={`site-header ${isScrolled ? "scrolled" : "transparent"}`}>
         <div className="header-left">
          <Link href="/" className="header-logo-container">
            <span className="logo-main">Jewelism</span>
            <span className="logo-sub">MARKET</span>
          </Link>
        </div>
        <div className="header-icons">
          <div className="icon-btn">
             <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <div className="icon-btn">
             <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </div>
          <div className="icon-btn menu-toggle">
            <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </header>

      <section className="hero-area">
        <div className="hero-center-content">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
          <div className="hero-search-wrapper">
            <div className="hero-search-container">
              <svg className="hero-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" className="hero-search-input" placeholder="宝石名、色などで検索..." />
            </div>
          </div>
        </div>

        <div className="hero-bottom-categories">
          {categories.length > 0 ? (
            <div 
              className="category-scroll-wrap" 
              ref={scrollRef}
              onMouseEnter={pauseScroll}
              onMouseLeave={resumeScroll}
              onTouchStart={pauseScroll}
              onTouchEnd={resumeScroll}
            >
              {loopCategories.map((cat, index) => (
                <Link key={`${cat.id}-${index}`} href={`/category/${cat.slug}`} className="category-card">
                  {cat.image?.url && (
                    <Image 
                      src={cat.image.url} 
                      alt={cat.name}
                      width={140}
                      height={140}
                      className="category-thumb" 
                    />
                  )}
                  <span className="category-name">{cat.name}</span>
                  {cat.yomigana && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#888', 
                      marginTop: '2px', 
                      fontFamily: 'var(--font-jp)',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      lineHeight: '1.2',
                      display: 'block',
                      width: '100%',
                      textAlign: 'center'
                    }}>
                      {cat.yomigana}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="skeleton-container fade-in">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="main-container">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <div key={item.id} className="pin-card">
              <div className="pin-image-wrapper">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={600} 
                  height={400}
                  className="pin-image"
                  style={{ width: '100%', height: 'auto' }}
                />
                
                {item.type === 'product' ? (
                   <span className="type-badge type-product">ITEM</span>
                ) : (
                   <span className="type-badge type-article">JOURNAL</span>
                )}
                <div className="pin-overlay">
                    <div className="save-btn">保存</div>
                </div>
              </div>
              <div className="pin-info">
                <h3 className="pin-title">{item.name}</h3>
                {item.type === 'product' ? (
                  <p className="pin-price">{item.price}</p>
                ) : (
                  <p className="pin-meta">{item.desc}</p>
                )}
              </div>
            </div>
          ))}
        </Masonry>
      </main>

      <footer className="gem-footer">
        <Link href="/" className="footer-logo-container">
          <span className="logo-main">Jewelism</span>
          <span className="logo-sub">MARKET</span>
        </Link>
        <div className="footer-links">
           <Link href="#">ブランドについて</Link>
           <Link href="#">お問い合わせ</Link>
           <Link href="#">プライバシーポリシー</Link>
           <Link href="#">特定商取引法に基づく表記</Link>
        </div>
        <p className="copyright">&copy; 2025 Jewelism Market. All Rights Reserved.</p>
      </footer>
    </>
  );
}