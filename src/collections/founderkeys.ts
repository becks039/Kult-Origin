import { CollectionConfig } from 'payload'

export const FounderKeys: CollectionConfig = {
  slug: 'founder-keys',

  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'status', 'assignedTo', 'batch', 'createdAt'],
  },

  access: {
    create: ({ req: { user } }) => Boolean(user?.role === 'admin' || !user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },

  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Allocated access key string',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Assigned', value: 'ASSIGNED' },
        { label: 'Used', value: 'USED' },
        { label: 'Expired', value: 'EXPIRED' },
      ],
      defaultValue: 'AVAILABLE',
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'batch',
      type: 'text',
      defaultValue: 'BATCH_001',
    },
  ],
}