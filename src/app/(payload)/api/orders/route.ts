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

    const order = await payload.create({
      collection: 'orders',
      data: body,
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
        message:
          error?.message ||
          'Failed to create order',
        error: error?.data || null,
      },
      {
        status: 500,
      }
    );
  }
}