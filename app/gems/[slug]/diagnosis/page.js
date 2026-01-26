import Image from "next/image";
import Link from "next/link";
import { client } from "@/libs/microcms";
import { GEMS_DB, GROUP_IDEALS } from "@/libs/diagnosisData";
import RadarChart from "@/components/diagnosis/RadarChart";
import ItemCollection from "@/components/ItemCollection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import DeepDiveButton from "@/components/diagnosis/DeepDiveButton";
import ReDiagnosisButton from "@/components/diagnosis/ReDiagnosisButton";
import GemPageNavigation from "@/components/GemPageNavigation";
import GemStoneLinks from "@/components/GemStoneLinks";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // microCMSから宝石情報を取得
    const cmsData = await client.get({
        endpoint: "jewelry-categories",
        queries: { filters: `slug[equals]${slug}` },
    });
    const category = cmsData.contents[0];

    if (!category) {
        return { title: "宝石診断結果 | Jewelism Market" };
    }

    const jaName = category.nameJa ? `${category.nameJa}` : "";
    const enName = category.name;

    const title = `${enName} (${jaName}) タイプ | あなたの心理や感情を表す宝石診断の結果`;
    const description = `【宝石診断結果】あなたの深層心理や感情を表す宝石は「${enName}（${jaName}）」です。内面に秘めた強みを専門的なデータから解析。宝石が持つ学術的背景とあなたの個性が結びつく、特別な診断結果をご覧ください。`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [category.image?.url],
        },
    };
}


