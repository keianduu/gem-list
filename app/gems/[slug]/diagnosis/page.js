import Image from "next/image";
import Link from "next/link";
import { client } from "@/libs/microcms";
import { GEMS_DB, GROUP_IDEALS } from "@/libs/diagnosisData";
import RadarChart from "@/components/diagnosis/RadarChart";
import ItemCollection from "@/components/ItemCollection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DeepDiveButton from "@/components/diagnosis/DeepDiveButton";

export default async function DiagnosisResultPage({ params, searchParams }) {
    const { slug } = await params;
    const { s, mode } = await searchParams;

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

    const items = relatedArchives.contents.map(content => ({
        id: content.slug,
        type: content.type.includes('product') ? 'product' : 'journal',
        name: content.title,
        price: content.price ? `¥${Number(content.price).toLocaleString()}` : null,
        image: content.thumbnailUrl || content.thumbnail?.url,
        category: category ? category.name : "Item"
    }));

    return (
        <>
            <SiteHeader />

            <main className="min-h-screen bg-[#F9F7F2] pb-20">

                {/* --- 結果ヘッダー (常時中央寄せ) --- */}
                <section className="pt-32 pb-12 px-6 text-center relative overflow-hidden text-gray-900">
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="orb orb-1" style={{ top: '10%', left: '10%' }}></div>
                        <div className="orb orb-3" style={{ top: '60%', right: '10%' }}></div>
                    </div>

                    <p className="font-en text-gold text-xs tracking-[0.3em] uppercase mb-4">
                        Analysis Result
                    </p>

                    {/* アイコン */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        {category?.image?.url ? (
                            <Image
                                src={category.image.url}
                                alt={diagnosisGem.name}
                                fill
                                className="object-contain drop-shadow-xl"
                            />
                        ) : (
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl border border-gold/20">💎</div>
                        )}
                    </div>

                    <h1 className="font-jp text-3xl md:text-4xl font-medium mb-4 tracking-wide">
                        {diagnosisGem.name}
                    </h1>
                    <p className="font-en text-gray-500 text-sm tracking-wider uppercase">
                        {diagnosisGem.catchCopy}
                    </p>
                </section>

                {/* --- 分析コンテンツ --- */}
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gold/20 relative">

                        {/* 1. 概要と基本データ (★修正: スマホ左寄せ / PC中央寄せ) */}
                        <div className="font-jp leading-loose mb-12 text-left md:text-center text-gray-600">

                            {/* レアリティ & キーワード (★修正: スマホ左揃え / PC中央揃え) */}
                            <div className="flex flex-wrap items-center gap-3 mb-8 justify-start md:justify-center">
                                {diagnosisGem.rarity && (
                                    <span
                                        className="px-3 py-1 text-[10px] font-en tracking-widest text-white rounded-full flex items-center gap-1"
                                        style={{ backgroundColor: diagnosisGem.rarity.color || '#c5a365' }}
                                    >
                                        ★ {diagnosisGem.rarity.rank}
                                    </span>
                                )}
                                {diagnosisGem.keywords && diagnosisGem.keywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                        #{kw}
                                    </span>
                                ))}
                            </div>

                            {/* サマリー見出し */}
                            <div className="mb-8">
                                <p className="text-lg font-medium text-gray-900 border-b border-gold/30 pb-4 inline-block">
                                    {diagnosisGem.summary}
                                </p>
                            </div>

                            {/* 本文 */}
                            <p className="text-gray-700 mb-6">{diagnosisGem.nature}</p>
                        </div>

                        {/* 2. パーソナルチャート (常時中央寄せ) */}
                        <div className="mb-16">
                            <h3 className="text-center font-en text-gold/80 mb-6 tracking-widest text-xs">
                                PERSONALITY CHART
                            </h3>
                            <p className="text-center text-[10px] text-gray-400 mb-4 font-jp">
                                <span className="inline-block w-3 h-3 bg-[#c5a365] mr-1 align-middle rounded-full"></span>あなた
                                <span className="mx-2">/</span>
                                <span className="inline-block w-3 h-3 border border-gray-400 mr-1 align-middle rounded-full"></span>この宝石の属性
                            </p>
                            <RadarChart scores={scores} gemScores={gemScores} />
                        </div>

                        {/* Deep Dive CTA */}
                        {(!mode || mode !== 'deep') && (
                            <div className="my-16 p-8 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
                                <h4 className="font-jp text-xl text-gray-900 mb-4">さらに深く分析しますか？</h4>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    ここまでの結果は「表層意識」に基づいています。<br />
                                    さらに20の問いに答えることで、あなたの無意識下に眠る<br />
                                    「真の願望」と「隠された才能」を明らかにします。
                                </p>
                                <DeepDiveButton />
                            </div>
                        )}

                        {/* 3. 詳細データグリッド (4項目フル表示) */}
                        {/* ★修正: ボックス内のテキストは読みやすさ重視で常時左寄せ(text-left) */}
                        <div className="grid md:grid-cols-2 gap-8 font-jp text-sm text-gray-600 text-left">

                            {/* Weakness */}
                            <div className="bg-[#fafafa] p-6 rounded-xl border border-gray-100">
                                <h4 className="text-gold font-en tracking-widest mb-3 text-xs">WEAKNESS</h4>
                                <p className="leading-relaxed text-gray-700">{diagnosisGem.weakness}</p>
                            </div>

                            {/* Love */}
                            <div className="bg-[#fafafa] p-6 rounded-xl border border-gray-100">
                                <h4 className="text-gold font-en tracking-widest mb-3 text-xs">LOVE & RELATIONSHIP</h4>
                                <p className="leading-relaxed text-gray-700">{diagnosisGem.love}</p>
                            </div>

                            {/* Compatibility */}
                            {diagnosisGem.compatibility && (
                                <div className="bg-[#fafafa] p-6 rounded-xl border border-gray-100">
                                    <h4 className="text-gold font-en tracking-widest mb-3 text-xs">COMPATIBILITY</h4>
                                    <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                                        {diagnosisGem.compatibility}
                                    </div>
                                </div>
                            )}

                            {/* Academic */}
                            {diagnosisGem.academic && (
                                <div className="bg-[#fafafa] p-6 rounded-xl border border-gray-100">
                                    <h4 className="text-gold font-en tracking-widest mb-3 text-xs">GEMOLOGICAL BACKGROUND</h4>
                                    <p className="leading-relaxed text-gray-700">{diagnosisGem.academic}</p>
                                </div>
                            )}

                        </div>

                    </div>
                </div>

                {/* --- 関連アイテム --- */}
                <div className="mt-20 px-4">
                    <ItemCollection
                        items={items}
                        title={`${diagnosisGem.name} Collections`}
                        subtitle="Related Items & Journals"
                    />
                </div>

                {/* --- ナビゲーション --- */}
                <div className="text-center mt-20">
                    <Link href="/gems" className="inline-block border-b border-gray-400 text-gray-600 text-sm pb-1 hover:text-black hover:border-black transition-all">
                        宝石一覧に戻る
                    </Link>
                </div>

            </main>

            <SiteFooter />
        </>
    );
}