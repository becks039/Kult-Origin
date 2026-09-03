import { CollectionConfig } from 'payload';

export const FounderKeys: CollectionConfig = {
  slug: 'founder-keys',
  admin: {
    useAsTitle: 'key',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
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
};