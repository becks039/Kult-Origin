import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, birthDate, phoneNumber } = body

    // 1. Input Validation
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

    // Safe Birth Date Parsing (returns undefined instead of null to avoid schema mismatch)
    let formattedBirthDate: string | undefined = undefined
    if (birthDate && !isNaN(Date.parse(birthDate))) {
      formattedBirthDate = new Date(birthDate).toISOString()
    }

    // 2. Create Access Request Record in Payload CMS
    const doc = await payload.create({
      collection: 'access-requests',
      data: {
        name,
        email: email.toLowerCase().trim(),
        ...(formattedBirthDate && { birthDate: formattedBirthDate }),
        ...(phoneNumber && { phoneNumber: String(phoneNumber) }),
        status: 'PENDING',
      },
    })

    // Fallback key generation if Payload collection hook did not set doc.accessKey
    const accessKey =
      (doc as { accessKey?: string }).accessKey ||
      `KULT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // 3. Safe Resend Email Dispatch via REST API
    const apiKey = process.env.RESEND_API_KEY
    let emailSent = false

    if (apiKey && apiKey.startsWith('re_')) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'KULT ORIGIN <onboarding@resend.dev>',
            to: [email],
            subject: 'AUTHENTICATION KEY // ACCESS GRANTED',
            html: `
              <div style="background-color:#0A0B0D; color:#E8E2D6; padding:32px; font-family:monospace; border:1px solid #222;">
                <h2 style="color:#D4AF37; margin-bottom:16px;">CLANDESTINE VAULT ACCESS</h2>
                <p>Greetings ${name},</p>
                <p>Your request for Batch 001 allocation access has been processed.</p>
                <div style="background:#12141B; border:1px solid #D4AF37; padding:20px; text-align:center; margin:24px 0;">
                  <span style="font-size:22px; font-weight:bold; letter-spacing:4px; color:#D4AF37;">
                    ${accessKey}
                  </span>
                </div>
                <p style="font-size:12px; color:#888;">
                  Use this authentication key on the KULT ORIGIN vault gate.
                </p>
              </div>
            `,
          }),
        })

        if (resendResponse.ok) {
          emailSent = true
        } else {
          const resendData = await resendResponse.json()
          console.warn('RESEND DISPATCH WARNING:', resendData)
        }
      } catch (mailError) {
        console.error('RESEND FETCH ERROR:', mailError)
      }
    } else {
      console.warn('RESEND_API_KEY missing or invalid. Email skipped.')
    }

    // 4. Update Access Request Status & Log Issue Timestamp
    try {
      await payload.update({
        collection: 'access-requests',
        id: doc.id,
        data: {
          accessKey,
          status: emailSent ? 'SENT' : 'PENDING',
          keyIssuedAt: new Date().toISOString(),
        },
      })
    } catch (updateError) {
      console.warn('PAYLOAD UPDATE WARNING:', updateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Access key dispatched successfully.',
      accessKey,
    })
  } catch (error) {
    console.error('REQUEST ACCESS SERVER ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}