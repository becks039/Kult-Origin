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

    read: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
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
        {
          label: 'Pending',
          value: 'PENDING',
        },
        {
          label: 'Shortlisted',
          value: 'SHORTLISTED',
        },
        {
          label: 'Key Issued',
          value: 'KEY_ISSUED',
        },
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
    // -----------------------------------------
    // GENERATE ACCESS KEY
    // -----------------------------------------

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

    // -----------------------------------------
    // SHORTLIST → FOUNDER PROFILE
    // -----------------------------------------

    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Only run when an existing waitlist customer
        // changes to SHORTLISTED.
        if (operation !== 'update') {
          return
        }

        if (doc.status !== 'SHORTLISTED') {
          return
        }

        // Prevent this hook from running again if status
        // was already SHORTLISTED.
        if (previousDoc?.status === 'SHORTLISTED') {
          return
        }

        const email = doc.email?.toLowerCase().trim()

        if (!email) {
          req.payload.logger.error(
            'Cannot create Founder Profile: waitlist customer has no email.',
          )

          return
        }

        // -----------------------------------------
        // 1. CHECK IF FOUNDER PROFILE ALREADY EXISTS
        // -----------------------------------------

        const existingFounderProfile =
          await req.payload.find({
            collection: 'founder-profiles',

            where: {
              'user.email': {
                equals: email,
              },
            },

            limit: 1,
          })

        if (existingFounderProfile.totalDocs > 0) {
          req.payload.logger.info(
            `Founder Profile already exists for ${email}. Removing from waitlist.`,
          )

          await req.payload.delete({
            collection: 'waitlist',
            id: doc.id,
            req,
          })

          return
        }

        // -----------------------------------------
        // 2. FIND EXISTING USER
        // -----------------------------------------

        const existingUsers = await req.payload.find({
          collection: 'users',

          where: {
            email: {
              equals: email,
            },
          },

          limit: 1,
        })

        let user: any

        if (existingUsers.totalDocs > 0) {
          // User already exists
          user = existingUsers.docs[0]
        } else {
          // -----------------------------------------
          // 3. CREATE USER IF USER DOES NOT EXIST
          // -----------------------------------------

          // Temporary random password.
          // User can later use the password-reset flow.
          const temporaryPassword = crypto.randomBytes(24).toString('hex')

          user = await req.payload.create({
            collection: 'users',

            data: {
              email,
              name: doc.fullName,

              password: temporaryPassword,

              role: 'customer',
              isFounder: false,
              annualSpend: 0,
            },

            req,
          })
        }

        // -----------------------------------------
        // 4. FIND NEXT AVAILABLE FOUNDER NUMBER
        // -----------------------------------------

        const founderProfiles =
          await req.payload.find({
            collection: 'founder-profiles',

            limit: 50,

            sort: 'founderNumber',
          })

        const usedFounderNumbers = new Set<number>()

        // Numbers already used in founder profiles
        for (const profile of founderProfiles.docs) {
          if (profile.founderNumber) {
            usedFounderNumbers.add(profile.founderNumber)
          }
        }

        // Numbers already allocated to users
        const founderUsers = await req.payload.find({
          collection: 'users',

          where: {
            isFounder: {
              equals: true,
            },
          },

          limit: 50,
        })

        for (const founderUser of founderUsers.docs) {
          if (founderUser.founderNumber) {
            usedFounderNumbers.add(founderUser.founderNumber)
          }
        }

        // Find first available number from 1 → 50
        let founderNumber: number | null = null

        for (let number = 1; number <= 50; number++) {
          if (!usedFounderNumbers.has(number)) {
            founderNumber = number
            break
          }
        }

        // -----------------------------------------
        // 5. MAKE SURE FOUNDER SLOT EXISTS
        // -----------------------------------------

        if (!founderNumber) {
          req.payload.logger.error(
            `Cannot create Founder Profile for ${email}: all 50 founder slots are occupied.`,
          )

          return
        }

        // -----------------------------------------
        // 6. UPDATE USER AS FOUNDER
        // -----------------------------------------

        user = await req.payload.update({
          collection: 'users',

          id: user.id,

          data: {
            isFounder: true,
            founderNumber,
          },

          req,
        })

        // -----------------------------------------
        // 7. GENERATE PHYSICAL KEY SERIAL
        // -----------------------------------------

        const physicalKeySerial =
          `${String(founderNumber).padStart(3, '0')}/050`

        // -----------------------------------------
        // 8. CREATE FOUNDER PROFILE
        // -----------------------------------------

        await req.payload.create({
          collection: 'founder-profiles',

          data: {
            user: user.id,

            founderNumber,

            physicalKeySerial,

            joinedAt: new Date().toISOString(),

            lifetimeDiscount: 20,

            annualSpend: 0,

            annualSpendCap: 100000,
          },

          req,
        })

        // -----------------------------------------
        // 9. REMOVE FROM WAITLIST
        // -----------------------------------------

        await req.payload.delete({
          collection: 'waitlist',

          id: doc.id,

          req,
        })

        req.payload.logger.info(
          `Founder Profile created successfully for ${email} — Founder #${founderNumber}`,
        )
      },
    ],
  },
}