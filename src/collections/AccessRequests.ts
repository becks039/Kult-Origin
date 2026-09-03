import { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const AccessRequests: CollectionConfig = {
  slug: 'access-requests',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'accessKey', 'status', 'createdAt'],
  },

  access: {
    create: () => true, // Allows public form submissions
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
        { label: 'Pending', value: 'PENDING' },
        { label: 'Key Issued', value: 'SENT' },
        { label: 'Used', value: 'USED' },
        { label: 'Rejected', value: 'REJECTED' },
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
    // 1. GENERATE UNIQUE ACCESS KEY
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
    // 2. AUTOMATIC SYNC WITH WAITLIST
    // ============================================================
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const email = doc.email?.toLowerCase().trim()
        if (!email) return

        // --------------------------------------------------------
        // A. CREATE: Auto-add new request to Waitlist as PENDING
        // --------------------------------------------------------
        if (operation === 'create') {
          const existingWaitlist = await req.payload.find({
            collection: 'waitlist',
            where: {
              email: { equals: email },
            },
            limit: 1,
            overrideAccess: true,
          })

          if (existingWaitlist.totalDocs === 0) {
            await req.payload.create({
              collection: 'waitlist',
              data: {
                fullName: doc.name,
                email: email,
                accessKey: doc.accessKey,
                status: 'PENDING',
              },
              req,
              overrideAccess: true,
            })

            req.payload.logger.info(
              `Access request for ${email} automatically synced to Waitlist as PENDING.`,
            )
          }
        }

        // --------------------------------------------------------
        // B. UPDATE: Sync Status Changes if Updated in AccessRequests
        // --------------------------------------------------------
        if (operation === 'update' && doc.status !== previousDoc?.status) {
          const waitlistRecord = await req.payload.find({
            collection: 'waitlist',
            where: {
              email: { equals: email },
            },
            limit: 1,
            overrideAccess: true,
          })

          if (waitlistRecord.totalDocs > 0) {
            const waitlistDoc = waitlistRecord.docs[0]

            // If AccessRequest is set to SENT, mark Waitlist as KEY_ISSUED
            let targetStatus = waitlistDoc.status
            if (doc.status === 'SENT') {
              targetStatus = 'KEY_ISSUED'
            }

            if (targetStatus !== waitlistDoc.status) {
              await req.payload.update({
                collection: 'waitlist',
                id: waitlistDoc.id,
                data: {
                  status: targetStatus,
                },
                req,
                overrideAccess: true,
              })
            }
          }
        }
      },
    ],
  },
}