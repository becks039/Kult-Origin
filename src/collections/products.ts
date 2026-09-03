import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
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
    // --- BATCH & FOUNDER EDITION FIELDS ---
    {
      name: 'batch',
      type: 'text',
      defaultValue: 'BATCH-001',
      admin: {
        description: 'e.g., BATCH-001, BATCH-002',
      },
    },
    {
      name: 'isFounderEdition',
      type: 'checkbox',
      defaultValue: true,
      label: 'Founder Edition Item',
    },
    // --------------------------------------
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
    // Dynamic Sizes option
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'S', value: 'SMALL' },
        { label: 'M', value: 'MEDIUM' },
        { label: 'L', value: 'LARGE' },
        { label: 'XL', value: 'X-LARGE' },
      ],
      defaultValue: ['SMALL', 'MEDIUM', 'LARGE', 'X-LARGE'],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Sold Out', value: 'SOLD_OUT' },
      ],
      defaultValue: 'AVAILABLE',
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
    },
    {
      name: 'reservedStock',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'soldStock',
      type: 'number',
      defaultValue: 0,
    },
  ],
};