import { createClient } from 'microcms-js-sdk';

// クライアントの作成
export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
});

// ★追加: 全件取得用関数 (再帰処理)
export async function getAllContents(endpoint, queries = {}) {
  let offset = 0;
  const limit = 100; // 一度の取得件数
  let allContents = [];
  
  while (true) {
    const data = await client.get({
      endpoint,
      queries: { ...queries, limit, offset },
    });
    
    allContents = [...allContents, ...data.contents];
    
    // 取得した件数がlimitより少なければ、もう次は無いので終了
    if (data.contents.length < limit) break;
    
    // 次のページへ
    offset += limit;
  }
  
  return allContents;
}