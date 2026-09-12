import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json()

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Coupon code is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const trimmedCode = code.trim().toUpperCase()

    // Query Coupon Collection
    const result = await payload.find({
      collection: 'coupons',
      where: {
        and: [
          { code: { equals: trimmedCode } },
          { isUsed: { equals: false } },
        ],
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired coupon code.' },
        { status: 404 }
      )
    }

    const couponDoc = result.docs[0]

    // Check Expiration Date
    const now = new Date()
    const expiresAt = new Date(couponDoc.expiresAt)

    if (now > expiresAt) {
      return NextResponse.json(
        { valid: false, message: 'This coupon code has expired.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      message: 'Coupon code applied successfully!',
      discountPercent: couponDoc.discountPercent,
      code: couponDoc.code,
    })
  } catch (error) {
    console.error('VALIDATE COUPON ERROR:', error)
    return NextResponse.json(
      { valid: false, message: 'Error validating coupon' },
      { status: 500 }
    )
  }
}