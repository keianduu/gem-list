/* components/SiteHeader.js */
"use client"; // ★重要: ブラウザ側でスクロールを検知するために必要

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SiteHeader() {
  // スクロール状態を管理するstate
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 50px以上スクロールしたら背景を表示 (true)
      setIsScrolled(window.scrollY > 50);
    };

    // イベントリスナー登録
    window.addEventListener("scroll", handleScroll);
    
    // 初回ロード時にも位置を確認（リロード対策）
    handleScroll();

    // クリーンアップ（コンポーネントが消える時にイベントを解除）
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // isScrolled が true なら "scrolled" (白背景)、false なら "transparent" (透明)
    <header className={`site-header ${isScrolled ? "scrolled" : "transparent"}`}>
      <div className="header-left">
        <Link href="/" className="header-logo-container">
          <span className="logo-main">Jewelism</span>
          <span className="logo-sub">MARKET</span>
        </Link>
      </div>
      
      <div className="header-icons">
        <div className="icon-btn" aria-label="Favorites">
          <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="icon-btn" aria-label="My Page">
          <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="icon-btn" aria-label="Menu">
          <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>
    </header>
  );
}