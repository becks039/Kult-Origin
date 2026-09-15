import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'E-Commerce',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  upload: {
    disableLocalStorage: false,
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
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
}