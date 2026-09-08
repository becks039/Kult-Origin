import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log('=================================');
    console.log('ORDER RECEIVED BY API:');
    console.log(JSON.stringify(body, null, 2));
    console.log('=================================');

    const payload = await getPayload({
      config,
    });

    // 1. Fetch valid products from Payload to map or validate fallback IDs
    const existingProducts = await payload.find({
      collection: 'products',
      limit: 10,
    });

    // Default fallback to the first valid product ID if the payload provides a non-existent/mock ID (like "1")
    const defaultProductId = existingProducts.docs[0]?.id;

    // 2. Sanitize items array to ensure `product` holds a valid Payload document ID
    const sanitizedItems = Array.isArray(body.items)
      ? body.items.map((item: any) => {
          const isValidId = existingProducts.docs.some(
            (p) => String(p.id) === String(item.product)
          );

          return {
            ...item,
            // Replace mock ID with real database ID if lookup fails
            product: isValidId ? item.product : defaultProductId,
          };
        })
      : [];

    const orderPayload = {
      ...body,
      items: sanitizedItems,
    };

    // 3. Create order document in Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: orderPayload,
    });

    console.log('=================================');
    console.log('ORDER CREATED IN PAYLOAD:');
    console.log(order);
    console.log('=================================');

    return NextResponse.json(
      {
        success: true,
        message: 'Order successfully created',
        order,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error('=================================');
    console.error('PAYLOAD ORDER CREATION ERROR:');
    console.error(error);
    console.error('=================================');

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to create order',
        error: error?.data || null,
      },
      {
        status: 400, // Return 400 Bad Request for Payload validation issues
      }
    );
  }
}