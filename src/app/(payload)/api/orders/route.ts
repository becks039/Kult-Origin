import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

// ============================================================
// POST — CREATE NEW ORDER
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(
      '[ORDERS API] Incoming order body:',
      JSON.stringify(body, null, 2)
    );

    const payload = await getPayload({
      config,
    });

    // ----------------------------------------------------------
    // Validate items
    // ----------------------------------------------------------

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order must contain at least one product.',
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Validate every product against Payload
    //
    // IMPORTANT:
    // We do NOT search only the first 10 products anymore.
    // We verify the exact product ID coming from the cart.
    // ----------------------------------------------------------

    const validatedItems = [];

    for (let index = 0; index < body.items.length; index++) {
      const item = body.items[index];

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message: `Order item ${index + 1} is empty.`,
          },
          { status: 400 }
        );
      }

      // --------------------------------------------------------
      // Extract product ID
      // --------------------------------------------------------

      let productId: string | null = null;

      if (
        typeof item.product === 'string' ||
        typeof item.product === 'number'
      ) {
        productId = String(item.product);
      } else if (
        item.product &&
        typeof item.product === 'object'
      ) {
        // In case something sends:
        // { product: { id: "abc123" } }

        if (
          typeof item.product.id === 'string' ||
          typeof item.product.id === 'number'
        ) {
          productId = String(item.product.id);
        }
      }

      // --------------------------------------------------------
      // Product ID missing
      // --------------------------------------------------------

      if (!productId) {
        console.error(
          `[ORDERS API] Missing product ID at item ${index + 1}:`,
          item
        );

        return NextResponse.json(
          {
            success: false,
            message: `Order item ${index + 1} does not contain a valid Payload product ID.`,
          },
          { status: 400 }
        );
      }

      console.log(
        `[ORDERS API] Validating product ${index + 1}:`,
        productId
      );

      // --------------------------------------------------------
      // Verify exact product exists in Payload
      // --------------------------------------------------------

      let product;

      try {
        product = await payload.findByID({
          collection: 'products',
          id: productId,
          overrideAccess: true,
        });
      } catch (productError: any) {
        console.error(
          `[ORDERS API] Product lookup failed for ID ${productId}:`,
          productError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              `Product "${productId}" does not exist in Payload CMS.`,
          },
          { status: 400 }
        );
      }

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Product "${productId}" could not be found.`,
          },
          { status: 400 }
        );
      }

      console.log(
        `[ORDERS API] Product ${productId} verified:`,
        product.title || product.name || product.id
      );

      // --------------------------------------------------------
      // Build clean order item
      // --------------------------------------------------------

      validatedItems.push({
        product: product.id,
        quantity:
          typeof item.quantity === 'number' &&
          item.quantity > 0
            ? item.quantity
            : 1,
        price:
          typeof item.price === 'number'
            ? item.price
            : Number(item.price) || 0,
      });
    }

    // ----------------------------------------------------------
    // Normalize order status
    // ----------------------------------------------------------

    const normalizedStatus =
      typeof body.orderStatus === 'string'
        ? body.orderStatus.toLowerCase()
        : 'pending';

    // ----------------------------------------------------------
    // Build order payload
    // ----------------------------------------------------------

    const orderPayload = {
      ...body,

      orderStatus: normalizedStatus,

      items: validatedItems,
    };

    // ----------------------------------------------------------
    // Remove anything that should not be passed accidentally
    // ----------------------------------------------------------

    delete (orderPayload as any).id;

    delete (orderPayload as any).createdAt;

    delete (orderPayload as any).updatedAt;

    // ----------------------------------------------------------
    // Create order
    // ----------------------------------------------------------

    console.log(
      '[ORDERS API] Final order payload:',
      JSON.stringify(orderPayload, null, 2)
    );

    const order = await payload.create({
      collection: 'orders',

      data: orderPayload,

      overrideAccess: true,
    });

    // ----------------------------------------------------------
    // Success
    // ----------------------------------------------------------

    console.log(
      '[ORDERS API] Order created successfully:',
      order.id
    );

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
    // ----------------------------------------------------------
    // Global POST error
    // ----------------------------------------------------------

    console.error(
      '[ORDERS API] Order creation error:',
      error
    );

    console.error(
      '[ORDERS API] Error message:',
      error?.message
    );

    console.error(
      '[ORDERS API] Error data:',
      error?.data
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          'Failed to create order',

        errors:
          error?.data?.errors ||
          error?.errors ||
          [],
      },
      {
        status: 400,
      }
    );
  }
}

// ============================================================
// PATCH — UPDATE ORDER / BULK UPDATE
// ============================================================

export async function PATCH(req: Request) {
  try {
    const payload = await getPayload({
      config,
    });

    const { searchParams } = new URL(req.url);

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    let body: any = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // ----------------------------------------------------------
    // Extract target order IDs
    // ----------------------------------------------------------

    const targetIds: string[] = [];

    searchParams.forEach((value, key) => {
      if (
        key.includes('[id][in]') ||
        key === 'id'
      ) {
        targetIds.push(value);
      }
    });

    // ----------------------------------------------------------
    // Also support IDs from request body
    // ----------------------------------------------------------

    if (
      body.ids &&
      Array.isArray(body.ids)
    ) {
      targetIds.push(
        ...body.ids.map((id: any) =>
          String(id)
        )
      );
    } else if (body.id) {
      targetIds.push(
        String(body.id)
      );
    }

    // ----------------------------------------------------------
    // Remove duplicates / empty IDs
    // ----------------------------------------------------------

    const uniqueIds = Array.from(
      new Set(
        targetIds.filter(Boolean)
      )
    );

    if (uniqueIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No order ID was provided for update.',
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // Do not send helper fields to Payload
    // ----------------------------------------------------------

    const updateData = {
      ...body,
    };

    delete updateData.id;
    delete updateData.ids;

    // ----------------------------------------------------------
    // Update orders
    // ----------------------------------------------------------

    const updatedDocs = await Promise.all(
      uniqueIds.map(
        async (id: string) => {
          return payload.update({
            collection: 'orders',

            id,

            data: updateData,

            overrideAccess: true,
          });
        }
      )
    );

    // ----------------------------------------------------------
    // Success
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,

      docs: updatedDocs,

      errors: [],
    });
  } catch (error: any) {
    console.error(
      '[ORDERS API] Order update error:',
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          'Failed to update order',

        errors:
          error?.data?.errors ||
          error?.errors ||
          [],
      },
      {
        status: 400,
      }
    );
  }
}