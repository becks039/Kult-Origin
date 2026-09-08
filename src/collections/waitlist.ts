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
    read: ({ req: { user } }) => Boolean(user?.role === 'admin' || user),
    update: () => true,
    delete: () => true,
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
      async ({ doc, previousDoc, operation, req, context }) => {
        if (context?.preventHookRecursion) return
        if (operation !== 'update' || doc.status !== 'SHORTLISTED') return
        if (previousDoc?.status === 'SHORTLISTED') return

        const email = doc.email?.toLowerCase().trim()
        if (!email) {
          req.payload.logger.error('[WAITLIST HOOK] Waitlist record email is missing.')
          return
        }

        try {
          // -------------------------------------------------------------
          // 1. EXTRACT DOB AND PHONE SAFELY
          // -------------------------------------------------------------
          let userDob: string | null = doc.birthDate || null
          let userPhone: string | null = doc.phoneNumber || null

          try {
            const accessReqs = await req.payload.find({
              collection: 'access-requests',
              where: { email: { equals: email } },
              limit: 1,
              req,
              overrideAccess: true,
            })

            if (accessReqs.docs.length > 0) {
              const rawReq = accessReqs.docs[0] as Record<string, any>
              const rawDob = rawReq.birthDate || rawReq.birthdate || rawReq.dob
              const rawPhone = rawReq.phoneNumber || rawReq.phone || rawReq.phonenumber

              if (!userDob && rawDob) userDob = rawDob
              if (!userPhone && rawPhone) userPhone = String(rawPhone)
            }
          } catch (accessReqErr) {
            req.payload.logger.warn(`[WAITLIST HOOK] Could not query access-requests: ${accessReqErr}`)
          }

          let formattedDob: string | null = null
          if (userDob) {
            const parsed = new Date(userDob)
            if (!isNaN(parsed.getTime())) {
              formattedDob = parsed.toISOString()
            }
          }

          // -------------------------------------------------------------
          // 2. CALCULATE NEXT SAFE FOUNDER NUMBER
          // -------------------------------------------------------------
          const { totalDocs: profileCount } = await req.payload.count({
            collection: 'founder-profiles',
            req,
            overrideAccess: true,
          })
          const calculatedFounderNumber = profileCount + 1

          // -------------------------------------------------------------
          // 3. CREATE / UPDATE USER
          // -------------------------------------------------------------
          const existingUsers = await req.payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
            req,
            overrideAccess: true,
          })

          let userRecord: Record<string, any>

          const userDataPayload: Record<string, any> = {
            email,
            name: doc.fullName,
            role: 'customer',
            isFounder: true,
            founderNumber: calculatedFounderNumber,
            ...(formattedDob && { birthDate: formattedDob }),
            ...(userPhone && { phoneNumber: userPhone }),
          }

          if (existingUsers.totalDocs > 0) {
            userRecord = existingUsers.docs[0]
            userRecord = await req.payload.update({
              collection: 'users',
              id: userRecord.id,
              data: userDataPayload,
              req,
              overrideAccess: true,
            })
          } else {
            const temporaryPassword = crypto.randomBytes(24).toString('hex')
            userRecord = await req.payload.create({
              collection: 'users',
              data: {
                ...userDataPayload,
                password: temporaryPassword,
              },
              req,
              overrideAccess: true,
            })
          }

          // -------------------------------------------------------------
          // 4. CREATE / UPDATE FOUNDER PROFILE
          // -------------------------------------------------------------
          const generatedKeyString =
            doc.accessKey ||
            `ORIGIN-BATCH001-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

          const profileSearch = await req.payload.find({
            collection: 'founder-profiles',
            where: { user: { equals: userRecord.id } },
            limit: 1,
            req,
            overrideAccess: true,
          })

          if (profileSearch.totalDocs > 0) {
            await req.payload.update({
              collection: 'founder-profiles',
              id: profileSearch.docs[0].id,
              data: {
                ...(userPhone && { phoneNumber: userPhone }),
                ...(formattedDob && { birthDate: formattedDob }),
              },
              req,
              overrideAccess: true,
            })
          } else {
            await req.payload.create({
              collection: 'founder-profiles',
              data: {
                user: userRecord.id,
                founderNumber: calculatedFounderNumber,
                physicalKeySerial: `${String(calculatedFounderNumber).padStart(3, '0')}/050`,
                phoneNumber: userPhone || undefined,
                birthDate: formattedDob || undefined,
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
          // 5. CREATE FOUNDER KEY
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

          req.payload.logger.info(`[WAITLIST HOOK SUCCESS] Founder profile & key created for ${email}`)

          // -------------------------------------------------------------
          // 6. SAFE DELETION FROM WAITLIST
          // -------------------------------------------------------------
          await req.payload.delete({
            collection: 'waitlist',
            id: doc.id,
            req,
            overrideAccess: true,
          })

          req.payload.logger.info(`[WAITLIST MOVED] Record ID ${doc.id} removed successfully.`)

        } catch (err: any) {
          req.payload.logger.error(
            `[WAITLIST HOOK ERROR] Failed processing ${email}: ${err?.message || err}`,
          )
          if (err?.data) {
            req.payload.logger.error(JSON.stringify(err.data, null, 2))
          }
        }
      },
    ],
  },
}