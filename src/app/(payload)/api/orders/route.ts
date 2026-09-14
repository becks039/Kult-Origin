import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

// 1. POST Handler (New Order Creation)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = await getPayload({ config });

    const existingProducts = await payload.find({
      collection: 'products',
      limit: 10,
    });

    if (!existingProducts.docs.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'No active products found in system to associate order with.',
        },
        { status: 400 }
      );
    }

    const defaultProductId = existingProducts.docs[0].id;

    const sanitizedItems = Array.isArray(body.items)
      ? body.items.map((item: any) => {
          const isValidId = existingProducts.docs.some(
            (p) => String(p.id) === String(item.product)
          );

          return {
            ...item,
            product: isValidId ? item.product : defaultProductId,
          };
        })
      : [];

    const normalizedStatus = typeof body.orderStatus === 'string' 
      ? body.orderStatus.toLowerCase() 
      : 'pending';

    const orderPayload = {
      ...body,
      orderStatus: normalizedStatus,
      items: sanitizedItems,
    };

    const order = await payload.create({
      collection: 'orders',
      data: orderPayload,
      overrideAccess: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order successfully created',
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to create order',
      },
      { status: 400 }
    );
  }
}

// 2. PATCH Handler (Fixes "Method Not Allowed" on Bulk Drawer Edit)
export async function PATCH(req: Request) {
  try {
    const payload = await getPayload({ config });
    const { searchParams } = new URL(req.url);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // Extract target order IDs from URL query params
    const targetIds: string[] = [];
    searchParams.forEach((value, key) => {
      if (key.includes('[id][in]') || key === 'id') {
        targetIds.push(value);
      }
    });

    if (body.ids && Array.isArray(body.ids)) {
      targetIds.push(...body.ids);
    } else if (body.id) {
      targetIds.push(body.id);
    }

    const uniqueIds = Array.from(new Set(targetIds));

    // Update using Payload Local API
    const updatedDocs = await Promise.all(
      uniqueIds.map((id: string) =>
        payload.update({
          collection: 'orders',
          id,
          data: body,
          overrideAccess: true,
        })
      )
    );

    return NextResponse.json({
      docs: updatedDocs,
      errors: [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to update order',
      },
      { status: 400 }
    );
  }
}