/* components/GemStoneLinks.js */
import Link from "next/link";
import { client } from "@/libs/microcms";

async function getIconsData() {
  try {
    const [diamondData, berylData] = await Promise.all([
      client.get({
        endpoint: "jewelry-categories",
        queries: { filters: "name[equals]Diamond", fields: "image", limit: 1 },
        customRequestInit: { next: { revalidate: 3600 } }
      }),
      client.get({
        endpoint: "rough-stones",
        queries: { filters: "name[equals]Beryl", fields: "image", limit: 1 }, 
        customRequestInit: { next: { revalidate: 3600 } }
      })
    ]);

    return {
      gemIcon: diamondData.contents[0]?.image?.url || null,
      roughIcon: berylData.contents[0]?.image?.url || null
    };
  } catch (e) {
    console.error("GemStoneLinks icon fetch error:", e);
    return { gemIcon: null, roughIcon: null };
  }
}

// ★修正: style プロパティを受け取れるように変更
export default async function GemStoneLinks({ style }) {
  const { gemIcon, roughIcon } = await getIconsData();

  // デフォルトのマージンは 60px 0 だが、propsで上書き可能にする
  const containerStyle = {
    display: 'flex', 
    gap: '12px', 
    justifyContent: 'center', 
    flexWrap: 'wrap', 
    margin: '60px 0',
    ...style // 受け取ったスタイルで上書き
  };

  return (
    <div style={containerStyle}>
      
      {/* 宝石一覧へのリンク */}
      <Link href="/gems" className="hero-search-sublink" style={{ marginTop: 0 }}>
        {gemIcon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={gemIcon} 
            alt="" 
            style={{ width:'20px', height:'20px', objectFit:'contain', marginRight:'4px' }} 
          />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9-9 9 9-9 9-9-9z" />
          </svg>
        )}
        <span>宝石一覧</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>

      {/* 原石一覧へのリンク */}
      <Link href="/rough-stones" className="hero-search-sublink" style={{ marginTop: 0 }}>
        {roughIcon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={roughIcon} 
            alt="" 
            style={{ width:'20px', height:'20px', objectFit:'contain', marginRight:'4px' }} 
          />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 4.5v9l-9 4.5-9-4.5v-9z" />
          </svg>
        )}
        <span>原石一覧</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>

    </div>
  );
}