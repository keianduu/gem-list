import Image from "next/image";
import Link from "next/link";
import { client } from "@/libs/microcms";
import { GEMS_DB, GROUP_IDEALS } from "@/libs/diagnosisData";
import AxisMeter from "@/components/diagnosis/AxisMeter";
import ItemCollection from "@/components/ItemCollection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import DeepDiveButton from "@/components/diagnosis/DeepDiveButton";
import ReDiagnosisButton from "@/components/diagnosis/ReDiagnosisButton";
import StartDiagnosisButton from "@/components/diagnosis/StartDiagnosisButton";
import GemPageNavigation from "@/components/GemPageNavigation";
import GemStoneLinks from "@/components/GemStoneLinks";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // microCMSから宝石情報を取得
    const cmsData = await client.get({
        endpoint: "jewelry-categories",
        queries: { filters: `slug[equals]${slug}` },
        customRequestInit: { next: { tags: ['gem'] } },
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
    const { s, ax, mode } = resolvedSearchParams;

    // 1. microCMSから宝石カテゴリ基本情報を取得
    const cmsData = await client.get({
        endpoint: "jewelry-categories",
        queries: { filters: `slug[equals]${slug}` },
        customRequestInit: { next: { tags: ['gem'] } },
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

    // 4. URLパラメータから4軸スコアを復元 (ax=world,orient,judge,approach)
    const axisArray = ax ? ax.split(',').map(Number) : [];
    const axisScores = {
        world: axisArray[0] || 50,
        orient: axisArray[1] || 50,
        judge: axisArray[2] || 50,
        approach: axisArray[3] || 50
    };

    // 5. 関連アイテム取得
    const relatedArchives = category ? await client.get({
        endpoint: "archive",
        queries: {
            filters: `relatedJewelries[contains]${category.id}`,
            limit: 6,
            orders: "-priority,-publishedAt",
        },
        customRequestInit: { next: { tags: ['gem'] } },
    }) : { contents: [] };

    if (!diagnosisGem) {
        return <div className="p-20 text-center">Result not found.</div>;
    }
    // ★追加: 相性の良い宝石（Compatible Gems）のデータをmicroCMSから取得
    const compatibleSlugs = diagnosisGem.compatibleGems?.map(g => g.slug) || [];
    let compatibleGemsData = [];

    if (compatibleSlugs.length > 0) {
        try {
            const filtersQuery = compatibleSlugs.map(s => `slug[equals]${s}`).join('[or]');
            const res = await client.get({
                endpoint: "jewelry-categories",
                queries: {
                    filters: filtersQuery,
                    fields: "id,name,nameJa,yomigana,slug,image" // yomiganaを追加
                },
                customRequestInit: { next: { tags: ['gem'] } },
            });
            compatibleGemsData = compatibleSlugs.map(slug =>
                res.contents.find(c => c.slug === slug)
            ).filter(Boolean);
        } catch (e) {
            console.error("Compatible gems fetch error:", e);
        }
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
                        {/* 5. COMPATIBILITY (100%幅のリッチカード) */}
                        <div className="info-glass-card full-width">
                            <div className="info-header-row mb-6">
                                <h3 className="info-label">COMPATIBILITY</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {compatibleGemsData.map((gem) => {
                                    const config = diagnosisGem.compatibleGems.find(cg => cg.slug === gem.slug);
                                    // compatibility文字列から、この宝石に関する説明行を抽出
                                    const detailText = diagnosisGem.compatibility
                                        .split('\n')
                                        .find(line => line.includes(gem.name)) || diagnosisGem.compatibility;

                                    return (
                                        <Link
                                            key={gem.id}
                                            href={`/gems/${gem.slug}/diagnosis`}
                                            className="flex flex-row items-center gap-6 p-6 bg-white/40 rounded-[32px] border border-gold/10 hover:border-gold/30 hover:bg-white/70 transition-all group min-h-[140px]"
                                        >
                                            {/* 宝石サムネイル */}
                                            {gem.image && (
                                                <div className="relative flex-shrink-0 flex items-center justify-center bg-white/50 rounded-xl p-2">
                                                    <Image
                                                        src={gem.image.url}
                                                        alt={gem.name}
                                                        width={48}  /* 元のサイズより小さく設定 */
                                                        height={48}
                                                        style={{ objectFit: 'contain' }}
                                                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            {/* テキスト情報 */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="mb-3">
                                                    <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark text-[10px] font-bold tracking-widest uppercase rounded-full mb-2">
                                                        {config?.label || "PARTNER"}
                                                    </span>
                                                    <h4 className="font-jp font-medium text-gray-800 leading-tight">
                                                        {gem.name}
                                                    </h4>
                                                    {/* よみがなを縦に配置 */}
                                                    <span className="text-[10px] text-gray-400 font-normal leading-tight">
                                                        {gem.yomigana}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-jp text-gray-500 leading-relaxed line-clamp-2">
                                                    {config?.description}
                                                </p>
                                            </div>

                                            {/* 矢印 (PCのみ) */}
                                            <div className="hidden md:flex items-center self-center pr-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-gold">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 18l6-6-6-6" />
                                                </svg>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>


                        </div>
                        {/* 2. チャート (Half) */}
                        <div className="info-glass-card">
                            <div className="info-header-row">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <h3 className="info-label">ANALYSIS (4-AXIS)</h3>
                            </div>
                            <div className="flex items-center justify-center h-full pb-4">
                                <AxisMeter axisPercent={axisScores} />
                            </div>
                        </div>
                        {/* 6. GEMOLOGICAL BACKGROUND (独立したカード) */}
                        <div className="info-glass-card">
                            <div className="info-header-row mb-4">
                                <div className="info-icon text-blue-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <h3 className="info-label">GEMOLOGICAL BACKGROUND</h3>
                            </div>
                            <div className="p-2">
                                <p className="font-jp text-sm text-gray-600 leading-loose">
                                    {diagnosisGem.academic}
                                </p>
                            </div>
                        </div>

                        {/* 3. Deep Dive / Rarity (Half) */}
                        <div className="info-glass-card flex flex-col justify-center items-center text-center full-width">
                            {/* パラメータがない場合 (直接ランディング) */}
                            {(!s && !ax) ? (
                                <>
                                    <h4 className="font-jp text-lg mb-4 text-gray-800">あなたを宝石に例えると？</h4>
                                    <p className="font-jp text-xs text-gray-500 mb-6 leading-relaxed">
                                        質問に答えて<br />あなたの宝石を分析します。
                                    </p>
                                    <StartDiagnosisButton />
                                </>
                            ) : (!mode || mode !== 'deep') ? (
                                /* パラメータあり & DeepDive未実施 */
                                <>
                                    <h4 className="font-jp text-lg mb-4 text-gray-800">深層心理を探る</h4>
                                    <p className="font-jp text-xs text-gray-500 mb-6 leading-relaxed">
                                        さらに20の問いで、<br />あなたの無意識を分析します。
                                    </p>
                                    <DeepDiveButton />
                                </>
                            ) : (
                                /* DeepDive実施済み (Rarity表示) */
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

                    </div>
                    {/* 再診断ボタン (パラメータがある場合のみ表示) */}
                    {(s || ax) && (
                        <div className="mt-12 text-center border-t border-gray-200/50 pt-8">
                            <p className="text-[10px] text-gray-400 mb-4 font-jp tracking-wider">
                                結果に違和感がある場合は、もう一度お試しいただけます
                            </p>
                            <ReDiagnosisButton />
                        </div>
                    )}
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