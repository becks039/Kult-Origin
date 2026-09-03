import { CollectionConfig } from 'payload';

export const FounderProfiles: CollectionConfig = {
  slug: 'founder-profiles',
  admin: {
    useAsTitle: 'physicalKeySerial',
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
      name: 'founderNumber',
      type: 'number',
      required: true,
      unique: true,
      min: 1,
      max: 50,
      admin: {
        description: 'Allocated sequence (1 to 50)',
      },
    },
    {
      name: 'physicalKeySerial',
      type: 'text',
      unique: true,
      admin: {
        description: 'Obsidian Key serial number (e.g. 012/050)',
      },
    },
    {
      name: 'joinedAt',
      type: 'date',
      defaultValue: () => new Date(),
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
};