import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'customer',
    defaultColumns: ['customer', 'product', 'type', 'status', 'discountCode', 'createdAt'],
  },
  access: {
    create: () => true, // Allows frontend customer submissions
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'customer',
      type: 'text',
      required: true,
      admin: { description: 'Customer Email or User ID' },
    },
    {
      name: 'product',
      type: 'text',
      required: true,
      admin: { description: 'Product ID or SKU' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Text Only (5% Off)', value: 'TEXT' },
        { label: 'Photo Review (10% Off)', value: 'PHOTO' },
        { label: 'Video Review (20% Off)', value: 'VIDEO' },
      ],
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending Approval', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
      ],
    },
    {
      name: 'media',
      type: 'array',
      admin: { description: 'Uploaded Media IDs array' },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'discountCode',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'discountPercentage',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'pushedToAds',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Track if n8n pushed this UGC video to Meta/TikTok Ads' },
    },
  ],
}