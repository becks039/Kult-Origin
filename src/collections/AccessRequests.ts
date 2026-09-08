import { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const AccessRequests: CollectionConfig = {
  slug: 'access-requests',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'birthDate', 'phoneNumber', 'accessKey', 'status', 'createdAt'],
  },

  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'fullName',
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
        description: 'Customer date of birth collected at key request.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
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
    {
      name: 'founderNumber',
      type: 'number',
      unique: true,
      admin: {
        readOnly: true,
        description: 'Founder allocation number from 1 to 50.',
      },
    },
    {
      name: 'founderKey',
      type: 'relationship',
      relationTo: 'founder-keys',
      admin: {
        readOnly: true,
        description: 'Founder Key assigned to this customer.',
      },
    },
    {
      name: 'keyIssuedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Date and time when Founder Key was issued.',
      },
    },
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

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.accessKey) {
          data.accessKey = `ORIGIN-${crypto
            .randomBytes(3)
            .toString('hex')
            .toUpperCase()}`
        }

        // Auto-convert string date to ISO for Payload
        if (data.birthDate) {
          const parsed = new Date(data.birthDate)
          if (!isNaN(parsed.getTime())) {
            data.birthDate = parsed.toISOString()
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const email = doc.email?.toLowerCase().trim()
        if (!email) return

        // 1. New Request -> Create Waitlist Record
        if (operation === 'create') {
          const existingWaitlist = await req.payload.find({
            collection: 'waitlist',
            where: { email: { equals: email } },
            limit: 1,
            overrideAccess: true,
          })

          if (existingWaitlist.totalDocs === 0) {
            await req.payload.create({
              collection: 'waitlist',
              data: {
                fullName: doc.name,
                email: email,
                birthDate: doc.birthDate,
                phoneNumber: doc.phoneNumber,
                accessKey: doc.accessKey,
                status: 'PENDING',
              },
              req,
              overrideAccess: true,
            })
          }
        }

        // 2. Status Changed -> Sync Waitlist & Founder Profile
        if (operation === 'update' && doc.status !== previousDoc?.status) {
          // Sync Waitlist Status
          const waitlistRecord = await req.payload.find({
            collection: 'waitlist',
            where: { email: { equals: email } },
            limit: 1,
            overrideAccess: true,
          })

          if (waitlistRecord.totalDocs > 0) {
            const waitlistDoc = waitlistRecord.docs[0]
            let targetStatus = waitlistDoc.status

            if (doc.status === 'SENT') {
              targetStatus = 'KEY_ISSUED'
            } else if (doc.status === 'USED') {
              targetStatus = 'SHORTLISTED'
            } else if (doc.status === 'REJECTED') {
              targetStatus = 'REJECTED'
            }

            if (targetStatus !== waitlistDoc.status) {
              await req.payload.update({
                collection: 'waitlist',
                id: waitlistDoc.id,
                data: { status: targetStatus },
                req,
                overrideAccess: true,
              })
            }
          }

          // Sync to Founder Profile (If matching registered User exists)
          if (doc.status === 'SENT' || doc.status === 'USED') {
            const userMatch = await req.payload.find({
              collection: 'users',
              where: { email: { equals: email } },
              limit: 1,
              overrideAccess: true,
            })

            if (userMatch.totalDocs > 0) {
              const userId = userMatch.docs[0].id

              const profileMatch = await req.payload.find({
                collection: 'founder-profiles',
                where: { user: { equals: userId } },
                limit: 1,
                overrideAccess: true,
              })

              if (profileMatch.totalDocs > 0) {
                // Update existing profile
                await req.payload.update({
                  collection: 'founder-profiles',
                  id: profileMatch.docs[0].id,
                  data: {
                    phoneNumber: doc.phoneNumber || profileMatch.docs[0].phoneNumber,
                    birthDate: doc.birthDate || profileMatch.docs[0].birthDate,
                  },
                  req,
                  overrideAccess: true,
                })
              } else if (doc.founderNumber) {
                // Auto-create Founder Profile if founderNumber is assigned
                await req.payload.create({
                  collection: 'founder-profiles',
                  data: {
                    user: userId,
                    founderNumber: doc.founderNumber,
                    phoneNumber: doc.phoneNumber,
                    birthDate: doc.birthDate,
                  },
                  req,
                  overrideAccess: true,
                })
              }
            }
          }
        }
      },
    ],
  },
}