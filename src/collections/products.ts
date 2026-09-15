import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'price',
      'category',
      'stock',
      'featured',
      'updatedAt',
    ],
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name',
      },
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique URL-friendly product slug',
      },
    },

    {
      name: 'description',
      type: 'textarea',
      required: true,
    },

    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'category',
      type: 'text',
      required: true,
    },

    {
      name: 'stock',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },

    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },

    // ⭐ MAIN PRODUCT IMAGE
    {
      name: 'image',
      type: 'upload',
      relationTo: 'product-media',
      required: true,
      admin: {
        description:
          'Select the product image from Payload Media. This image will be displayed on the frontend.',
      },
    },

    // Optional additional product images
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional product images',
      },
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
      name: 'sizes',
      type: 'array',
      admin: {
        description: 'Available product sizes',
      },
      fields: [
        {
          name: 'size',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      name: 'colors',
      type: 'array',
      admin: {
        description: 'Available product colors',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}