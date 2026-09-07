import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',

  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'fullName',
      'email',
      'birthDate',
      'accessKey',
      'status',
      'founderKey',
      'createdAt',
    ],
  },

  access: {
    create: () => true,
    read: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Date of Birth',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'accessKey',
      type: 'text',
      label: 'Allocated Access Key',
      admin: {
        readOnly: true,
        description: 'Access key generated for this customer.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Shortlisted', value: 'SHORTLISTED' },
        { label: 'Key Issued', value: 'KEY_ISSUED' },
      ],
      admin: {
        description: 'Current waitlist status.',
      },
    },
    {
      name: 'founderKey',
      type: 'relationship',
      relationTo: 'founder-keys',
      admin: {
        description: 'Founder Key assigned to this waitlist customer.',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.accessKey) {
          data.accessKey = `ORIGIN-${crypto
            .randomBytes(3)
            .toString('hex')
            .toUpperCase()}`
        }
        return data
      },
    ],

    // -------------------------------------------------------------
    // SHORTLISTED → CREATE FOUNDER KEY + FOUNDER PROFILE & PURGE
    // -------------------------------------------------------------
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== 'update' || doc.status !== 'SHORTLISTED') {
          return
        }

        if (previousDoc?.status === 'SHORTLISTED') {
          return
        }

        const email = doc.email?.toLowerCase().trim()
        if (!email) {
          req.payload.logger.error('Waitlist item has no email.')
          return
        }

        // -------------------------------------------------------------
        // 0. FETCH DATA FROM ACCESS-REQUESTS COLLECTION (DOB & PHONE)
        // -------------------------------------------------------------
        let userDob: string | null = doc.birthDate || null
        let userPhone: string | null = doc.phoneNumber || null

        try {
          const accessRequestDocs = await req.payload.find({
            collection: 'access-requests',
            where: { email: { equals: email } },
            limit: 1,
            overrideAccess: true,
          })

          if (accessRequestDocs.docs.length > 0) {
            const rawReqDoc = accessRequestDocs.docs[0] as Record<string, any>
            const rawDob = rawReqDoc.birthDate || rawReqDoc.dob
            const rawPhone = rawReqDoc.phoneNumber || rawReqDoc.phone

            if (!userDob && rawDob) {
              const parsedDate = new Date(rawDob)
              if (!isNaN(parsedDate.getTime())) {
                userDob = parsedDate.toISOString()
              }
            }

            if (!userPhone && rawPhone) {
              userPhone = rawPhone
            }
          }
        } catch (err) {
          req.payload.logger.error(
            `Error fetching details from access-requests for ${email}: ${err}`,
          )
        }

        // Format validation for birthDate
        if (userDob) {
          const parsedDate = new Date(userDob)
          userDob = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null
        }

        // -------------------------------------------------------------
        // 1. CALCULATE NEXT FOUNDER NUMBER (1 to 50)
        // -------------------------------------------------------------
        const existingProfiles = await req.payload.find({
          collection: 'founder-profiles',
          limit: 100,
          overrideAccess: true,
        })
        const calculatedFounderNumber = existingProfiles.totalDocs + 1

        // -------------------------------------------------------------
        // 2. CHECK OR CREATE / UPDATE USER WITH ALL FIELDS
        // -------------------------------------------------------------
        const existingUsers = await req.payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
          overrideAccess: true,
        })

        let userRecord: Record<string, any>

        const userPayloadData: Record<string, any> = {
          email,
          name: doc.fullName,
          role: 'customer',
          isFounder: true,
          founderNumber: calculatedFounderNumber,
        }

        if (userDob) {
          userPayloadData.dob = userDob
          userPayloadData.birthDate = userDob
        }

        if (userPhone) {
          userPayloadData.phoneNumber = userPhone
          userPayloadData.phone = userPhone
        }

        if (existingUsers.totalDocs > 0) {
          userRecord = existingUsers.docs[0]

          userRecord = await req.payload.update({
            collection: 'users',
            id: userRecord.id,
            data: userPayloadData,
            req,
            overrideAccess: true,
          })
        } else {
          const temporaryPassword = crypto.randomBytes(24).toString('hex')
          userRecord = await req.payload.create({
            collection: 'users',
            data: {
              ...userPayloadData,
              password: temporaryPassword,
            },
            req,
            overrideAccess: true,
          })
        }

        // -------------------------------------------------------------
        // 3. GENERATE KEY STRING & CREATE FOUNDER PROFILE
        // -------------------------------------------------------------
        const generatedKeyString =
          doc.accessKey ||
          `ORIGIN-BATCH001-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

        const existingProfile = await req.payload.find({
          collection: 'founder-profiles',
          where: { 'user.email': { equals: email } },
          limit: 1,
          overrideAccess: true,
        })

        if (existingProfile.totalDocs === 0) {
          await req.payload.create({
            collection: 'founder-profiles',
            data: {
              user: userRecord.id,
              founderNumber: calculatedFounderNumber,
              physicalKeySerial: `${String(calculatedFounderNumber).padStart(3, '0')}/050`,
              accessKey: generatedKeyString,
              joinedAt: new Date().toISOString(),
              lifetimeDiscount: 20,
              annualSpend: 0,
              annualSpendCap: 100000,
            },
            req,
            overrideAccess: true,
          })
        }

        // -------------------------------------------------------------
        // 4. CREATE FOUNDER KEY ENTRY
        // -------------------------------------------------------------
        await req.payload.create({
          collection: 'founder-keys',
          data: {
            key: generatedKeyString,
            status: 'ASSIGNED',
            assignedTo: userRecord.id,
            batch: 'BATCH_001',
          },
          req,
          overrideAccess: true,
        })

        // -------------------------------------------------------------
        // 5. PURGE / REMOVE FROM WAITLIST
        // -------------------------------------------------------------
        await req.payload.delete({
          collection: 'waitlist',
          id: doc.id,
          req,
          overrideAccess: true,
        })

        req.payload.logger.info(
          `Successfully created Founder Key, Profile, and updated User fields for ${email}. Purged from Waitlist.`,
        )
      },
    ],
  },
}