// src/globals/BatchStatus.ts
import { GlobalConfig } from 'payload'

export const BatchStatus: GlobalConfig = {
  slug: 'batch-status',
  label: 'Batch 001 Status & Counter',
  access: {
    read: () => true, // Publicly readable by Next.js Frontend
  },
  fields: [
    {
      name: 'totalBatchUnits',
      type: 'number',
      defaultValue: 500,
      required: true,
    },
    {
      name: 'unitsSold',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'founderCap',
      type: 'number',
      defaultValue: 50,
      required: true,
    },
    {
      name: 'foundersClaimed',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'isClandestineDropActive',
      type: 'checkbox',
      defaultValue: false,
      label: 'Password Protected Pre-Launch (72 Hours Out)',
    },
    {
      name: 'accessPassword',
      type: 'text',
      label: 'Clandestine Drop Access Key',
    },
  ],
}