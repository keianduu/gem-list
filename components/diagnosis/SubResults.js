import { client } from "@/libs/microcms";
import { GEMS_DB } from "@/libs/diagnosisData";
import Image from "next/image";
import Link from "next/link";

// 診断ロジックを再現してグループIDを判定
const getGroupId = (axisScores) => {
    const { world, orient, judge } = axisScores;
    const isOuter = world >= 50;
    const isFlip = orient >= 50;
    const isLogic = judge >= 50;

    if (isOuter && isFlip && !isLogic) return 'A';
    if (isOuter && isFlip && isLogic) return 'B';
    if (isOuter && !isFlip && !isLogic) return 'C';
    if (isOuter && !isFlip && isLogic) return 'D';
    if (!isOuter && isFlip && !isLogic) return 'E';
    if (!isOuter && isFlip && isLogic) return 'F';
    if (!isOuter && !isFlip && !isLogic) return 'G';
    return 'H'; // Default
};

export default async function SubResults({ scores, axisScores, currentSlug }) {
    // 1. スコアとグループの計算
    // scores propは { A:..., B:... } (page.jsがそうパースしているが、実際はRole 1-6のスコア)
    // page.js では s=scoreValues を `scoreArray` として分解し、A-Hのキーに割り当てているが
    // ここでは単純に配列として受け取るか、scoresオブジェクトの値を使う
    // page.js:
    // const scoreArray = s ? s.split(',').map(Number) : [];
    // const scores = { A: scoreArray[0]... }
    // つまり scores.A = Role 1, scores.B = Role 2 ... scores.F = Role 6
    // (page.jsのキー割り当て A-H は恐らくRole 1-8想定の名残だが、実際は6つ)

    // 配列に戻す (Role 1〜6)
    const roleScores = [
        { id: '1', val: scores.A || 0 },
        { id: '2', val: scores.B || 0 },
        { id: '3', val: scores.C || 0 },
        { id: '4', val: scores.D || 0 },
        { id: '5', val: scores.E || 0 },
        { id: '6', val: scores.F || 0 }
    ];

    const totalScore = roleScores.reduce((acc, r) => acc + r.val, 0) || 1;

    // ソート (降順)
    const sortedRoles = [...roleScores].sort((a, b) => b.val - a.val);

    // Top 3を取得 (rankプロパティを付与)
    const top3Roles = sortedRoles.slice(0, 3).map((r, i) => ({ ...r, rank: i + 1 }));

    const groupId = getGroupId(axisScores);

    // Gemデータと結合してリスト化
    const tempGemList = top3Roles.map(item => {
        const gemId = `${groupId}-${item.id}`;
        const gemData = GEMS_DB[gemId];
        const percent = Math.round((item.val / totalScore) * 100);
        return {
            ...item,
            gemData,
            percent
        };
    }).filter(item => item.gemData);

    // currentSlug を除外して、残りのリストを作成
    const gemsToShow = tempGemList.filter(item => item.gemData.slug !== currentSlug);

    // 基本的に2つ残るはずだが、念のため先頭2つを取得
    const finalGems = gemsToShow.slice(0, 2);

    if (finalGems.length === 0) return null;

    // microCMSから画像などを取得
    const slugs = finalGems.map(g => g.gemData.slug);
    let cmsGemData = [];
    try {
        const res = await client.get({
            endpoint: "jewelry-categories",
            queries: {
                filters: slugs.map(s => `slug[equals]${s}`).join('[or]'),
                fields: "slug,image,name,nameJa,yomigana",
            },
            customRequestInit: { next: { tags: ['gem'] } },
        });
        cmsGemData = res.contents;
    } catch (e) {
        console.error("SubResults fetch error:", e);
    }

    // データを結合
    const results = finalGems.map(item => {
        const cms = cmsGemData.find(c => c.slug === item.gemData.slug);
        return {
            ...item,
            image: cms?.image?.url,
            displayName: cms?.name || item.gemData.name,
            yomigana: cms?.yomigana,
            slug: item.gemData.slug
        };
    });

    return (
        <div className="info-glass-card full-width">
            <div className="info-header-row mb-4">
                <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h3 className="info-label">HIDDEN ELEMENTS</h3>
            </div>

            <p className="font-jp text-xs text-gray-500 mb-6 leading-relaxed">
                あなたの中に眠る、もう一つの可能性。<br />
                これらの要素もあなたの魅力を構成しています。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((gem) => (
                    <Link
                        key={gem.slug}
                        href={`/gems/${gem.slug}/diagnosis?s=${scores.A},${scores.B},${scores.C},${scores.D},${scores.E},${scores.F}&ax=${axisScores.world},${axisScores.orient},${axisScores.judge},${axisScores.approach}&mode=deep`}
                        className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-gold/10 hover:bg-white/60 hover:border-gold/30 transition-all group"
                    >

                        {/* アイコン */}
                        <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full p-2 group-hover:scale-110 transition-transform">
                            {gem.image ? (
                                <Image
                                    src={gem.image}
                                    alt={gem.gemData.name}
                                    fill
                                    sizes="48px"
                                    style={{ objectFit: 'contain', padding: '4px' }}
                                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">💎</div>
                            )}
                        </div>

                        {/* テキスト */}
                        <div className="flex-1 min-w-0">
                            <p><span className="font-en text-xs text-gray-400 mb-1">NO.{gem.rank}</span></p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <h4 className="font-en font-medium text-gray-800 truncate tracking-wide">
                                    {gem.displayName}
                                </h4>
                                <span className="text-[10px] text-gray-400 truncate hidden sm:inline">
                                    ({gem.yomigana})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-en tracking-wider text-gray-400 uppercase">Element</span>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                                    <div
                                        className="h-full bg-gold/70"
                                        style={{ width: `${gem.percent}%` }}
                                    ></div>
                                </div>
                                <span className="font-en text-xs font-bold text-gold">{gem.percent}%</span>
                            </div>
                        </div>

                        {/* 矢印 */}
                        <div className="text-gray-300 group-hover:text-gold transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
