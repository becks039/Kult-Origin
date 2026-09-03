import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',

  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'fullName',
      'email',
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

        // 1. Check or Create User
        const existingUsers = await req.payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
          overrideAccess: true,
        })

        let userRecord: Record<string, any>

        if (existingUsers.totalDocs > 0) {
          userRecord = existingUsers.docs[0]
        } else {
          const temporaryPassword = crypto.randomBytes(24).toString('hex')
          userRecord = await req.payload.create({
            collection: 'users',
            data: {
              email,
              name: doc.fullName,
              password: temporaryPassword,
              role: 'customer',
              isFounder: true,
            },
            req,
            overrideAccess: true,
          })
        }

        // 2. Generate unique Founder Key string
        const generatedKeyString =
          doc.accessKey ||
          `ORIGIN-BATCH001-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

        // -------------------------------------------------------------
        // 2.1 CREATE FOUNDER PROFILE ENTRY
        // -------------------------------------------------------------
        const existingProfile = await req.payload.find({
          collection: 'founder-profiles',
          where: { 'user.email': { equals: email } },
          limit: 1,
          overrideAccess: true,
        })

        if (existingProfile.totalDocs === 0) {
          // Check slot count for profile number allocation
          const existingProfiles = await req.payload.find({
            collection: 'founder-profiles',
            limit: 50,
            overrideAccess: true,
          })

          const nextFounderNumber = existingProfiles.totalDocs + 1

          await req.payload.create({
            collection: 'founder-profiles',
            data: {
              user: userRecord.id,
              founderNumber: nextFounderNumber,
              physicalKeySerial: `${String(nextFounderNumber).padStart(3, '0')}/050`,
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

        // 3. Create document in 'founder-keys'
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

        // 4. PURGE / REMOVE FROM WAITLIST
        await req.payload.delete({
          collection: 'waitlist',
          id: doc.id,
          req,
          overrideAccess: true,
        })

        req.payload.logger.info(
          `Successfully created Founder Key and Founder Profile for ${email}. Purged from Waitlist.`,
        )
      },
    ],
  },
}