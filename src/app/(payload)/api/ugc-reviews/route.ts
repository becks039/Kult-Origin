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

    // 1. Customer/User ID lookup & fallback resolution
    let targetUserId = customerId;
    const userSearch = await payload.find({
      collection: 'users',
      where: { email: { equals: customerId } },
      limit: 1,
    });

    if (userSearch.docs.length > 0) {
      targetUserId = userSearch.docs[0].id;
    } else {
      // Fallback to first available user for smooth testing
      const defaultUser = await payload.find({ collection: 'users', limit: 1 });
      if (defaultUser.docs.length > 0) targetUserId = defaultUser.docs[0].id;
    }

    // 2. Product ID lookup & fallback resolution
    let targetProductId = productId;
    const productSearch = await payload.find({
      collection: 'products',
      where: { slug: { equals: productId } },
      limit: 1,
    });

    if (productSearch.docs.length > 0) {
      targetProductId = productSearch.docs[0].id;
    } else {
      // Fallback to first available product
      const defaultProduct = await payload.find({ collection: 'products', limit: 1 });
      if (defaultProduct.docs.length > 0) targetProductId = defaultProduct.docs[0].id;
    }

    // 3. Discount code calculation
    const discountPercentage = type === 'VIDEO' ? '20' : type === 'PHOTO' ? '10' : '5';
    const discountCode = `KULT-UGC-${discountPercentage}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 4. Data Assembly for Payload
    const reviewData: Record<string, any> = {
      customer: targetUserId,
      product: targetProductId,
      type,
      content,
      status: 'PENDING',
      discountCode,
      discountPercentage: Number(discountPercentage),
    };

    if (mediaIds && Array.isArray(mediaIds) && mediaIds.length > 0) {
      reviewData.media = mediaIds.map((id: string) => ({ file: id }));
    }

    // 5. Create Review
    const newReview = await payload.create({
      collection: 'reviews',
      data: reviewData,
    });

    // 6. n8n Webhook Trigger (Fire-and-forget)
    const n8nWebhookUrl = process.env.N8N_UGC_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: newReview.id,
          customerEmail: customerId,
          productId: productId,
          type: type,
          content: content,
          discountCode: discountCode,
          discountPercentage: discountPercentage,
          media: newReview.media || [],
          submittedAt: new Date().toISOString(),
        }),
      }).catch((err) => console.error('n8n Webhook Trigger Error:', err));
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      discountCode,
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}