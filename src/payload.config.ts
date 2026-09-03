import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Users } from '@/collections/users'
import { AccessRequests } from '@/collections/AccessRequests'
import { Waitlist } from '@/collections/waitlist'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },

  sharp,

  collections: [
    Users,
    AccessRequests,
    Waitlist,

    // ============================================================
    // MEDIA
    // ============================================================
    {
      slug: 'media',
      admin: {
        useAsTitle: 'alt',
        hidden: false, // Ensure visibility on Dashboard
        group: 'Content & Assets',
      },
      access: {
        read: () => true,
      },
      upload: {
        staticDir: path.resolve(dirname, '../public/media'),
        mimeTypes: ['image/*', 'video/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },

    // ============================================================
    // CATEGORIES
    // ============================================================
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'title',
        hidden: false,
        group: 'E-Commerce',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },

    // ============================================================
    // PRODUCTS
    // ============================================================
    {
      slug: 'products',
      admin: {
        useAsTitle: 'title',
        hidden: false,
        group: 'E-Commerce',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'msrp',
          type: 'number',
          required: true,
        },
        {
          name: 'founderPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'gsm',
          type: 'number',
        },
        {
          name: 'fabric',
          type: 'text',
          defaultValue: '200+ GSM Heavy-Fleece Technical Fabric',
        },
        {
          name: 'printType',
          type: 'text',
          defaultValue: '3D High-Build Silicone/Rubberized Print',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'DRAFT',
          options: [
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Available', value: 'AVAILABLE' },
            { label: 'Sold Out', value: 'SOLD_OUT' },
          ],
        },
        {
          name: 'images',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'totalStock',
          type: 'number',
          required: true,
          defaultValue: 500,
          min: 0,
        },
        {
          name: 'reservedStock',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'soldStock',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },

    // ============================================================
    // FOUNDER PROFILES
    // ============================================================
    {
      slug: 'founder-profiles',
      admin: {
        useAsTitle: 'physicalKeySerial',
        hidden: false,
        group: 'Founders Program',
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
        },
        {
          name: 'physicalKeySerial',
          type: 'text',
          unique: true,
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
          min: 0,
          max: 100,
        },
        {
          name: 'annualSpend',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'annualSpendCap',
          type: 'number',
          defaultValue: 100000,
          min: 0,
        },
      ],
    },

    // ============================================================
    // FOUNDER KEYS
    // ============================================================
    {
      slug: 'founder-keys',
      admin: {
        useAsTitle: 'key',
        hidden: false,
        group: 'Founders Program',
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
          defaultValue: 'AVAILABLE',
          options: [
            { label: 'Available', value: 'AVAILABLE' },
            { label: 'Assigned', value: 'ASSIGNED' },
            { label: 'Used', value: 'USED' },
            { label: 'Expired', value: 'EXPIRED' },
          ],
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
          required: true,
        },
      ],
    },

    // ============================================================
    // ORDERS
    // ============================================================
    {
      slug: 'orders',
      admin: {
        useAsTitle: 'orderNumber',
        hidden: false,
        group: 'E-Commerce',
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
              min: 1,
            },
            {
              name: 'unitPrice',
              type: 'number',
              required: true,
              min: 0,
            },
          ],
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'shippingFee',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'totalAmount',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'isFounderOrder',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'PENDING',
          options: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Paid', value: 'PAID' },
            { label: 'Failed', value: 'FAILED' },
          ],
        },
        {
          name: 'orderStatus',
          type: 'select',
          defaultValue: 'PROCESSING',
          options: [
            { label: 'Processing', value: 'PROCESSING' },
            { label: 'Shipped', value: 'SHIPPED' },
            { label: 'Delivered', value: 'DELIVERED' },
          ],
        },
      ],
    },

    // ============================================================
    // REVIEWS
    // ============================================================
    {
      slug: 'reviews',
      admin: {
        useAsTitle: 'content',
        hidden: false,
        group: 'Content & Assets',
      },
      fields: [
        {
          name: 'customer',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Text Review (5% Reward)', value: 'TEXT' },
            { label: 'Photo Review (10% Reward)', value: 'PHOTO' },
            { label: 'Video Review (20% Reward)', value: 'VIDEO' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'media',
          type: 'array',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'PENDING',
          options: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
          ],
        },
      ],
    },
  ],

  globals: [
    {
      slug: 'batch-001-settings',
      admin: {
        group: 'Settings',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'founderCap',
          type: 'number',
          defaultValue: 50,
          required: true,
          min: 1,
        },
        {
          name: 'currentFounderCount',
          type: 'number',
          defaultValue: 0,
          required: true,
          min: 0,
        },
        {
          name: 'batchStatus',
          type: 'select',
          defaultValue: 'FOUNDER_ACCESS',
          options: [
            { label: 'Locked / Waitlist', value: 'LOCKED' },
            { label: 'Founder Access Only', value: 'FOUNDER_ACCESS' },
            { label: 'Public Release', value: 'PUBLIC_RELEASE' },
          ],
        },
        {
          name: 'founderDiscountPercentage',
          type: 'number',
          defaultValue: 20,
          required: true,
          min: 0,
          max: 100,
        },
      ],
    },
  ],

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),
})