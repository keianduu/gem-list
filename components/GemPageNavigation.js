import Link from 'next/link';

export default function GemPageNavigation({ slug, activeTab, searchParams }) {
    // クエリパラメータ(診断スコア等)があれば維持してリンクを生成
    // これにより、タブを行き来しても診断結果がリセットされません
    const queryString = searchParams && Object.keys(searchParams).length > 0
        ? '?' + new URLSearchParams(searchParams).toString()
        : '';

    // タブの定義（将来ページが増えたらここに追加するだけでOK）
    const tabs = [
        { id: 'overview', label: 'Encyclopedia', path: `/gems/${slug}` },
        { id: 'diagnosis', label: 'Diagnosis Data', path: `/gems/${slug}/diagnosis${queryString}` },
        // 例: 将来の拡張
        // { id: 'history', label: 'History', path: `/gems/${slug}/history` },
    ];

    return (
        <div className="flex justify-center w-full mt-8 mb-12 relative z-20">
            <div className="content-type-tabs"> {/* 既存のデザインクラスを再利用 */}
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={tab.path}
                        className={`type-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}