/* components/MasonryGrid.js */
"use client";

import Masonry from 'react-masonry-css';
import Link from "next/link";
import Image from "next/image";

export default function MasonryGrid({ items }) {
  const breakpointColumnsObj = { default: 4, 1024: 3, 768: 2 };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {items.map((item) => {
        const href = item.link || (item.id ? `/products/${item.id}` : "#");
        const isExternal = href.startsWith("http");
        const isProduct = item.type === 'product';

        return (
          <div key={item.id} className="pin-card-wrapper">
            <Link 
              href={href}
              className="pin-card"
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              <div className="pin-image-wrapper">
                {/* メイン画像 */}
                {typeof item.image === 'string' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image} alt={item.name} className="pin-image" />
                ) : item.image?.url ? (
                  <Image 
                    src={item.image.url} 
                    alt={item.name} 
                    width={item.image.width || 600} 
                    height={item.image.height || 800} 
                    className="pin-image" 
                  />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
                
                {/* ★移動: 広告・PR表記を画像の上に配置 */}
                {isProduct && (
                  <span className="ad-label">広告・PR</span>
                )}
                
                {/* オーバーレイ */}
                <div className="pin-overlay">
                  <div className={`action-btn ${isProduct ? 'btn-shop' : 'btn-read'}`}>
                    {isProduct ? (
                      <>
                        <span>Shop Now</span>
                        <svg className="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Read Story</span>
                        <svg className="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* テキスト情報エリア */}
              <div className="pin-info">
                
                {/* (ここにあった ad-label は削除) */}

                {/* カテゴリ (アイコン + テキスト) */}
                <div className="pin-category-row">
                  {item.categoryIcon && (
                    <Image 
                      src={item.categoryIcon} 
                      alt="" 
                      width={20} 
                      height={20}
                      className="pin-category-icon"
                    />
                  )}
                  <span className="pin-category">{item.category}</span>
                </div>
                
                <h3 className="pin-title">{item.name}</h3>
                
                {item.desc && (
                  <p className="pin-desc">{item.desc}</p>
                )}

                {isProduct && item.price && (
                  <p className="pin-price">{item.price}</p>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </Masonry>
  );
}