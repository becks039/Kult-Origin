import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'birthDate', 'phoneNumber', 'role', 'isFounder'],
  },

  access: {
    // Admin panel access restriction
    admin: ({ req: { user } }) => user?.role === 'admin',

    // Allow user creation by Admin OR by System / API execution
    create: ({ req }) => {
      if (!req.user) return true // Allows server-side / system creation via hooks or API
      return req.user.role === 'admin'
    },

    // Logged-in users can read their own profile; Admins read all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },

    // Updates restricted to Admins or self
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },

    // Only Admins can delete
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },

    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
    },

    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // -------------------------
    // DATE OF BIRTH (Fixed to camelCase birthDate)
    // -------------------------
    {
      name: 'birthDate',
      type: 'date',
      label: 'Date of Birth',
      admin: {
        description: 'Used later for Birthday Protocol automation.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },

    // -------------------------
    // FOUNDER 50
    // -------------------------
    {
      name: 'isFounder',
      type: 'checkbox',
      defaultValue: false,
      label: 'Founder 50 Member',
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'founderNumber',
      type: 'number',
      label: 'Founder Number',
      min: 1,
      max: 50,
      admin: {
        description: 'Founder position from 1 to 50. Example: 12 = 012/050.',
        condition: (data) => Boolean(data?.isFounder),
      },
    },

    {
      name: 'annualSpend',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Annual Spend',
      admin: {
        description: 'Annual customer spending in PKR.',
      },
    },

    // -------------------------
    // REFERRAL & POINTS
    // -------------------------
    {
      name: 'referralCode',
      type: 'text',
      unique: true,
      label: 'Referral Code',
    },

    {
      name: 'originPoints',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Origin Points',
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Safe ISO conversion for birthDate
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