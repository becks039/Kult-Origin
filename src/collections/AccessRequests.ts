
import { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const AccessRequests: CollectionConfig = {
  slug: 'access-requests',

  admin: {
    useAsTitle: 'email',
  },

  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
  },

  fields: [
    // ============================================================
    // CUSTOMER INFORMATION
    // ============================================================

    {
      name: 'name',
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

    // ============================================================
    // GENERATED ACCESS KEY
    // ============================================================

    {
      name: 'accessKey',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Automatically generated access key.',
      },
    },

    // ============================================================
    // FOUNDER NUMBER: 001 - 050
    // ============================================================

    {
      name: 'founderNumber',
      type: 'number',
      unique: true,
      admin: {
        readOnly: true,
        description: 'Founder allocation number from 1 to 50.',
      },
    },

    // ============================================================
    // FOUNDER KEY RELATIONSHIP
    // ============================================================

    {
      name: 'founderKey',
      type: 'relationship',
      relationTo: 'founder-keys',
      admin: {
        readOnly: true,
        description: 'Founder Key assigned to this customer.',
      },
    },

    // ============================================================
    // KEY ISSUED DATE
    // ============================================================

    {
      name: 'keyIssuedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date and time when Founder Key was issued.',
      },
    },

    // ============================================================
    // REQUEST STATUS
    // ============================================================

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
          label: 'Key Issued',
          value: 'SENT',
        },
        {
          label: 'Used',
          value: 'USED',
        },
        {
          label: 'Rejected',
          value: 'REJECTED',
        },
      ],

      admin: {
        description: 'Current state of the access request.',
      },
    },
  ],

  // ============================================================
  // HOOKS
  // ============================================================

  hooks: {
    // ============================================================
    // GENERATE ACCESS KEY
    // ============================================================

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

    // ============================================================
    // AUTOMATICALLY ADD REQUEST TO WAITLIST
    // ============================================================

    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') {
          return
        }

        // Check whether this email already exists in Waitlist
        const existing = await req.payload.find({
          collection: 'waitlist',

          where: {
            email: {
              equals: doc.email,
            },
          },

          limit: 1,
        })

        // Create Waitlist record if it doesn't already exist
        if (existing.totalDocs === 0) {
          await req.payload.create({
            collection: 'waitlist',

            data: {
              fullName: doc.name,
              email: doc.email,
              accessKey: doc.accessKey,
              status: 'KEY_ISSUED',
            },
          })
        }
      },
    ],
  },
}