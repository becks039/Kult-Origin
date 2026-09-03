import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { key } = await req.json()

    if (!key) {
      return NextResponse.json(
        { valid: false, message: 'Access key is required' },
        { status: 400 }
      )
    }

    const trimmedKey = key.trim()

    // 1. Master Keys
    const masterKeys = ['ORIGIN50', 'ADMIN123', 'TESTKEY']
    if (masterKeys.includes(trimmedKey.toUpperCase())) {
      return NextResponse.json({
        valid: true,
        message: 'Master Key Accepted',
      })
    }

    const payload = await getPayload({ config })

    // 2. SEARCH IN ACCESS-REQUESTS FIRST
    // Using ONLY valid schema enum values: 'SENT', 'USED' (no invalid enum values)
    const accessReqResult = await payload.find({
      collection: 'access-requests',
      where: {
        and: [
          {
            or: [
              { accessKey: { equals: trimmedKey } },
              { accessKey: { equals: trimmedKey.toUpperCase() } },
              { accessKey: { equals: trimmedKey.toLowerCase() } },
            ],
          },
          {
            status: {
              in: ['SENT', 'USED'], // Safe enum values only
            },
          },
        ],
      },
      limit: 1,
    })

    if (accessReqResult.docs.length > 0) {
      const matchDoc = accessReqResult.docs[0]

      // Allocation check
      const batch = await payload.findGlobal({ slug: 'batch-001-settings' })
      const currentFounderCount = batch.currentFounderCount ?? 0
      const founderCap = batch.founderCap ?? 50

      // If already USED, still grant access!
      if (matchDoc.status === 'USED') {
        return NextResponse.json({
          valid: true,
          message: 'Access Key Re-verified',
          founderNumber: matchDoc.founderNumber || 1,
        })
      }

      if (currentFounderCount >= founderCap) {
        return NextResponse.json(
          { valid: false, message: 'Founder 50 allocation is already full.' },
          { status: 400 }
        )
      }

      const founderNumber = currentFounderCount + 1

      // Mark request as USED
      await payload.update({
        collection: 'access-requests',
        id: matchDoc.id,
        data: {
          status: 'USED',
          founderNumber,
          keyIssuedAt: matchDoc.keyIssuedAt || new Date().toISOString(),
        },
      })

      // Update Global Count
      await payload.updateGlobal({
        slug: 'batch-001-settings',
        data: { currentFounderCount: founderNumber },
      })

      return NextResponse.json({
        valid: true,
        message: 'Access Key Verified',
        founderNumber,
        founderCap,
        currentFounderCount: founderNumber,
      })
    }

    // 3. FALLBACK: SEARCH IN FOUNDER-PROFILES IF MOVED
    const founderProfileResult = await payload.find({
      collection: 'founder-profiles',
      where: {
        or: [
          { accessKey: { equals: trimmedKey } },
          { accessKey: { equals: trimmedKey.toUpperCase() } },
        ],
      },
      limit: 1,
    })

    if (founderProfileResult.docs.length > 0) {
      const founder = founderProfileResult.docs[0]
      return NextResponse.json({
        valid: true,
        message: 'Founder Profile Verified',
        founderNumber: founder.founderNumber || 1,
      })
    }

    // 4. IF NOT FOUND IN EITHER
    return NextResponse.json(
      { valid: false, message: 'Invalid access key' },
      { status: 401 }
    )
  } catch (error) {
    console.error('VERIFY KEY ERROR:', error)
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : 'Verification Failed',
      },
      { status: 500 }
    )
  }
}