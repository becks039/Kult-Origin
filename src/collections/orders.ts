import { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalAmount', 'orderStatus', 'createdAt'],
  },
  access: {
    // Guest customers ko order place karne ki permission dena
    create: () => true,
    read: ({ req: { user } }) => Boolean(user), // Direct read access only for logged-in admin
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Automatically generate unique order number on create
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `KULT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        }
        return data;
      },
    ],
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
      admin: {
        readOnly: true,
      },
    },
    // Guest Customer Information (Direct Fields)
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'text',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'street', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
      ],
    },
    // Optional Registered User Relationship
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
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
        {
          name: 'size',
          type: 'text',
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
      defaultValue: 250,
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
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
      defaultValue: 'PROCESSING',
    },
  ],
};