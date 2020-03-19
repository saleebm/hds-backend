import { PrismaClient } from '@prisma/client'
// noinspection TypeScriptPreferShortImport
import { jwtOptionsFactory, passwordFactory } from './crypto'
const prisma = new PrismaClient()

// A `main` function so that we can use async/await
// this initializes the database with one admin employee
// no need to run this except once
async function main() {
  const { jwtUserSecret } = await jwtOptionsFactory.createUserJWTSecret()
  const password = await passwordFactory.encryptUserPassword('hihihi12')
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
      email: 'monkeys1@banana.waffle', //todo assert email is unique from client
      jwtUserSecret,
      password,
    },
    include: {
      locationId: true,
    },
  })
  console.log(mainUser)
  return {
    userId: mainUser.id,
  }
}

async function testUserPassword(userId: number) {
  const user = await prisma.employee.findOne({ where: { id: userId } })
  const loginInputPassword = 'hihihi12'

  console.log(user && user.password)

  if (!user) {
    throw new Error('no user found')
  }

  const match = await passwordFactory.verifyUserPassword({
    storedPasswordHash: user.password,
    reqBodyPassword: loginInputPassword,
  })

  console.log(match)
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
