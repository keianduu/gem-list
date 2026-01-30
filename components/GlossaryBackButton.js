/* components/GlossaryBackButton.js */
"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function GlossaryBackButton() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    // fromパラメータがない場合（直接アクセスや検索流入など）は表示しない
    if (!from) return null;

    const handleBack = (e) => {
        e.preventDefault();
        // ブラウザの履歴を使って戻る（スクロール位置が復元される可能性が高い）
        router.back();
    };

    return (
        <div className="mt-8 mb-4 text-center">
            <button
                onClick={handleBack}
                className="group flex items-center justify-center mx-auto gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300"
            >
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="text-gray-400 group-hover:text-navy transition-colors"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <span className="text-sm font-jp text-gray-600 group-hover:text-navy transition-colors">
                    元の記事に戻る
                </span>
            </button>
            <p className="text-[10px] text-gray-400 mt-2 font-en tracking-wider">
                RETURN TO ARTICLE
            </p>
        </div>
    );
}