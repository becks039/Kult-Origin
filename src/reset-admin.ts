import payload from 'payload'
import dotenv from 'dotenv'
import config from './payload.config'

dotenv.config({
  path: '.env.local',
})

const resetAdmin = async () => {
  console.log('--- INITIALIZING PAYLOAD ---')

  await payload.init({
    config,
    local: true,
  })

  console.log('--- FINDING ADMIN USER ---')

  const result = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@kultorigin.com',
      },
    },
    limit: 1,
    overrideAccess: true,
  })

  if (!result.docs.length) {
    console.log('❌ Admin user not found.')
    process.exit(1)
  }

  const user = result.docs[0]

  console.log(`✅ User found: ${user.email}`)
  console.log(`User ID: ${user.id}`)

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      password: 'Admin@123456',
    },
    overrideAccess: true,
  })

  console.log('')
  console.log('======================================')
  console.log('✅ ADMIN PASSWORD RESET SUCCESSFULLY')
  console.log('======================================')
  console.log('')
  console.log('Email:    admin@kultorigin.com')
  console.log('Password: Admin@123456')
  console.log('')
  console.log('Open: http://localhost:3000/admin')
  console.log('======================================')

  process.exit(0)
}

resetAdmin()