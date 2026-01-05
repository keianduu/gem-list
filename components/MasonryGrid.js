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

        return (
          <div key={item.id} className="pin-card-wrapper">
            <Link 
              href={href}
              className="pin-card"
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div className="pin-image-wrapper">
                {/* ▼▼▼ 画像表示ロジック修正 ▼▼▼ */}
                {typeof item.image === 'string' ? (
                  /* アフィリエイト画像(URL文字列) -> 通常のimgタグ (キャッシュ回避・設定不要) */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="pin-image"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                ) : item.image?.url ? (
                  /* microCMS画像(オブジェクト) -> Next/Image (最適化有効) */
                  <Image 
                    src={item.image.url} 
                    alt={item.name} 
                    width={item.image.width || 600}
                    height={item.image.height || 800}
                    className="pin-image"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                ) : (
                  <div style={{width:'100%', height:'200px', background:'#eee'}}></div>
                )}
                
                <span className={`type-badge ${item.type === 'product' ? 'type-product' : 'type-article'}`}>
                  {item.type === 'product' ? 'ITEM' : 'JOURNAL'}
                </span>
                
                <div className="pin-overlay">
                    <div className="save-btn">{item.type === 'product' ? 'Shop' : 'Read'}</div>
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
            </Link>
          </div>
        );
      })}
    </Masonry>
  );
}