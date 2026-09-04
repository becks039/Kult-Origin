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

    // ==========================================
    // VALIDATE + NORMALIZE PRODUCT RELATIONSHIPS
    // ==========================================

    const normalizedItems = await Promise.all(
      (body.items || []).map(async (item: any) => {
        const productId = Number(item.product);

        if (!Number.isInteger(productId)) {
          throw new Error(
            `Invalid product ID: ${item.product}`,
          );
        }

        // Confirm product actually exists
        const product = await payload.findByID({
          collection: 'products',
          id: productId,
        });

        if (!product) {
          throw new Error(
            `Product not found: ${productId}`,
          );
        }

        return {
          ...item,
          product: productId,
        };
      }),
    );

    const orderPayload = {
      ...body,
      items: normalizedItems,
    };

    console.log('=================================');
    console.log('NORMALIZED ORDER PAYLOAD:');
    console.log(JSON.stringify(orderPayload, null, 2));
    console.log('=================================');

    // ==========================================
    // CREATE ORDER
    // ==========================================

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
      },
    );
  } catch (error: any) {
    console.error('=================================');
    console.error('PAYLOAD ORDER CREATION ERROR:');
    console.error(error);
    console.error('=================================');

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          'Failed to create order',
        error: error?.data || null,
      },
      {
        status: 500,
      },
    );
  }
}