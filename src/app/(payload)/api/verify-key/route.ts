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

    // 1. Master Keys Check
    const masterKeys = ['ORIGIN50', 'ADMIN123', 'TESTKEY']
    if (masterKeys.includes(trimmedKey.toUpperCase())) {
      return NextResponse.json({
        valid: true,
        message: 'Master Key Accepted',
      })
    }

    const payload = await getPayload({ config })

    // 2. SEARCH IN ACCESS-REQUESTS FIRST
    // Included 'PENDING', 'SENT', and 'USED' so keys generated without email dispatch still work
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
              in: ['PENDING', 'SENT', 'USED'],
            },
          },
        ],
      },
      limit: 1,
    })

    if (accessReqResult.docs.length > 0) {
      const matchDoc = accessReqResult.docs[0]

      // Safe Global Settings Retrieval
      let currentFounderCount = 0
      let founderCap = 50

      try {
        const batch = await payload.findGlobal({ slug: 'batch-001-settings' })
        if (batch) {
          currentFounderCount = batch.currentFounderCount ?? 0
          founderCap = batch.founderCap ?? 50
        }
      } catch (globalErr) {
        console.warn('Global settings fetch warning:', globalErr)
      }

      // If key is already USED, re-grant access without incrementing founder count
      if (matchDoc.status === 'USED') {
        return NextResponse.json({
          valid: true,
          message: 'Access Key Re-verified',
          founderNumber: matchDoc.founderNumber || 1,
        })
      }

      // Check capacity cap
      if (currentFounderCount >= founderCap) {
        return NextResponse.json(
          { valid: false, message: 'Founder 50 allocation is already full.' },
          { status: 400 }
        )
      }

      const founderNumber = currentFounderCount + 1

      // Mark request as USED in DB
      await payload.update({
        collection: 'access-requests',
        id: matchDoc.id,
        data: {
          status: 'USED',
          founderNumber,
          keyIssuedAt: matchDoc.keyIssuedAt || new Date().toISOString(),
        },
      })

      // Update Global Count safely
      try {
        await payload.updateGlobal({
          slug: 'batch-001-settings',
          data: { currentFounderCount: founderNumber },
        })
      } catch (updateGlobalErr) {
        console.warn('Global settings update warning:', updateGlobalErr)
      }

      return NextResponse.json({
        valid: true,
        message: 'Access Key Verified',
        founderNumber,
        founderCap,
        currentFounderCount: founderNumber,
      })
    }

    // 3. FALLBACK: SEARCH IN FOUNDER-PROFILES
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

    // 4. INVALID KEY
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