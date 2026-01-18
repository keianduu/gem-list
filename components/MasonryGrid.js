/* components/MasonryGrid.js */
"use client";

import Masonry from 'react-masonry-css';
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from '@/hooks/useFavorites';

export default function MasonryGrid({ items }) {
  const breakpointColumnsObj = { default: 4, 1024: 3, 768: 2 };
  const { toggleFavorite, checkIsFavorite, isLoaded } = useFavorites();

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

        const isFav = isLoaded ? checkIsFavorite(item.id) : false;

        // 画像データの判定
        const isStringUrl = typeof item.image === 'string';
        const imageUrl = isStringUrl ? item.image : item.image?.url;

        return (
          <div key={item.id} className="pin-card-wrapper">
            <Link
              href={href}
              className="pin-card"
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              <div className="pin-image-wrapper">
                {/* ★修正: 画像タイプによるタグの使い分け 
                  - 文字列(外部URL) -> <img> (規約対策 + lazy load)
                  - オブジェクト(microCMS) -> <Image> (最適化 + キャッシュ)
                */}
                {isStringUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="pin-image"
                    //loading="lazy"    // 遅延読み込み
                    decoding="async"  // 非同期デコード
                  />
                ) : imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    width={item.image.width || 600}
                    height={item.image.height || 800}
                    className="pin-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}

                {/* 広告・PRラベル (画像上) */}
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

              {/* テキスト情報 */}
              <div className="pin-info">
                {/* カテゴリ行 */}
                <div className="pin-category-row">
                  <div className="pin-category-wrapper">
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

                  {/* お気に入りボタン */}
                  <button
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    aria-label="Add to favorites"
                  >
                    <svg
                      className="fav-icon"
                      fill={isFav ? "#E60023" : "none"}
                      stroke={isFav ? "#E60023" : "#ccc"}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <h3 className="pin-title">{item.name}</h3>

                {item.desc && <p className="pin-desc">{item.desc}</p>}
                {isProduct && item.price && <p className="pin-price">{item.price}</p>}
              </div>
            </Link>
          </div>
        );
      })}
    </Masonry>
  );
}