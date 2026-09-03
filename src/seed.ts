import payload from 'payload';
import path from 'path';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const seed = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_KEY',
    local: true,
  });

  console.log('--- SEEDING KULT ORIGIN BATCH 001 DATA ---');

  // 1. Create Default Category
  const category = await payload.create({
    collection: 'categories',
    data: {
      title: 'Architectural Gymwear',
      slug: 'architectural-gymwear',
      description: 'Heavyweight high-compression technical apparel engineered through resistance.',
      active: true,
    },
  });

  // 2. Create Initial Product (Batch 001 Item)
  await payload.create({
    collection: 'products',
    data: {
      title: 'Sentinel Keystone Heavyweight Hoodie',
      slug: 'sentinel-keystone-heavyweight-hoodie',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  text: 'Machined aesthetic with high-density architectural structure. Features 3D High-Build Silicone Crest that protrudes from fabric.',
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      msrp: 2499,
      founderPrice: 1999,
      gsm: 200,
      fabric: '200+ GSM Heavy-Fleece Technical Fabric',
      printType: '3D High-Build Silicone/Rubberized Print',
      category: category.id,
      status: 'AVAILABLE',
      totalStock: 500,
      images: [],
    },
  });

  // 3. Seed Batch 001 Global State
  await payload.updateGlobal({
    slug: 'batch-001-settings',
    data: {
      founderCap: 50,
      currentFounderCount: 0,
      batchStatus: 'FOUNDER_ACCESS',
      founderDiscountPercentage: 20,
    },
  });

  // 4. Generate 5 Sample Founder Keys
  const sampleKeys = ['ORIGIN-KEY-001', 'ORIGIN-KEY-002', 'ORIGIN-KEY-003', 'ORIGIN-KEY-004', 'ORIGIN-KEY-005'];
  for (const k of sampleKeys) {
    await payload.create({
      collection: 'founder-keys',
      data: {
        key: k,
        status: 'AVAILABLE',
        batch: 'BATCH_001',
      },
    });
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  process.exit(0);
};

seed();