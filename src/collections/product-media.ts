import { CollectionConfig } from 'payload'

export const ProductMedia: CollectionConfig = {
  slug: 'product-media',
  admin: {
    // Isay e-commerce group ke under group kar diya
    group: 'E-Commerce', 
    useAsTitle: 'alt',
  },
  upload: {
    staticURL: '/media/products',
    staticDir: 'media/products',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'fullscreen',
        width: 1440,
        height: 1920,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      defaultValue: 'Kult Origin Product Asset',
    },
  ],
}