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
    // ★修正: padding: '0' を削除し、className="item-collection-container" を追加
    <section className="item-collection-container" style={{ maxWidth: '1200px', margin: '100px auto 0' }}>
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