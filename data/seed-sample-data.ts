import * as PrismaClient from '@prisma/client'
import applianceData from './json/appliances.json'
import { exit } from 'process'

const prisma = new PrismaClient.PrismaClient()

async function main() {
  const currentInventory = await prisma.inventory.findMany()
  let currentInventoryID = undefined
  if (currentInventory && currentInventory[0])
    currentInventoryID = currentInventory[0].id

  if (!currentInventoryID) throw new Error('Inventory must be created first.')

  for (const appliance of applianceData) {
    const { Brand, Cost, Description, ListPrice, Model, Serial } = appliance
    const res = await prisma.product.create({
      data: {
        brand: Brand,
        listPrice: `${ListPrice}`,
        productCategory: 'Appliances',
        modelNumber: Model,
        unitCost: `${Cost}`,
        inventory: {
          connect: { id: currentInventoryID },
        },
        description: Description,
        serialNumber: `${Serial}`,
      },
    })
    console.log(res.id)
  }
}

try {
  main().catch((e) => console.error(e))
} catch (e) {
  console.error(e)
}
