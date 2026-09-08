import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true, // Anonymous uploads allow karein frontend review form ke liye
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime'],
    maxFileSize: 50 * 1024 * 1024, // 50MB limit setup karein videos ke liye
    // imageSizes ko dynamically handle karne ke liye format filter add karein
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center',
        formatOptions: {
          format: 'jpg',
        },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        crop: 'center',
        formatOptions: {
          format: 'jpg',
        },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
};