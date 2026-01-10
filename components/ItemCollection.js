/* components/ItemCollection.js */
"use client";

import MasonryGrid from "./MasonryGrid";

export default function ItemCollection({ 
  items, 
  title, 
  subtitle = "More Stories & Items", 
  emptyMessage = "現在、関連するアイテムはありません。" 
}) {
  return (
    // ★修正: maxWidth, margin指定を削除し、レイアウトは親コンテナ(.category-mainなど)に任せる
    <section className="item-collection-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {subtitle && (
          <span style={{ 
            fontFamily: 'var(--font-en)', fontSize: '0.8rem', letterSpacing: '0.1em', 
            color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px' 
          }}>
            {subtitle}
          </span>
        )}
        <h2 style={{ 
          fontFamily: 'var(--font-en)', fontSize: '2rem', fontWeight: '400', color: '#111' 
        }}>
          {title}
        </h2>
      </div>
      
      {items.length > 0 ? (
        <MasonryGrid items={items} />
      ) : (
        <p style={{ 
          textAlign: "center", 
          color: "#999", 
          fontSize: "0.9rem",
          marginTop: "40px",
          marginBottom: "80px"
        }}>
          {emptyMessage}
        </p>
      )}
    </section>
  );
}