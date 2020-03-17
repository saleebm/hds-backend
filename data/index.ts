import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
// this initializes the database with one admin employee
// no need to run this except once
async function main() {
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
      name: 'Monkey',
      address: '102 bush blvd.',
      city: 'Seattle',
      state: 'WA',
      zip: 99999,
      phone: '(333) 111-2222',
      email: 'monkeys@banana.waffle',
    },
    include: {
      locationId: true,
    },
  })
  console.log(mainUser)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.disconnect()
  })
