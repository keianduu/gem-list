/* app/page.js */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react"; // useRefは不要になるので削除でOK
import Masonry from 'react-masonry-css';
import { client } from "@/libs/microcms";

// ★追加：Swiper関連のインポート
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// ★追加：Swiperのスタイルシート
import 'swiper/css';
import 'swiper/css/free-mode';

const items = [
  // ... (ここは変更なし。そのまま残してください) ...
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
  // const marqueeRef = useRef(null); // ←これは削除してOK

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
          // ★ここを追加：フィルタリング設定
          queries: {
            filters: 'isVisible[equals]true', // isVisible が true のものだけ取得
            limit: 100, // (念のため) 件数制限を少し増やしておく
          }
        });
        setCategories(data.contents);
      } catch (err) {
        console.error("データ取得エラー:", err);
      }
    };
    fetchCategories();
  }, []);

  // ★ smoothSpeed 関数も削除してOKです（Swiperが自動でやってくれます）

  // ループが途切れないように、データが少ない場合は3回繰り返して配列を作る
  // (Swiperのloopモードを安定させるため)
  const loopCategories = categories.length > 0 
    ? [...categories, ...categories, ...categories, ...categories] 
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
          {loopCategories.length > 0 && (
            // ★ここからSwiperに変更
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={40}      // PCでのアイコン間隔
              slidesPerView="auto"   // コンテンツの幅に合わせて表示
              loop={true}            // 無限ループ
              speed={6000}           // 流れる速度（数値が大きいほどゆっくり）
              autoplay={{
                delay: 0,            // 停止時間なし（流れ続ける）
                disableOnInteraction: false, // 触っても自動再生を止めない
                pauseOnMouseEnter: true      // マウスホバーで一時停止
              }}
              freeMode={true}        // フリック（慣性スクロール）を有効にする
              allowTouchMove={true}  // タッチ操作許可
              breakpoints={{
                // スマホ(768px以下)の設定上書き
                320: {
                  spaceBetween: 12,  // スマホでの間隔（狭く）
                  speed: 5000,       // スマホは少し速くてもOK
                },
                768: {
                  spaceBetween: 40,
                }
              }}
              className="category-swiper"
            >
              {loopCategories.map((cat, index) => (
                // ★SwiperSlideで囲む（width: auto が重要）
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <div className="category-card">
                    <img src={cat.image?.url} alt={cat.name} className="category-thumb" />
                    <span className="category-name">{cat.name}</span>
                    {cat.nameJa && (
                      <span style={{ 
                        fontSize: '0.65rem', color: '#888', marginTop: '2px', 
                        fontFamily: 'var(--font-jp)', whiteSpace: 'normal', 
                        wordBreak: 'break-word', lineHeight: '1.2', 
                        display: 'block', width: '100%' 
                      }}>
                        {cat.nameJa}
                      </span>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Main, Footerはそのまま */}
      <main className="main-container">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <div key={item.id} className="pin-card">
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