export default async function DiagnosisResultPage({ params, searchParams }) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const { s, mode } = resolvedSearchParams;

    // 1. microCMSから宝石カテゴリ基本情報を取得
    const cmsData = await client.get({
        endpoint: "jewelry-categories",
        queries: { filters: `slug[equals]${slug}` },
    });
    const category = cmsData.contents[0];

    // 2. 診断データからテキスト情報を取得
    const diagnosisGem = Object.values(GEMS_DB).find(g => g.slug === slug);

    // 3. URLパラメータからスコアを復元
    const scoreArray = s ? s.split(',').map(Number) : [];
    const scores = {
        A: scoreArray[0] || 0, B: scoreArray[1] || 0, C: scoreArray[2] || 0, D: scoreArray[3] || 0,
        E: scoreArray[4] || 0, F: scoreArray[5] || 0, G: scoreArray[6] || 0, H: scoreArray[7] || 0
    };

    // 4. 宝石の理想スコアを取得
    const groupId = diagnosisGem?.id?.split('-')[0];
    const idealValues = groupId && GROUP_IDEALS[groupId] ? GROUP_IDEALS[groupId] : [];
    const gemScores = {
        A: idealValues[0] || 0, B: idealValues[1] || 0, C: idealValues[2] || 0, D: idealValues[3] || 0,
        E: idealValues[4] || 0, F: idealValues[5] || 0, G: idealValues[6] || 0, H: idealValues[7] || 0
    };

    // 5. 関連アイテム取得
    const relatedArchives = category ? await client.get({
        endpoint: "archive",
        queries: {
            filters: `relatedJewelries[contains]${category.id}`,
            limit: 6,
            orders: "-priority,-publishedAt",
        }
    }) : { contents: [] };

    if (!diagnosisGem) {
        return <div className="p-20 text-center">Result not found.</div>;
    }
    // ★追加: パンくずリストの定義 (HOME > 宝石図鑑 > 宝石名 > 診断データ)
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "All Gemstones", path: "/gems" },
        { label: category?.name || diagnosisGem.name, path: `/gems/${slug}` },
        { label: "Diagnosis Data", path: `/gems/${slug}/diagnosis` }
    ];
    const items = relatedArchives.contents.map(content => {
        const isProduct = content.type.includes('product');
        const displayCategoryName = category ? category.name : (isProduct ? "Item" : "Journal");
        const displayCategoryIcon = category?.image?.url || null;

        return {
            id: content.slug,
            type: isProduct ? 'product' : 'journal',
            name: content.title,
            price: isProduct && content.price ? `¥${Number(content.price).toLocaleString()}` : null,
            desc: content.description, // カードに概要を表示するために追加
            image: isProduct ? content.thumbnailUrl : content.thumbnail,
            // リンク先を判定: 商品なら外部URL(アフィリエイト)、記事なら詳細ページへ
            link: isProduct ? content.affiliateUrl : `/journals/${content.slug}`,
            category: displayCategoryName,
            categoryIcon: displayCategoryIcon,
        };
    });

    return (
        <>
            <SiteHeader />

            {/* ★修正: .category-main を適用してレイアウトを統一 */}
            <main className="category-main">

                {/* --- ヘッダー (宝石詳細ページと統一) --- */}
                <section className="category-header !pb-0">
                    <div className="category-header-icon-wrapper" style={{ position: 'relative' }}>
                        {category?.image ? (
                            <Image
                                src={category.image.url}
                                alt={category.name}
                                fill
                                sizes="100px"
                                style={{ objectFit: 'contain' }}
                                className="category-header-img"
                            />
                        ) : (
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl border border-gold/20">💎</div>
                        )}
                    </div>

                    <h1 className="category-title-en">{category?.name || diagnosisGem.name}</h1>

                    <div style={{ marginBottom: '24px' }}>
                        {category?.yomigana && (
                            <p className="category-title-ja" style={{ marginBottom: category.nameJa ? '4px' : '0' }}>
                                {category.yomigana}
                            </p>
                        )}
                        {category?.nameJa && (
                            <p className="category-title-ja" style={{ marginBottom: '0' }}>
                                {category.nameJa}
                            </p>
                        )}
                    </div>

                    <GemPageNavigation
                        slug={slug}
                        activeTab="diagnosis"
                        searchParams={resolvedSearchParams}
                    />
                </section>

                {/* --- 診断結果コンテンツ (Infographic Section) --- */}
                <section className="gem-infographic-section">
                    <div className="infographic-header">
                        <span className="concept-label">Analysis Result</span>
                        <h2 className="infographic-title">Your Guardian Gem</h2>
                    </div>

                    <div className="infographic-grid">

                        {/* 1. 基本性格 (Full Width) */}
                        <div className="info-glass-card full-width">
                            <div className="info-header-row">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 17.5 3 20.58 3 23 5.42 23 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <h3 className="info-label">PERSONALITY & NATURE</h3>
                            </div>

                            <div className="mb-6">
                                <p className="font-jp text-lg font-medium text-gray-800 border-b border-gray-200/50 pb-4 mb-4">
                                    {diagnosisGem.catchCopy}
                                </p>
                                <p className="font-jp text-sm text-gray-600 leading-loose">
                                    {diagnosisGem.nature}
                                </p>
                            </div>

                            {/* Keywords */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {diagnosisGem.keywords && diagnosisGem.keywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/50 text-gray-500 text-xs rounded-full border border-gray-200 font-jp">
                                        #{kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* 2. 詳細情報 (Weakness / Love) */}
                        <div className="info-glass-card">
                            <h4 className="text-gold font-en tracking-widest mb-3 text-xs">WEAKNESS</h4>
                            <p className="font-jp text-sm text-gray-600 leading-loose">
                                {diagnosisGem.weakness}
                            </p>
                        </div>

                        <div className="info-glass-card">
                            <h4 className="text-gold font-en tracking-widest mb-3 text-xs">LOVE & RELATIONSHIP</h4>
                            <p className="font-jp text-sm text-gray-600 leading-loose">
                                {diagnosisGem.love}
                            </p>
                        </div>

                        {/* 2. チャート (Half) */}
                        <div className="info-glass-card">
                            <div className="info-header-row">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <h3 className="info-label">PARAMETER</h3>
                            </div>
                            <div className="flex items-center justify-center h-full pb-4">
                                <RadarChart scores={scores} gemScores={gemScores} />
                            </div>
                        </div>

                        {/* 3. Deep Dive / Rarity (Half) */}
                        <div className="info-glass-card flex flex-col justify-center items-center text-center">
                            {(!mode || mode !== 'deep') ? (
                                <>
                                    <h4 className="font-jp text-lg mb-4 text-gray-800">深層心理を探る</h4>
                                    <p className="font-jp text-xs text-gray-500 mb-6 leading-relaxed">
                                        さらに20の問いで、<br />あなたの無意識を分析します。
                                    </p>
                                    <DeepDiveButton />
                                </>
                            ) : (
                                <div className="w-full text-left">
                                    <div className="info-header-row">
                                        <div className="info-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                            </svg>
                                        </div>
                                        <h3 className="info-label">RARITY</h3>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-4xl font-en font-light text-gray-800">
                                            {diagnosisGem.rarity?.rank}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-jp uppercase tracking-wider">Type</span>
                                            <span className="text-sm font-jp text-gold">{diagnosisGem.rarity?.label}</span>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-xs text-gray-400 font-jp">
                                        出現率: {diagnosisGem.rarity?.rate}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 5. 相性 & 学術的背景 (Full Width) */}
                        <div className="info-glass-card full-width">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-gold font-en tracking-widest mb-3 text-xs">COMPATIBILITY</h4>
                                    <div className="font-jp text-sm text-gray-600 leading-loose whitespace-pre-wrap">
                                        {diagnosisGem.compatibility}
                                    </div>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gray-200/50 pt-6 md:pt-0 md:pl-8">
                                    <h4 className="text-gold font-en tracking-widest mb-3 text-xs">GEMOLOGICAL BACKGROUND</h4>
                                    <p className="font-jp text-sm text-gray-600 leading-loose">
                                        {diagnosisGem.academic}
                                    </p>
                                </div>
                            </div>

                            {/* 再診断ボタンエリア */}
                            <div className="mt-12 text-center border-t border-gray-200/50 pt-8">
                                <p className="text-xs text-gray-400 mb-4 font-jp">
                                    結果に違和感がある場合は、もう一度お試しいただけます
                                </p>
                                <ReDiagnosisButton />
                            </div>
                        </div>

                    </div>
                </section>

                <GemStoneLinks />

                {/* --- ★修正: タイトルを英語(category.name)に変更 --- */}
                <ItemCollection
                    items={items}
                    title={`${category?.name || diagnosisGem.name} Collections`}
                    subtitle="Related Items & Journals"
                    emptyMessage="関連するアイテムはありません"
                />

            </main>

            {/* ★追加: パンくずリストをフッターの上に配置 */}
            <Breadcrumb items={breadcrumbItems} />
            <SiteFooter />
        </>
    );
}