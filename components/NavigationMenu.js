"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function NavigationMenu({ isOpen, onClose }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ページ遷移したら自動で閉じる
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // スクロールロック制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const menuContent = (
    <div className={`nav-overlay ${isOpen ? 'open' : ''}`}>
      {/* 背景の装飾 (Orbs) - メニュー内でも雰囲気を維持 */}
      <div className="nav-bg-deco"></div>

      <div className="nav-container">
        {/* 閉じるボタン */}
        <button className="nav-close-btn" onClick={onClose} aria-label="Close Menu">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="nav-content-wrapper">
          {/* メインナビゲーション */}
          <nav className="nav-main-links">
            <ul className="nav-list">
              <li style={{ '--delay': '0.1s' }}>
                <Link href="/" className="nav-link">
                  <span className="en">Home</span>
                  <span className="ja">トップページ</span>
                </Link>
              </li>
              <li style={{ '--delay': '0.2s' }}>
                <Link href="/about" className="nav-link">
                  <span className="en">About</span>
                  <span className="ja">Jewelism Marketについて</span>
                </Link>
              </li>
              <li style={{ '--delay': '0.3s' }}>
                <Link href="/gems" className="nav-link">
                  <span className="en">Gemstones</span>
                  <span className="ja">宝石カテゴリ一覧</span>
                </Link>
              </li>
              <li style={{ '--delay': '0.4s' }}>
                <Link href="/rough-stones" className="nav-link">
                  <span className="en">Rough Stones</span>
                  <span className="ja">原石図鑑</span>
                </Link>
              </li>
              <li style={{ '--delay': '0.5s' }}>
                <Link href="/search" className="nav-link">
                  <span className="en">Search All</span>
                  <span className="ja">全てのアイテムを探す</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* サブリンク / ユーティリティ */}
          <div className="nav-sub-links" style={{ '--delay': '0.6s' }}>
            <Link href="/favorites" className="sub-link">
              Favorites (お気に入り)
            </Link>
            <Link href="/about#contact" className="sub-link">
              Contact (お問い合わせ)
            </Link>
            <Link href="/privacy-policy" className="sub-link">
              Privacy Policy
            </Link>
          </div>

          <div className="nav-footer" style={{ '--delay': '0.7s' }}>
            <p className="nav-copyright">&copy; 2025 Jewelism Market.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}