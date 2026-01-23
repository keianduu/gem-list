"use client";

import Link from 'next/link';

export default function GemTabNavigation({ activeTab }) {
    return (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="content-type-tabs">
                <Link
                    href="/gems"
                    className={`type-tab ${activeTab === 'all' ? 'active' : ''}`}
                // Linkコンポーネントはデフォルトでaタグをレンダリングするため、buttonスタイルを適用可能
                // ただし、nav-linkとして機能させる
                >
                    All Gemstones
                </Link>
                <Link
                    href="/birthstones"
                    className={`type-tab ${activeTab === 'birthstone' ? 'active' : ''}`}
                >
                    By Birthstone
                </Link>
            </div>
        </div>
    );
}
