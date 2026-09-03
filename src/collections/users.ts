import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'isFounder'],
  },

  access: {
    // Who can access Payload Admin Panel
    admin: ({ req: { user } }) => {
      return user?.role === 'admin'
    },

    // Only admins can create users from Payload Admin Panel/API
    create: ({ req: { user } }) => {
      return user?.role === 'admin'
    },

    // Logged-in users can read their own profile.
    // Admins can read everyone.
    read: ({ req: { user } }) => {
      if (!user) {
        return false
      }

      if (user.role === 'admin') {
        return true
      }

      return {
        id: {
          equals: user.id,
        },
      }
    },

    // Only admins can update users.
    update: ({ req: { user } }) => {
      return user?.role === 'admin'
    },

    // Only admins can delete users.
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },

    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },

    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',

      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],

      admin: {
        position: 'sidebar',
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

        condition: (data) => {
          return Boolean(data?.isFounder)
        },
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

    {
      name: 'dob',
      type: 'date',
      label: 'Date of Birth',

      admin: {
        description: 'Used later for Birthday Protocol automation.',
      },
    },

    // -------------------------
    // REFERRAL
    // -------------------------

    {
      name: 'referralCode',
      type: 'text',
      unique: true,
      label: 'Referral Code',
    },

    // -------------------------
    // ORIGIN POINTS
    // -------------------------

    {
      name: 'originPoints',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Origin Points',
    },
  ],
}