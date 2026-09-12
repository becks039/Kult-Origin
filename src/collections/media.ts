import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: () => true,
  },

  upload: {
    // FIX: Local storage ko enable karein taakay disk par image save ho sakay
    disableLocalStorage: false,

    adminThumbnail: 'thumbnail',

    mimeTypes: [
      'image/*',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],

    maxFileSize: 50 * 1024 * 1024,

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
}