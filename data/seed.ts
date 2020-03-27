import 'core-js'
import 'regenerator-runtime/runtime'
import dotenv from 'dotenv'
import path from 'path'
import * as PrismaClient from '@prisma/client'
// the only dependency from the main files
// noinspection TypeScriptPreferShortImport,ES6PreferShortImport
import { cryptoFactory } from '../src/utils/crypto/crypto-factory'

// loading dot env from root for signing key needed in cryptoFactory
dotenv.config({ path: path.resolve('../', '.env') })
const prisma = new PrismaClient.PrismaClient()

const ADMIN_PASSWORD = 'byqipyuyxlyteuajjbewsatxldvfbuqs'

// A `main` function so that we can use async/await
// this initializes the database with one admin employee, main product, inventory, and supplier
// no need to run this except once
async function main() {
  // the jwt user secret is the signing secret unique to the user for hashing the pw and signing jwt
  const { passwordHash } = await cryptoFactory.encryptUserPassword(
    ADMIN_PASSWORD
  )
  const jwtUserSecret = await cryptoFactory.generateJWTSecret(32)

  // employee and location
  const mainUser = await prisma.employee.create({
    data: {
      locationId: {
        create: {
          address: '101 bush blvd.',
          city: 'Washington',
          state: 'DC',
          zip: 11123,
          phone: '(111) 222-3333',
        },
      },
      role: 'ADMIN',
      firstName: 'Monkey',
      lastName: 'Fish',
      address: '102 bush blvd.',
      city: 'Seattle',
      state: 'WA',
      zip: 99999,
      phone: '(333) 111-2222',
      email: 'monkeys1@banana.waffle',
      jwtUserSecret,
      password: passwordHash,
    },
    include: {
      // this creates the location along with the user
      locationId: true,
    },
  })

  // product and inventory
  const mainProduct = await prisma.product.create({
    data: {
      description: '',
      inventory: {
        create: {
          aisle: 1,
          bin: '#37ew9983',
          locationId: {
            connect: { id: mainUser.locationId.id },
          },
          serialNumber: 1234,
        },
      },
      unitCost: 12000,
      price: 23000,
      modelNumber: 1,
      productCategory: 'Homes',
    },
  })
  // supplier
  const mainSupplier = await prisma.supplier.create({
    data: {
      address: '101 sand villa rd',
      city: 'jax',
      state: 'FL',
      email: 'indiesupplier@yahoo.org',
      name: 'fat john',
      phone: '301-123-9876',
      zip: 32388,
    },
  })

  console.log(`mainUser: \r\n ${JSON.stringify(mainUser)}`)
  console.log(`mainProduct: \r\n ${JSON.stringify(mainProduct)}`)
  console.log(`mainSupplier: \r\n ${JSON.stringify(mainSupplier)}`)

  return {
    userId: mainUser.id,
  }
}

// check to make sure that the encrypted db password is verified by bcrypt
async function testUserPassword(userId: number) {
  const user = await prisma.employee.findOne({ where: { id: userId } })
  const loginInputPassword = ADMIN_PASSWORD

  if (!user) {
    throw new Error('no user found.')
  }

  const match = await cryptoFactory.verifyUserPassword({
    storedPasswordHash: user.password,
    reqBodyPassword: loginInputPassword,
  })

  console.log(`Does password match: ${match}`)
}

try {
  main()
    .catch((e) => console.error(e))
    .then((res) => res && 'userId' in res && testUserPassword(res.userId))
    .finally(async () => {
      console.log('disconnecting')
      await prisma.disconnect()
    })
} catch (e) {
  console.error(e)
}
