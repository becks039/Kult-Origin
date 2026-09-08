import type { CollectionConfig } from 'payload'

export const FounderProfiles: CollectionConfig = {
  slug: 'founder-profiles',

  admin: {
    useAsTitle: 'physicalKeySerial',
    defaultColumns: [
      'physicalKeySerial',
      'user',
      'founderNumber',
      'phoneNumber',
      'birthDate',
      'joinedAt',
    ],
  },

  access: {
    create: ({ req }) => Boolean(req?.user?.role === 'admin' || !req?.user),
    read: ({ req }) => Boolean(req?.user),
    update: ({ req }) => Boolean(req?.user?.role === 'admin'),
    delete: ({ req }) => Boolean(req?.user?.role === 'admin'),
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
      admin: {
        description: 'Founder contact number.',
      },
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Date of Birth',
      admin: {
        description: 'Founder date of birth.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'founderNumber',
      type: 'number',
      required: true,
      unique: true,
      min: 1,
      max: 50,
      admin: {
        readOnly: true,
        description: 'Allocated sequence (1 to 50)',
      },
    },
    {
      name: 'physicalKeySerial',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        description: 'Obsidian Key serial number (e.g. 012/050)',
      },
    },
    {
      name: 'joinedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lifetimeDiscount',
      type: 'number',
      defaultValue: 20,
    },
    {
      name: 'annualSpend',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'annualSpendCap',
      type: 'number',
      defaultValue: 100000,
      admin: {
        description: 'Rs. 100,000 cap to prevent commercial resale',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.birthDate) {
          const parsed = new Date(data.birthDate)
          if (!isNaN(parsed.getTime())) {
            data.birthDate = parsed.toISOString()
          }
        }
        return data
      },
    ],
  },
}