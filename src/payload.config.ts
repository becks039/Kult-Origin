import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env.local explicitly
dotenv.config({ path: path.resolve(dirname, '../.env.local') })

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from '@/collections/users'
import { AccessRequests } from '@/collections/AccessRequests'
import { Waitlist } from '@/collections/waitlist'
import { Orders } from '@/collections/orders'
import { Reviews } from '@/collections/reviews' // Single Source of Truth

export default buildConfig({
  admin: {
    user: Users.slug,
  },

  collections: [
    Users,
    AccessRequests,
    Waitlist,
    Orders,
    Reviews, // 👈 Imported Collection

    // MEDIA
    {
      slug: 'media',
      admin: {
        useAsTitle: 'alt',
        hidden: false,
        group: 'Content & Assets',
      },
      access: { read: () => true },
      upload: {
        staticDir: path.resolve(dirname, '../public/media'),
        mimeTypes: ['image/*', 'video/*'],
      },
      fields: [
        { name: 'alt', type: 'text', required: true },
        { name: 'caption', type: 'text' },
      ],
    },

    // CATEGORIES
    {
      slug: 'categories',
      admin: { useAsTitle: 'title', hidden: false, group: 'E-Commerce' },
      access: { read: () => true },
      fields: [
        { name: 'title', type: 'text', required: true, unique: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
        { name: 'description', type: 'textarea' },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        { name: 'active', type: 'checkbox', defaultValue: true },
      ],
    },

    // PRODUCTS
    {
      slug: 'products',
      admin: { useAsTitle: 'title', hidden: false, group: 'E-Commerce' },
      access: { read: () => true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
        { name: 'description', type: 'richText', required: true },
        { name: 'msrp', type: 'number', required: true },
        { name: 'founderPrice', type: 'number', required: true },
        { name: 'gsm', type: 'number' },
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

  globals: [
    {
      slug: 'batch-001-settings',
      admin: { group: 'Settings' },
      access: { read: () => true },
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
            {
              label: 'Locked / Waitlist',
              value: 'LOCKED',
            },
            {
              label: 'Founder Access Only',
              value: 'FOUNDER_ACCESS',
            },
            {
              label: 'Public Release',
              value: 'PUBLIC_RELEASE',
            },
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

  secret:
    process.env.PAYLOAD_SECRET ||
    'a_very_secret_key_for_kult_origin_2026',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: process.env.NODE_ENV !== 'production',
  }),
})