import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload =
      await getPayload({ config })

    const result = await payload.find({
      collection: 'products',

      where: {
        status: {
          equals: 'AVAILABLE',
        },
      },

      depth: 2,

      limit: 100,
    })

    return NextResponse.json({
      success: true,
      products: result.docs,
    })
  } catch (error) {
    console.error(
      'BATCH PRODUCTS ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}