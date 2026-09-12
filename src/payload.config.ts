import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'

import { Users } from '@/collections/users'
import { AccessRequests } from '@/collections/AccessRequests'
import { Waitlist } from '@/collections/waitlist'
import { Orders } from '@/collections/orders'
import { Reviews } from '@/collections/reviews'
import { Media } from '@/collections/media'

// PATH SETUP
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ENVIRONMENT VARIABLES
dotenv.config({
  path: path.resolve(dirname, '../.env.local'),
})

const databaseURI = process.env.DATABASE_URI
const payloadSecret = process.env.PAYLOAD_SECRET
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

// ENVIRONMENT VALIDATION
if (!databaseURI) {
  console.warn('⚠️ DATABASE_URI is not defined. Falling back to local PostgreSQL.')
}

if (!payloadSecret) {
  console.warn('⚠️ PAYLOAD_SECRET is not defined. A development fallback will be used.')
}

if (!blobToken) {
  console.warn('⚠️ BLOB_READ_WRITE_TOKEN is not defined. Vercel Blob uploads may not work.')
}

// PAYLOAD CONFIG
export default buildConfig({
  // ADMIN
  admin: {
    user: Users.slug,
  },

  // PLUGINS (FIXED VERCEL BLOB CONFIGURATION)
  plugins: [
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: {
          disableLocalStorage: true,
          generateFileURL: ({ filename }) => {
            if (process.env.BLOB_STORE_ID) {
              return `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/${filename}`
            }
            // Fallback direct file URL if BLOB_STORE_ID is missing
            return `/api/media/file/${filename}`
          },
        },
      },
    }),
  ],

  // COLLECTIONS
  collections: [
    Users,
    AccessRequests,
    Waitlist,
    Orders,
    Reviews,
    Media,

    // CATEGORIES
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

    // PRODUCTS
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
          min: 0,
        },
        {
          name: 'founderPrice',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'gsm',
          type: 'number',
          min: 0,
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

    // FOUNDER PROFILES
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

    // FOUNDER KEYS
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
  ],

  // GLOBALS
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

  // EDITOR
  editor: lexicalEditor({}),

  // PAYLOAD SECRET
  secret: payloadSecret || 'a_very_secret_key_for_kult_origin_2026',

  // TYPESCRIPT
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // DATABASE CONFIGURATION (WITH FIXED SSL HANDSHAKE)
  db: postgresAdapter({
    pool: {
      connectionString:
        databaseURI ||
        'postgresql://postgres:1234@localhost:1234/kult-origin',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    push: true,
  }),
})