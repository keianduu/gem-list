"use client";

import Masonry from 'react-masonry-css';

export default function MasonryGrid({ items }) {
  const breakpointColumnsObj = { default: 4, 1024: 3, 768: 2 };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {items.map((item) => (
        <div key={item.id} className="pin-card">
          <div className="pin-image-wrapper">
            <img src={item.image} alt={item.name} className="pin-image" />
            <span className={`type-badge ${item.type === 'product' ? 'type-product' : 'type-article'}`}>
              {item.type === 'product' ? 'ITEM' : 'JOURNAL'}
            </span>
          </div>
          <div className="pin-info">
            <h3 className="pin-title">{item.name}</h3>
            {item.type === 'product' ? <p className="pin-price">{item.price}</p> : <p className="pin-meta">{item.desc}</p>}
          </div>
        </div>
      ))}
    </Masonry>
  );
}