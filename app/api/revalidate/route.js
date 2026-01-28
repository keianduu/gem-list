import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const signature = request.headers.get('X-MICROCMS-SIGNATURE');
        const body = await request.text();

        if (!signature) {
            console.error('[API] /api/revalidate: Missing X-MICROCMS-SIGNATURE header');
            return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
        }

        const secret = process.env.MICROCMS_WEBHOOK_SECRET;
        if (!secret) {
            console.error('[API] /api/revalidate: MICROCMS_WEBHOOK_SECRET is not set');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        // timingSafeEqual for secure comparison
        const sigBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
            console.error('[API] /api/revalidate: Invalid signature');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        // Signature is valid
        // Wait 2 seconds to ensure MicroCMS data is fully propagated
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Revalidate
        // revalidateTag('gem') revalidates fetches tagged with 'gem'
        // revalidateTag('journal') revalidates fetches tagged with 'journal'
        revalidateTag('gem');
        revalidateTag('journal');

        console.log('[API] /api/revalidate: Revalidated tags: gem, journal');
        return NextResponse.json({ message: 'Revalidation successful' });

    } catch (err) {
        console.error('[API] /api/revalidate: Error revalidating', err);
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}