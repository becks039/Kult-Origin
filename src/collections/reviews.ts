// collections/Reviews.ts
import { CollectionConfig } from 'payload';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'customerId',
    defaultColumns: ['customerId', 'type', 'status', 'discountPercentage', 'promoCode'],
  },
  access: {
    create: () => true, // Public submission endpoint
    read: ({ req: { user } }) => Boolean(user), // Strictly restricted for Admin UI
  },
  fields: [
    {
      name: 'customerId',
      type: 'text',
      required: true,
      label: 'Customer Identification / Email',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products', // Adjust to match your products collection slug
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Text Review', value: 'TEXT' },
        { label: 'Photo Review', value: 'PHOTO' },
        { label: 'Video Review', value: 'VIDEO' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'requestedDiscount',
      type: 'number',
      label: 'Claimed Discount Percentage',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending Admin Review', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
      ],
    },
    {
      name: 'promoCode',
      type: 'text',
      label: 'Assigned Promo Code (Admin Populated)',
      admin: {
        description: 'Code manually or automatically dispatched upon approval',
      },
    },
  ],
};