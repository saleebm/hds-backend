import * as PrismaClient from '@prisma/client'
// product sample
import applianceData from './json/appliances.json'
// customers from tab delimited csv
import customerData from './json/customers.json'
// random words for emp addresses...
import randomWords from './json/dictionary.json'
// employees
import employeeData from './json/employees.json'
// locations
import locationData from './json/location.json'

import dotenv from 'dotenv'
import path from 'path'
// the only dependency from the main files
// IT WOULD BE NICE TO NOT TO THIS, KIND OF SLOPPY, JOE.
// who is Joe?
// JOE MAMA. But for real, this is sloppy. This does not confide in the domain of this utility
import { cryptoFactory } from '@Utils/crypto'

const prisma = new PrismaClient.PrismaClient()

// loading dot env from root for signing key needed in cryptoFactory
dotenv.config({ path: path.resolve('../', '.env') })

const ADMIN_PASSWORD = process.env.ADMIN_PASS
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

if (ADMIN_PASSWORD && ADMIN_EMAIL){
  console.log('using admin email and password:')
  console.log(ADMIN_EMAIL)
  console.log(ADMIN_PASSWORD)
}

// lol i didn't really think about naming this like that, at it least we know is long ;)
const DIC_LENGTH =
  !!randomWords &&
  '0' in randomWords &&
  Array.isArray(randomWords[0]) &&
  Object.keys(randomWords[0]).length

const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max))

// gives a number string
const getNumString = () =>
  Math.floor(Math.random() * 8 + 1) + Math.random().toString().slice(3)

// const getRandomPhoneNumberString = (numString: string) =>
//   `(${numString.slice(0, 3)}) ${numString.slice(3, 6)}-${numString.slice(
//     6,
//     10
//   )}`

// generates an address randomly from the dictionary
function* addressGenerator() {
  // the strict type checking nature in me makes me do this
  while (true) {
    yield `${getRandomInt(300)} ${
      !!randomWords &&
      '0' in randomWords &&
      Array.isArray(randomWords[0]) &&
      randomWords[0][getRandomInt(DIC_LENGTH || 300)]
    } street`
  }
}

