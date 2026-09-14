import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle Vapi Tool Call
    const message = body.message;
    if (message?.type === 'tool-calls' || message?.type === 'function-call') {
      const toolCall = message.toolCalls?.[0] || message.functionCall;
      const args = toolCall.function?.arguments || toolCall.arguments || {};
      const { orderId, email } = args;

      const queryTerm = (orderId || email || '').trim();

      if (!queryTerm) {
        return NextResponse.json({
          results: [
            {
              toolCallId: toolCall.id,
              result: 'Please ask the caller for their Order Number or Email address.',
            },
          ],
        });
      }

      const payload = await getPayload({ config });

      // 1. CHECK IF QUERY IS AN EMAIL (Founder Status or Email Orders)
      const isEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(queryTerm);

      if (isEmail) {
        const userEmail = queryTerm.toLowerCase();

        // Check Founder Verification
        const possibleSlugs = ['founder-keys', 'founderKeys', 'founders', 'users'];
        for (const slug of possibleSlugs) {
          try {
            const res = await payload.find({
              collection: slug as any,
              overrideAccess: true,
              where: { email: { equals: userEmail } },
            });

            if (res?.docs?.length > 0) {
              const record = res.docs[0];
              const status = record.status || record.verificationStatus || 'Verified';
              return NextResponse.json({
                results: [
                  {
                    toolCallId: toolCall.id,
                    result: `Founder verification found for ${userEmail}. Status is ${status}. Key or ID is ${record.keyNumber || record.id || 'Active'}.`,
                  },
                ],
              });
            }
          } catch (e) {}
        }

        // Fallback: Check Order by Email
        const emailOrders = await payload.find({
          collection: 'orders',
          overrideAccess: true,
          where: { customerEmail: { equals: userEmail } },
          sort: '-createdAt',
          limit: 1,
        });

        if (emailOrders.docs.length > 0) {
          const order = emailOrders.docs[0];
          return NextResponse.json({
            results: [
              {
                toolCallId: toolCall.id,
                result: `Latest order for ${userEmail} is order number ${order.orderNumber}. Status is ${order.orderStatus || 'processing'}. Total amount is PKR ${order.totalAmount || 0}.`,
              },
            ],
          });
        }

        return NextResponse.json({
          results: [
            {
              toolCallId: toolCall.id,
              result: `No founder key or order record found for email ${userEmail}. Please ask the caller to re-check their email address.`,
            },
          ],
        });
      }

      // 2. QUERY IS AN ORDER NUMBER / ID
      const orders = await payload.find({
        collection: 'orders',
        overrideAccess: true,
        where: {
          or: [
            { orderNumber: { equals: queryTerm } },
            { id: { equals: queryTerm } },
          ],
        },
        limit: 1,
      });

      if (orders.docs.length === 0) {
        return NextResponse.json({
          results: [
            {
              toolCallId: toolCall.id,
              result: `No order found under ID or number ${queryTerm}. Please ask the caller to re-check their order number.`,
            },
          ],
        });
      }

      const order = orders.docs[0];
      const statusResponse = `Order ${order.orderNumber || order.id} is currently ${order.orderStatus || 'processing'}. Total amount is PKR ${order.totalAmount || 0}.`;

      return NextResponse.json({
        results: [{ toolCallId: toolCall.id, result: statusResponse }],
      });
    }

    return NextResponse.json({ error: 'Invalid Vapi webhook call' }, { status: 400 });
  } catch (error) {
    console.error('Vapi Lookup Error:', error);
    return NextResponse.json({ error: 'Internal database error' }, { status: 500 });
  }
}