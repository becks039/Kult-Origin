import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

// Helper function to extract exact KULT Order Number or database ID
function extractOrderNumber(text: string): string | null {
  // Matches exact pattern like "KULT-1789379295856-6320" or "KULT-XXXXXX"
  const kultPattern = /KULT-[A-Z0-9-]+/i;
  const match = text.match(kultPattern);

  if (match) {
    return match[0].toUpperCase();
  }

  // Matches 24-char MongoDB / Postgres ObjectIDs
  const idPattern = /\b[a-f0-9]{24}\b/i;
  const idMatch = text.match(idPattern);

  return idMatch ? idMatch[0] : null;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const trimmedInput = message.trim();
    const lowerInput = trimmedInput.toLowerCase();

    // Helper function to safely format items array
    const formatItems = (items: any[] = []) => {
      if (!items || items.length === 0) return '  • No items listed';
      return items
        .map((item) => {
          const title =
            typeof item.product === 'object' && item.product?.title
              ? item.product.title
              : item.title || item.name || 'Product Item';
          const qty = item.quantity || 1;
          const price = item.price ? ` (PKR ${item.price})` : '';
          return `  • ${title} x${qty}${price}`;
        })
        .join('\n');
    };

    // 1. EMAIL MATCHING (Founder Verification OR Orders Search by Email)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const foundEmailMatch = trimmedInput.match(emailRegex);

    if (foundEmailMatch) {
      const userEmail = foundEmailMatch[0].toLowerCase();

      // Check Founder Verification First
      try {
        let verificationRecord: any = null;
        const possibleSlugs = ['founder-keys', 'founderKeys', 'founders', 'users'];

        for (const slug of possibleSlugs) {
          try {
            const res = await payload.find({
              collection: slug as any,
              overrideAccess: true,
              where: {
                email: {
                  equals: userEmail,
                },
              },
            });
            if (res && res.docs && res.docs.length > 0) {
              verificationRecord = res;
              break;
            }
          } catch (e) {}
        }

        if (verificationRecord && verificationRecord.docs.length > 0) {
          const record = verificationRecord.docs[0];
          const status = record.status || record.verificationStatus || 'Verified';
          const keyNumber = record.keyNumber || record.key || record.id || 'N/A';

          return NextResponse.json({
            reply: `✅ Founder Verification Details\n\n- Email: ${userEmail}\n- Status: ${String(status).toUpperCase()}\n- Record ID / Key: ${keyNumber}`,
          });
        }
      } catch (dbError: any) {
        console.error('Founder Verification Query Error:', dbError);
      }

      // Fallback: Check if user has active Orders using customerEmail field
      try {
        const orderSearch = await payload.find({
          collection: 'orders',
          overrideAccess: true,
          depth: 2,
          where: {
            customerEmail: {
              equals: userEmail,
            },
          },
          sort: '-createdAt',
        });

        if (orderSearch && orderSearch.docs && orderSearch.docs.length > 0) {
          const latestOrder = orderSearch.docs[0];
          const itemDetails = formatItems(latestOrder.items);

          return NextResponse.json({
            reply: `📦 Latest Order for ${userEmail}\n\n- Order Number: ${latestOrder.orderNumber}\n- Order Status: ${latestOrder.orderStatus?.toUpperCase()}\n- Payment Status: ${latestOrder.paymentStatus}\n- Total Amount: PKR ${latestOrder.totalAmount}\n\nItems Included:\n${itemDetails}`,
          });
        }
      } catch (orderErr) {
        console.error('Order Query Error:', orderErr);
      }

      return NextResponse.json({
        reply: `❌ No record or order found for ${userEmail}. Please verify your email address.`,
      });
    }

    // 2. ORDER NUMBER / TRACKING MATCHING
    const extractedOrderNum = extractOrderNumber(trimmedInput);
    const isTrackingIntent = /track|order|status|where|ship/i.test(lowerInput);

    // Scenario A: User provides an actual Order ID (with or without intent words)
    if (extractedOrderNum) {
      try {
        const orderSearch = await payload.find({
          collection: 'orders',
          overrideAccess: true,
          depth: 2,
          where: {
            or: [
              { orderNumber: { equals: extractedOrderNum } },
              { id: { equals: extractedOrderNum } },
            ],
          },
        });

        if (orderSearch && orderSearch.docs && orderSearch.docs.length > 0) {
          const orderDoc = orderSearch.docs[0];
          const city = orderDoc.shippingAddress?.city || 'N/A';
          const customerName = orderDoc.customerName || 'Valued Customer';
          const itemDetails = formatItems(orderDoc.items);

          return NextResponse.json({
            reply: `📦 Order Status (${orderDoc.orderNumber})\n\n- Customer: ${customerName}\n- Order Status: ${orderDoc.orderStatus?.toUpperCase()}\n- Payment Status: ${orderDoc.paymentStatus}\n- Total Amount: PKR ${orderDoc.totalAmount}\n- Destination City: ${city}\n\nItems Included:\n${itemDetails}`,
          });
        }

        return NextResponse.json({
          reply: `❌ Could not find any order matching "${extractedOrderNum}". Please re-check your Order Number.`,
        });
      } catch (err) {
        return NextResponse.json({
          reply: `⚠️ Error tracking order "${extractedOrderNum}".`,
        });
      }
    }

    // Scenario B: User asks general tracking questions like "heyy can i track my oder" without ID
    if (isTrackingIntent) {
      return NextResponse.json({
        reply: 'Sure! Please provide your Order Number (e.g., KULT-1789379295856-6320) so I can fetch the tracking status for you.',
      });
    }

    // DEFAULT FALLBACK
    return NextResponse.json({
      reply: 'Welcome to Kult Origen Support!\n\n- Send your Email Address to check Founder Verification Status or view your latest order.\n- Send your Order Number (e.g., KULT-1789379295856-6320) to track your shipment.',
    });
  } catch (error: any) {
    console.error('Chat Route Critical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}