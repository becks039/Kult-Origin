import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, productId, type, content, mediaIds } = body;

    if (!customerId || !productId || !content || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (customer, product, type, content)' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Review create karein Reviews collection mein
    const newReview = await payload.create({
      collection: 'reviews',
      data: {
        customer: customerId,
        product: productId,
        type: type, // 'TEXT', 'PHOTO', 'VIDEO'
        content: content,
        media: mediaIds && mediaIds.length > 0 ? mediaIds.map((id: string) => ({ file: id })) : [],
        status: 'PENDING',
      },
    });

    // Discount code generate karein tier ke hisaab se
    const discountPercentage = type === 'VIDEO' ? '20' : type === 'PHOTO' ? '10' : '5';
    const discountCode = `KULT-UGC-${discountPercentage}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      review: newReview,
      discountCode: discountCode,
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}