import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json()

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and email are required',
        },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // ============================================================
    // CREATE ACCESS REQUEST
    // AccessRequests hook generates accessKey automatically
    // ============================================================

  const doc = await payload.create({
      collection: 'access-requests',
      data: {
        name,
        email,
        status: 'PENDING',
      },
    })

    const accessKey = doc.accessKey

    if (!accessKey) {
      throw new Error('Access key was not generated')
    }

    // ============================================================
    // CHECK RESEND API KEY
    // ============================================================

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    // ============================================================
    // SEND EMAIL THROUGH RESEND
    // ============================================================

    const resendResponse = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          from: 'KULT ORIGIN <onboarding@resend.dev>',
          to: [email],
          subject: 'AUTHENTICATION KEY // ACCESS GRANTED',

          html: `
            <div
              style="
                background-color:#0A0B0D;
                color:#E8E2D6;
                padding:32px;
                font-family:monospace;
                border:1px solid #222;
              "
            >

              <h2
                style="
                  color:#D4AF37;
                  margin-bottom:16px;
                "
              >
                CLANDESTINE VAULT ACCESS
              </h2>

              <p>
                Greetings ${name},
              </p>

              <p>
                Your request for Batch 001 allocation
                access has been processed.
              </p>

              <div
                style="
                  background:#12141B;
                  border:1px solid #D4AF37;
                  padding:20px;
                  text-align:center;
                  margin:24px 0;
                "
              >

                <span
                  style="
                    font-size:22px;
                    font-weight:bold;
                    letter-spacing:4px;
                    color:#D4AF37;
                  "
                >
                  ${accessKey}
                </span>

              </div>

              <p
                style="
                  font-size:12px;
                  color:#888;
                "
              >
                Use this authentication key on the
                KULT ORIGIN vault gate.
              </p>

            </div>
          `,
        }),
      }
    )

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('RESEND ERROR:', resendData)

      throw new Error(
        resendData?.message ||
          'Failed to send access key email'
      )
    }

    // ============================================================
    // MARK ACCESS REQUEST AS SENT
    // ============================================================

    await payload.update({
      collection: 'access-requests',
      id: doc.id,
      data: {
        status: 'SENT',
        keyIssuedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Access key dispatched successfully.',
    })
  } catch (error) {
    console.error('REQUEST ACCESS ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}