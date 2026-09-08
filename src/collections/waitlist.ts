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
        return data
      },
    ],

    afterChange: [
      async ({ doc, previousDoc, operation, req, context }) => {
        // Prevent recursive loop execution
        if (context?.preventHookRecursion) {
          return
        }

        if (operation !== 'update' || doc.status !== 'SHORTLISTED') {
          return
        }

        if (previousDoc?.status === 'SHORTLISTED') {
          return
        }

        const email = doc.email?.toLowerCase().trim()
        if (!email) {
          req.payload.logger.error('[WAITLIST HOOK] Waitlist item has no email.')
          return
        }

        try {
          // -------------------------------------------------------------
          // 0. EXTRACT PHONE & DOB (STRICT FIELD CHECK)
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

              const rawDob =
                rawReqDoc.birthDate || rawReqDoc.birthdate || rawReqDoc.dob
              const rawPhone =
                rawReqDoc.phoneNumber || rawReqDoc.phone || rawReqDoc.phonenumber

              if (!userDob && rawDob) userDob = rawDob
              if (!userPhone && rawPhone) userPhone = String(rawPhone)
            }
          } catch (err) {
            req.payload.logger.error(
              `[WAITLIST HOOK] Error fetching access-requests for ${email}: ${err}`,
            )
          }

          let formattedDob: string | null = null
          if (userDob) {
            const parsed = new Date(userDob)
            if (!isNaN(parsed.getTime())) {
              formattedDob = parsed.toISOString()
            }
          }

          req.payload.logger.info(
            `[EXTRACTED DATA LOG] Email: ${email} | Phone: ${userPhone} | DOB: ${formattedDob}`,
          )

          // -------------------------------------------------------------
          // 1. CALCULATE FOUNDER NUMBER
          // -------------------------------------------------------------
          const { totalDocs: profileCount } = await req.payload.count({
            collection: 'founder-profiles',
            overrideAccess: true,
          })
          const calculatedFounderNumber = profileCount + 1

          // -------------------------------------------------------------
          // 2. CHECK / CREATE / UPDATE USER
          // -------------------------------------------------------------
          const existingUsers = await req.payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
            overrideAccess: true,
          })

          let userRecord: Record<string, any>

          // Strictly mapped standard field names only
          const userPayloadData: Record<string, any> = {
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
              data: userPayloadData,
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
              overrideAccess: true,
            })
          }

          // -------------------------------------------------------------
          // 3. CREATE OR UPDATE FOUNDER PROFILE
          // -------------------------------------------------------------
          const generatedKeyString =
            doc.accessKey ||
            `ORIGIN-BATCH001-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

          const profileSearch = await req.payload.find({
            collection: 'founder-profiles',
            where: { user: { equals: userRecord.id } },
            limit: 1,
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
              overrideAccess: true,
            })
          }

          // -------------------------------------------------------------
          // 4. FOUNDER KEY CREATION
          // -------------------------------------------------------------
          const createdKeyDoc = await req.payload.create({
            collection: 'founder-keys',
            data: {
              key: generatedKeyString,
              status: 'ASSIGNED',
              assignedTo: userRecord.id,
              batch: 'BATCH_001',
            },
            overrideAccess: true,
          })

          // -------------------------------------------------------------
          // 5. MOVE / DELETE RECORD FROM WAITLIST
          // -------------------------------------------------------------
          req.payload.logger.info(
            `[WAITLIST HOOK SUCCESS] Founder sync completed for ${email}`,
          )

          // Background event loop tick par waitlist document clean kar rahe hain
          setImmediate(async () => {
            try {
              await req.payload.delete({
                collection: 'waitlist',
                id: doc.id,
                overrideAccess: true,
              })
              req.payload.logger.info(
                `[WAITLIST MOVED] Record ID ${doc.id} removed from waitlist collection.`,
              )
            } catch (deleteErr) {
              req.payload.logger.error(
                `[WAITLIST HOOK] Purge error for ID ${doc.id}: ${deleteErr}`,
              )
            }
          })
        } catch (err: any) {
          req.payload.logger.error(
            `[WAITLIST HOOK ERROR] Failed processing ${email}: ${err?.message || err}`,
          )
          if (err?.data) {
            req.payload.logger.error(
              JSON.stringify(err.data, null, 2),
            )
          }
        }
      },
    ],
  },
}