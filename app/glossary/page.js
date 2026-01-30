/* app/glossary/page.js */
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import { GLOSSARY_DATA } from "@/libs/glossaryData";

export const metadata = {
    title: "Gemstone Glossary - 宝石用語集 | Jewelism Market",
    description: "宝石にまつわる専門用語、カットの種類、歴史的な背景などをわかりやすく解説します。",
};

export default function GlossaryPage() {
    // カテゴリごとにグループ化
    const groupedTerms = GLOSSARY_DATA.filter(term => term.isTooltipEnabled !== false).reduce((acc, term) => {
        const cat = term.category_en || "Others";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(term);
        return acc;
    }, {});

    const categoryLabelMap = GLOSSARY_DATA.reduce((acc, term) => {
        if (term.category_en && term.category_jp) {
            acc[term.category_en] = term.category_jp;
        }
        return acc;
    }, {});

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Glossary", path: "/glossary" }
    ];

    return (
        <>
            <SiteHeader />
            <main className="glossary-main">
                <section className="glossary-container">
                    <PageTitle
                        enLabel="Dictionary"
                        title="Gemstone Glossary"
                        subtitle="宝石用語集"
                    />

                    <div className="glossary-content">
                        {Object.keys(groupedTerms).sort().map((catEn) => (
                            <div key={catEn} className="glossary-section">
                                <div className="glossary-section-header">
                                    <h3>{catEn}</h3>
                                    <span>{categoryLabelMap[catEn]}</span>
                                </div>

                                <div className="glossary-grid">
                                    {groupedTerms[catEn].map((term) => (
                                        <Link
                                            href={`/glossary/${term.id}`}
                                            key={term.id}
                                            className="glossary-card"
                                        >
                                            <div className="glossary-card-header">
                                                <span className="glossary-name-jp">{term.name_jp}</span>
                                                <span className="glossary-name-en">{term.name_en}</span>
                                            </div>
                                            <p className="glossary-summary">
                                                {term.summary}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Breadcrumb items={breadcrumbItems} />
            <SiteFooter />
        </>
    );
}