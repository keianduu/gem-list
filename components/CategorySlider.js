/* components/CategorySlider.js */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CategorySlider({ categories }) {
  const scrollRef = useRef(null);
  const isPaused = useRef(false);
  const scrollPos = useRef(0);

  // カテゴリをループ用に倍にする
  const loopCategories = categories.length > 0 
    ? [...categories, ...categories]
    : [];

  // 自動スクロール処理
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || loopCategories.length === 0) return;

    scrollPos.current = container.scrollLeft;

    let animationId;
    const isMobile = window.innerWidth <= 768;
    const speed = isMobile ? 0.5 : 0.2;

    const scrollLoop = () => {
      if (container) {
        if (!isPaused.current) {
          scrollPos.current += speed;
          container.scrollLeft = scrollPos.current;

          // ループ判定 (半分まで来たら巻き戻し)
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
            scrollPos.current = 0;
          }
        } else {
          // 手動スクロール中
          scrollPos.current = container.scrollLeft;
        }
      }
      animationId = requestAnimationFrame(scrollLoop);
    };

    animationId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationId);
  }, [loopCategories]);

  const pauseScroll = () => { isPaused.current = true; };
  const resumeScroll = () => { isPaused.current = false; };

  if (categories.length === 0) {
    return (
      <div className="skeleton-container fade-in">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton-item">
            <div className="skeleton-circle"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="category-scroll-wrap" 
      ref={scrollRef}
      onMouseEnter={pauseScroll}
      onMouseLeave={resumeScroll}
      onTouchStart={pauseScroll}
      onTouchEnd={resumeScroll}
    >
      {loopCategories.map((cat, index) => (
        // ★修正: href を /category/... から /gems/... に変更
        <Link key={`${cat.id}-${index}`} href={`/gems/${cat.slug}`} className="category-card">
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
              fontSize: '0.65rem', color: '#888', marginTop: '2px', 
              fontFamily: 'var(--font-jp)', whiteSpace: 'normal', 
              wordBreak: 'break-word', lineHeight: '1.2', 
              display: 'block', width: '100%', textAlign: 'center'
            }}>
              {cat.yomigana}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}