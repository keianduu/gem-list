import { getAllContents } from "@/libs/microcms";
import { SITE_URL } from "@/libs/meta";

// サイトマップの再生成頻度 (秒) - ISRと同様の考え方
// 頻繁に更新されない場合は長めに設定してもOK
export const revalidate = 3600;

export default async function sitemap() {
    const baseUrl = SITE_URL;

    // 1. 静的ページ (手動で定義)
    const staticPages = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gems`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/rough-stones`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        // /favorites はユーザー固有のため通常は含めませんが、
        // ページが存在することを伝えるなら含めてもOK (今回は除外または低優先度)
    ];

    // 2. microCMSから全データを並行取得
    // getAllContentsはページネーションを自動で回して全件取得してくれる関数です
    const [categories, roughStones, archives] = await Promise.all([
        getAllContents("jewelry-categories", {
            fields: "slug,updatedAt",
            filters: "isVisible[equals]true" // 非表示カテゴリを除外
        }),
        getAllContents("rough-stones", {
            fields: "slug,updatedAt",
            filters: "isVisible[equals]true" // 非表示カテゴリを除外
        }),
        getAllContents("archive", {
            fields: "slug,updatedAt,type" // 判定用にtypeを追加
        }),
    ]);

    // 3. 宝石カテゴリページ ( /gems/[slug] )
    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/gems/${cat.slug}`,
        lastModified: new Date(cat.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 4. 原石ページ ( /rough-stones/[slug] )
    const roughStoneUrls = roughStones.map((stone) => ({
        url: `${baseUrl}/rough-stones/${stone.slug}`,
        lastModified: new Date(stone.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // 5. 記事/商品ページ ( /journals/[slug] )
    // 商品（products）は除外し、記事（journals）のみ出力する
    const archiveUrls = archives
        .filter((content) => !content.type.includes('product'))
        .map((content) => ({
            url: `${baseUrl}/journals/${content.slug}`,
            lastModified: new Date(content.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

    // 6. 宝石診断ページ ( /gems/[slug]/diagnosis )
    const diagnosisUrls = categories.map((cat) => ({
        url: `${baseUrl}/gems/${cat.slug}/diagnosis`,
        lastModified: new Date(cat.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // 全て結合して返す
    return [
        ...staticPages,
        ...categoryUrls,
        ...roughStoneUrls,
        ...archiveUrls,
        ...diagnosisUrls,
    ];
}