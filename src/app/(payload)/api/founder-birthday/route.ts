import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  try {
    // 1. Security Check (n8n Header Authorization)
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized Access' },
        { status: 401 }
      )
    }

    // 2. Initialize Payload CMS
    const payload = await getPayload({ config })
    const today = new Date()
    const currentMonth = today.getMonth() + 1 // 1-12
    const currentDay = today.getDate() // 1-31

    // 3. Fetch all users who have a DOB set
    const users = await payload.find({
      collection: 'users',
      where: {
        dob: {
          exists: true,
        },
      },
      limit: 1000,
    })

    // 4. Filter users whose DOB month and day match today
    const birthdayUsers = users.docs.filter((user) => {
      if (!user.dob) return false
      const dobDate = new Date(user.dob)
      return (
        dobDate.getMonth() + 1 === currentMonth &&
        dobDate.getDate() === currentDay
      )
    })

    // 5. Return Clean JSON Response
    return NextResponse.json({
      success: true,
      count: birthdayUsers.length,
      users: birthdayUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isFounder: u.isFounder,
        founderNumber: u.founderNumber,
        // Founders get high-tier code prefix (30%), standard customers get (25%)
        discountCode: u.isFounder
          ? `KULT-FOUNDER-BDAY-${u.founderNumber || 'VIP'}`
          : `KULT-BDAY-${u.name?.substring(0, 3).toUpperCase() || 'VAL'}-25`,
        discountPercentage: u.isFounder ? 30 : 25,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}