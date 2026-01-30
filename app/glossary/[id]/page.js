/* app/glossary/[id]/page.js */
import { Suspense } from 'react';
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { GLOSSARY_DATA } from "@/libs/glossaryData";
import GlossaryBackButton from "@/components/GlossaryBackButton";

// 静的パス生成
export async function generateStaticParams() {
    return GLOSSARY_DATA.map((term) => ({
        id: term.id.toString(),
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const term = GLOSSARY_DATA.find(t => t.id.toString() === id);
    if (!term) return { title: "用語が見つかりません" };
    return {
        title: `${term.name_jp} (${term.name_en}) とは？ - 宝石用語集`,
        description: term.summary,
    };
}

export default async function GlossaryDetailPage({ params }) {
    const { id } = await params;
    const term = GLOSSARY_DATA.find(t => t.id.toString() === id);

    if (!term) return <div className="p-20 text-center">Term Not Found</div>;

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Glossary", path: "/glossary" },
        { label: term.name_jp, path: `/glossary/${term.id}` }
    ];

    // 改行コードを <br> に変換
    const descriptionHtml = term.description.replace(/\n/g, '<br />');

    return (
        <>
            <SiteHeader />

            {/* 既存の .category-main を使って構造を統一 */}
            <main className="category-main">

                {/* --- Header Section (宝石詳細ページと同じスタイル) --- */}
                <section className="category-header !pb-0">

                    <h1 className="category-title-ja">{term.name_jp}</h1>
                    <p className="category-title-en" style={{ marginBottom: 0 }}>{term.name_en}</p>
                </section>

                {/* --- Content Section (Infographic Style) --- */}
                <section className="gem-infographic-section">
                    <div className="infographic-header">
                        <span className="concept-label">Term Details</span>
                        <h2 className="infographic-title">{term.category_en}</h2>
                        <p className="category-title-ja" style={{ marginBottom: 0 }}>{term.category_jp}</p>
                    </div>

                    <div className="infographic-grid">
                        {/* Full Width Card for Content */}
                        <div className="info-glass-card full-width">

                            {/* Header Row: Icon + Label */}
                            <div className="info-header-row mb-6">
                                <h3 className="info-label">SUMMARY</h3>
                            </div>

                            {/* Catchy Summary (Large Text) */}
                            <p className="font-jp text-lg font-medium text-gray-800 border-b border-gray-200/50 pb-4 mb-6 leading-relaxed">
                                {term.summary}
                            </p>

                            {/* Main Description */}
                            <div
                                className="font-jp text-sm text-gray-600 leading-loose"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />

                        </div>
                    </div>

                    <Suspense fallback={null}>
                        <GlossaryBackButton />
                    </Suspense>

                    <div className="mt-12 text-center">
                        <a href="/glossary" className="text-gray-400 hover:text-navy text-xs font-en tracking-widest transition-colors">
                            ← BACK TO GLOSSARY
                        </a>
                    </div>

                </section>

            </main>

            <Breadcrumb items={breadcrumbItems} />
            <SiteFooter />
        </>
    );
}