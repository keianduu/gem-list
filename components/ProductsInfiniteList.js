"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import MasonryGrid from './MasonryGrid';
import { getManagementItems } from '@/app/actions/itemActions';

export default function ProductsInfiniteList({ initialItems }) {
    const [items, setItems] = useState(initialItems);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef(null);

    useEffect(() => {
        if (initialItems.length < 24) {
            setHasMore(false);
        }
    }, [initialItems]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const { contents, totalCount } = await getManagementItems({
            offset: items.length,
            limit: 24
        });

        setItems(prev => [...prev, ...contents]);

        if (items.length + contents.length >= totalCount) {
            setHasMore(false);
        }
        setIsLoading(false);
    }, [hasMore, isLoading, items.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { root: null, rootMargin: "400px", threshold: 0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadMore, hasMore, isLoading]);

    return (
        <div>
            <MasonryGrid items={items} />

            {/* Loader / Sentinel */}
            <div ref={loaderRef} style={{ height: '60px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
                {isLoading && (
                    <div className="skeleton-circle" style={{ width: '30px', height: '30px', border: '2px solid #ccc', borderTop: '2px solid #333' }}></div>
                )}
            </div>
        </div>
    );
}
