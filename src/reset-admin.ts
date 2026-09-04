import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import config from './payload.config'

const DB_PASSWORD = '1234' // <-- Apna PostgreSQL Password
const DB_NAME = 'kult-origin'
const DB_PORT = 1234

const connectionString = `postgres://postgres:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}`

process.env.DATABASE_URI = connectionString
process.env.POSTGRES_URL = connectionString
process.env.PAYLOAD_SECRET = 'a_very_secret_key_for_kult_origin_2026' // <-- Apna Payload Secret

const resetAdmin = async () => {
  try {
    console.log('--- CONNECTING TO POSTGRES (127.0.0.1:1234) ---')

    const resolvedConfig = await config

    const payload = await getPayload({
      config: {
        ...resolvedConfig,
        db: postgresAdapter({
          pool: {
            connectionString,
          },
        }),
      },
    })

    console.log('--- SEARCHING FOR ADMIN USER ---')

    const result = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@kultorigin.com',
        },
      },
      overrideAccess: true,
    })

    if (result.docs.length > 0) {
      const user = result.docs[0]
      console.log(`✅ Found user: ${user.email}`)

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: 'Admin@123456',
        },
        overrideAccess: true,
      })

      console.log('======================================')
      console.log('✅ PASSWORD RESET SUCCESSFUL!')
      console.log('Email:    admin@kultorigin.com')
      console.log('Password: Admin@123456')
      console.log('======================================')
    } else {
      console.log('❌ User not found. Creating new admin user with required fields...')

      await payload.create({
        collection: 'users',
        data: {
          name: 'Admin User', // <-- Required "Full Name" field added
          fullName: 'Admin User', // Safety fallback for collection schema naming
          email: 'admin@kultorigin.com',
          password: 'Admin@123456',
          role: 'admin',
        },
        overrideAccess: true,
      })

      console.log('======================================')
      console.log('✅ NEW ADMIN CREATED SUCCESSFULLY!')
      console.log('Email:    admin@kultorigin.com')
      console.log('Password: Admin@123456')
      console.log('======================================')
    }
  } catch (error) {
    console.error('❌ Error executing script:', error)
  } finally {
    process.exit(0)
  }
}

resetAdmin()