// found this on stack somewhere. forgot to ref it, sorry dude
// maybe use this if something breaks
function makeId(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const getAisle = () => getRandomInt(9)

async function createLocations() {
  //make the locations
  const locationCreateInput = []

  // create locations and assign each a default inventory
  for (const loc of locationData) {
    locationCreateInput.push(
      prisma.storeLocations.create({
        data: {
          address: loc.LOC_ADDR,
          city: loc.LOCATION,
          phone: loc.loc_phone,
          state: loc.STATE,
          zipCode: loc.loc_zip,
        },
      })
    )
  }

  // locations first
  return await Promise.all(locationCreateInput).catch((e) => {
    throw new Error(e)
  })
}

async function createProducts(locations: PrismaClient.StoreLocations[]) {
  const productsCreateInput = []
  const MAX_QOH = 33

  for (const appliance of applianceData) {
    const { Brand, Cost, Description, ListPrice, Model, Serial } = appliance
    productsCreateInput.push(
      prisma.product.create({
        data: {
          brand: Brand,
          listPrice: Number(ListPrice.toFixed(2)),
          unitPrice: Number(Cost.toFixed(2)),
          deliveryPrice: Number((Cost * 0.25).toFixed(2)),
          productCategory: 'Appliances',
          modelNumber: Model,
          description: Description,
          serialNumber: `${Serial}`,
          inventory: {
            create: locations.map((loc) => ({
              quantityOnHand: getRandomInt(MAX_QOH),
              aisle: getAisle(),
              bin: makeId(12),
              storeLocations: {
                connect: {
                  idStoreLocations: loc.idStoreLocations,
                },
              },
            })),
          },
        },
      })
    )
  }

  return await Promise.all(productsCreateInput).catch((e) => {
    throw new Error(e)
  })
}
// A `main` function so that we can use async/await
// this initializes the database with one admin employee, main product, inventory, and supplier
// no need to run this except once
async function main() {
  const locations = await createLocations()

  // first the products to put in the inventories
  const products = await createProducts(locations)

  console.log(`Products created: ${products.length}`)

  const employeesCreateInput = []
  const customerCreateInput = []

  // the supplier is the G man
  const supplierCreateInput = await prisma.suppliers
    .create({
      data: {
        city: 'jax',
        state: 'FL',
        email: 'indiesupplier@yahoo.org',
        name: 'The Plug aka OG B',
        phone: '301-123-9876',
        zip: 32388,
      },
    })
    .catch((e) => {
      throw new Error(e)
    })

  // show the plug some respect
  console.log(`the plug: ${JSON.stringify(supplierCreateInput)}`)

  const addressGen = addressGenerator()

  if (ADMIN_PASSWORD && ADMIN_EMAIL) {
    const {
      passwordHash: yourEncryptedHash,
    } = await cryptoFactory.encryptUserPassword(ADMIN_PASSWORD).catch((e) => {
      throw new Error(e)
    })
    employeesCreateInput.push(
      prisma.employee.create({
        data: {
          positionName: 'PRESIDENT_CEO',
          zipCode: 38939,
          userSigningSecret: await cryptoFactory
            .generateJWTSecret(32)
            .catch((e) => {
              throw new Error(e)
            }),
          lastName: 'Monkey',
          firstName: 'ball',
          state: 'FL',
          password: yourEncryptedHash,
          roleCapability: 'READ_WRITE',
          email: ADMIN_EMAIL,
          address: '101 e wind ct',
          city: 'longdic',
          salary: 1_000_000.99 /* every dolla counts g */,
          storeLocations: {
            connect: { idStoreLocations: locations[0].idStoreLocations },
          },
        },
      })
    )
  }

  for (const emp of employeeData) {
    // employees
    // the jwt user secret is the signing secret unique to the user for hashing the pw and signing jwt

    //todo dont do this for real! its just seed data though
    // but using the same password and jwt for everyone!?? secure! ¯\_(ツ)_/¯
    const { passwordHash } = await cryptoFactory
      .encryptUserPassword(ADMIN_PASSWORD || 'byqipyuyxlyteuajjbewsatxldvfbuqs')
      .catch((e) => {
        throw new Error(e)
      })

    // at least the one way hash will pretty much be different for everyone ¯\_(ツ)_/¯
    const jwtUserSecret = await cryptoFactory
      .generateJWTSecret(32)
      .catch((e) => {
        throw new Error(e)
      })

    // todo: map these jobs to permissions.
    const { loc_zip, LOCATION, STATE, FIRST, LAST, Salary, JOB } = emp

    const numString = getNumString()
    // const randomPhoneNumber = getRandomPhoneNumberString(numString)

    const email = `${FIRST}${LAST}${numString.slice(1, 3)}@hds.homes`
    const address = addressGen.next().value as string

    console.log(numString, /**randomPhoneNumber,*/ email, address)

    const locationIdToConnect =
      locations.find((curr) => curr.state === STATE)?.idStoreLocations ||
      locations[0].idStoreLocations
    console.log(locationIdToConnect)

    employeesCreateInput.push(
      prisma.employee.create({
        data: {
          positionName: JOB as PrismaClient.EmployeePositionName,
          /** TODO: only the president gets to do any work? What kind of company is this? */
          roleCapability:
            JOB === 'PRESIDENT_CEO'
              ? ('READ_WRITE' as PrismaClient.EmployeeRoleCapability)
              : ('NONE' as PrismaClient.EmployeeRoleCapability),
          salary: Number(Number(Salary.replace(/,/g, '')).toFixed(2)),
          zipCode: loc_zip,
          city: LOCATION,
          address,
          email, //replace any white space
          firstName: FIRST,
          lastName: LAST,
          state: STATE,
          userSigningSecret: jwtUserSecret,
          storeLocations: {
            connect: {
              idStoreLocations: locationIdToConnect,
            },
          },
          password: passwordHash,
        },
      })
    )
  }

  const emps = await Promise.all(employeesCreateInput).catch((e) => {
    throw new Error(e)
  })

  if (emps && Array.isArray(emps)) {
    console.log(`Emps created: ${emps.length}`)
  }

  for (const customer of customerData) {
    const {
      City,
      FirstName,
      LastName,
      MI,
      State,
      StreetAddress,
      ZipCode,
    } = customer
    customerCreateInput.push(
      prisma.customer.create({
        data: {
          address: StreetAddress,
          city: City,
          firstName: FirstName,
          middleInitial: MI,
          lastName: LastName,
          state: State,
          zipCode: ZipCode,
        },
      })
    )
  }

  const customers = await Promise.all(customerCreateInput).catch((e) => {
    throw new Error(e)
  })

  console.log(`customers created: ${customers.length}`)

  // lol what was i thinking?
  return {
    ok: true,
  }
}

main()
  .then((value) => {
    console.log(value)
  })
  .catch((e) => console.error(e))
  .finally(async () => {
    console.log('disconnecting')
    await prisma.disconnect()
  })
