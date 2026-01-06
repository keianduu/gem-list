/* components/SiteHeader.js */
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites"; // ★追加: フックをインポート

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // ★追加: お気に入り状態を取得
  const { favorites, isLoaded } = useFavorites();
  const hasFavorites = isLoaded && favorites.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? "scrolled" : "transparent"}`}>
      <div className="header-left">
        <Link href="/" className="header-logo-container">
          <span className="logo-main">Jewelism</span>
          <span className="logo-sub">MARKET</span>
        </Link>
      </div>
      
      <div className="header-icons">
        <Link href="/favorites" className="icon-btn" aria-label="Favorites">
          {/* ★追加: お気に入りがある場合のみドットを表示 */}
          {hasFavorites && <span className="icon-badge-dot"></span>}
          
          <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Link>
        
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