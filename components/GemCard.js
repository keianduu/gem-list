"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function GemCard({ cat }) {
    return (
        <Link
            href={`/gems/${cat.slug}`}
            className="category-index-card"
        >
            <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '12px' }}>
                {cat.image?.url ? (
                    <Image
                        src={cat.image.url}
                        alt={cat.name}
                        fill
                        sizes="100px"
                        style={{ objectFit: 'contain' }}
                        className="category-index-thumb"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee', borderRadius: '50%' }}></div>
                )}
            </div>
            <span className="category-index-name">{cat.name}</span>
            {cat.yomigana && (
                <span className="category-index-name-ja">{cat.yomigana}</span>
            )}
            {cat.nameJa && (
                <span className="category-index-name-ja">{cat.nameJa}</span>
            )}
        </Link>
    );
}
