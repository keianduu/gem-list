/* app/api/revalidate/route.js */
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
    try {
        // 1. microCMSからの署名を取得 (セキュリティ対策)
        const signature = request.headers.get("X-MICROCMS-Signature");
        const body = await request.text(); // 生のBodyを取得

        // 環境変数にシークレットが設定されていない場合はエラー (開発時の事故防止)
        if (!process.env.MICROCMS_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Secret not set" }, { status: 500 });
        }

        // 2. 署名の検証 (なりすまし防止)
        const expectedSignature = crypto
            .createHmac("sha256", process.env.MICROCMS_WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        // 3. キャッシュの破棄 (タグを指定して一括更新)
        // ここで指定したタグが付いているfetchのキャッシュがすべて削除されます
        revalidateTag('layout');   // カテゴリやメニューなど、全体に関わるデータ
        revalidateTag('content');  // 商品や記事など、メインコンテンツ

        console.log("Revalidation triggered successfully");

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        console.error("Revalidation Error:", err);
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}