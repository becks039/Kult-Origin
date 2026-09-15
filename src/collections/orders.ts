import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'customerEmail', 'orderStatus', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation === 'update' && previousDoc.orderStatus !== doc.orderStatus) {
          console.log(`[Order Update] Order ${doc.orderNumber} status changed from "${previousDoc.orderStatus}" to "${doc.orderStatus}"`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return `KULT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'customerName',
      type: 'text',
    },
    {
      name: 'customerEmail',
      type: 'text',
    },
    {
      name: 'orderStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        // Legacy fallbacks for existing DB records
        { label: 'Processing (Legacy)', value: 'PROCESSING' },
        { label: 'Pending (Legacy)', value: 'PENDING' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Pending (Legacy)', value: 'PENDING' },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
   {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'city', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'phone', type: 'text' }, // Optional: agar phone bhi save karwana ho
      ],
    },
  ],
}