import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const batch = await payload.findGlobal({
      slug: 'batch-001-settings',
    })

    return NextResponse.json({
      success: true,
      currentFounderCount: batch.currentFounderCount ?? 0,
      founderCap: batch.founderCap ?? 50,
    })
  } catch (error) {
    console.error('BATCH STATUS ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch batch status',
      },
      { status: 500 }
    )
  }
}