/* app/page.js */
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Masonry from 'react-masonry-css';

// カテゴリーデータ
const categories = [
  { name: "Diamond", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80" },
  { name: "Ruby", image: "https://images.unsplash.com/photo-1561745027-20b015823651?w=200&q=80" },
  { name: "Sapphire", image: "https://images.unsplash.com/photo-1610526881101-a1690930939c?w=200&q=80" },
  { name: "Emerald", image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=200&q=80" },
  { name: "Pearl", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80" },
  { name: "Opal", image: "https://images.unsplash.com/photo-1617038220319-888491695d1b?w=200&q=80" },
  { name: "Gold", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=200&q=80" },
  { name: "Antique", image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=200&q=80" },
  { name: "Tanzanite", image: "https://images.unsplash.com/photo-1603561289423-68f5d0d69114?w=200&q=80" },
  { name: "Tourmaline", image: "https://images.unsplash.com/photo-1596906260846-9761e3895e6d?w=200&q=80" },
];

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
  const marqueeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ★修正版：時間を指定してゆっくり速度を変える関数
  const smoothSpeed = (target) => {
    const element = marqueeRef.current;
    if (!element) return;

    // スクロールアニメーションを取得
    const animations = element.getAnimations();
    const scrollAnim = animations.find(a => a.animationName === 'scrollLeft') || animations[0];
    if (!scrollAnim) return;

    // 現在の速度と開始時間を記録
    const startRate = scrollAnim.playbackRate;
    const startTime = performance.now();
    const duration = 1000; // ★ここを1000ms（1秒）に設定

    // 前のループがあればキャンセル
    if (element.dataset.rafId) cancelAnimationFrame(Number(element.dataset.rafId));

    const step = (now) => {
      const elapsed = now - startTime;
      let progress = elapsed / duration;
      if (progress > 1) progress = 1;

      // 線形補間（現在の値から目標値へ、時間の経過とともに近づける）
      scrollAnim.playbackRate = startRate + (target - startRate) * progress;

      if (progress < 1) {
        element.dataset.rafId = String(requestAnimationFrame(step));
      } else {
        // 完了したら目標値に固定
        scrollAnim.playbackRate = target;
      }
    };

    element.dataset.rafId = String(requestAnimationFrame(step));
  };

  const breakpointColumnsObj = {
    default: 4,  // PCなど基本は4列
    1024: 3,     // 1024px以下は3列
    768: 2       // 768px以下（スマホ）は2列
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? "scrolled" : "transparent"}`}>
        {/* 左側：ロゴのみにする */}
        <div className="header-left">
          <Link href="/" className="header-logo-container">
            <span className="logo-main">Jewelism</span>
            <span className="logo-sub">MARKET</span>
          </Link>
        </div>

        {/* 右側：アイコン群（検索・お気に入り・メニュー） */}
        <div className="header-icons">
          {/* 検索アイコン（既存） */}
          <div className="icon-btn">
             <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          
          {/* お気に入りアイコン（既存） */}
          <div className="icon-btn">
             <svg className="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </div>

          {/* ★変更：カートを削除し、ここにハンバーガーメニューを移動 */}
          {/* デザイン統一のため icon-btn クラスを使用 */}
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
          <div className="marquee-container">
            <div className="marquee-content" ref={marqueeRef}>
              {[...categories, ...categories].map((cat, index) => (
                <div 
                  key={index} 
                  className="category-card"
                  // ★マウスが乗ったら速度0へ、離れたら速度1へ（1秒かけて）
                  onMouseEnter={() => smoothSpeed(0)} 
                  onMouseLeave={() => smoothSpeed(1)}
                >
                  <img src={cat.image} alt={cat.name} className="category-thumb" />
                  <span className="category-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="main-container">
        {/* ★変更：div を Masonry コンポーネントに置き換え */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <div key={item.id} className="pin-card">
              {/* ...（カードの中身はそのまま変更なし）... */}
              <div className="pin-image-wrapper">
                <img src={item.image} alt={item.name} className="pin-image" />
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