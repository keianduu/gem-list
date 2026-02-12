import { client } from "@/libs/microcms";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import BirthstoneList from "@/components/BirthstoneList";
import GemTabNavigation from "@/components/GemTabNavigation";
import PageTitle from "@/components/PageTitle";

// 全カテゴリ取得
async function getAllCategories() {
    try {
        const data = await client.get({
            endpoint: "jewelry-categories",
            queries: {
                limit: 100,
                filters: 'isVisible[equals]true'
            },
            customRequestInit: { next: { revalidate: 3600 } }
        });
        return data.contents;
    } catch (err) {
        console.error("Categories fetch error:", err);
        return [];
    }
}

export const metadata = {
    title: "誕生石一覧（1月〜12月） - Jewelism MARKET",
    description: "各月の誕生石とその意味、石言葉を一覧で紹介。大切な人への贈り物や、自分へのお守りとして、あなたの誕生月の宝石を見つけてください。",
    alternates: {
        canonical: '/birthstones',
    },
};

export default async function BirthstonesPage() {
    const categories = await getAllCategories();

    // パンくずデータ定義
    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Birthstones", path: "/birthstones" }
    ];

    return (
        <>
            <SiteHeader />

            <main className="journal-main">

                <section style={{ maxWidth: '1000px', margin: '40px auto 100px' }}>
                    <PageTitle
                        enLabel="Birthstones"
                        title="Birthstone Calendar"
                        subtitle="1月〜12月の誕生石一覧"
                    />

                    <GemTabNavigation activeTab="birthstone" />

                    <p className="birthstone-intro" style={{ marginTop: '20px', marginBottom: '64px', color: '#555', padding: '0 16px' }}>
                        誕生石は、身につけることで幸運を呼び寄せると言われています。<span className="pc-break"></span>
                        大切な人への贈り物や、自分自身へのお守りとして。<span className="pc-break"></span>
                        あなたの誕生月の宝石を見つけてください。
                    </p>



                    <BirthstoneList categories={categories} />

                </section>

            </main >
            <Breadcrumb items={breadcrumbItems} />
            <SiteFooter />
        </>
    );
}
