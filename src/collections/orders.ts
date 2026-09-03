import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          // Send Webhook to n8n for real-time allocation updates & ads engine
          try {
            await fetch(process.env.N8N_ORDER_WEBHOOK_URL || '', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(doc),
            });
          } catch (err) {
            console.error('n8n Webhook Error:', err);
          }
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
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'shippingFee',
      type: 'number',
      required: true,
      admin: {
        description: 'Customer pays shipping to maintain premium perception',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'isFounderOrder',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Paid', value: 'PAID' },
        { label: 'Failed', value: 'FAILED' },
      ],
      defaultValue: 'PENDING',
    },
    {
      name: 'orderStatus',
      type: 'select',
      options: [
        { label: 'Processing', value: 'PROCESSING' },
        { label: 'Shipped', value: 'SHIPPED' },
        { label: 'Delivered', value: 'DELIVERED' },
      ],
      defaultValue: 'PROCESSING',
    },
  ],
};