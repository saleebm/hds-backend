import { GetServerSideProps } from 'next'
import { InventoryGetPayload, StoreLocations } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { InventoriesTable } from '@Components/Entities/Inventories'

export type Inventory = InventoryGetPayload<{
  include: { storeLocations: boolean; productOfInventory: boolean }
}>

export type Inventories = ReadonlyArray<Inventory>

export interface InventoriesData {
  readonly locations: ReadonlyArray<StoreLocations>
  readonly inventories: Inventories
}

export interface InventoriesServerProps {
  readonly locations: ReadonlyArray<StoreLocations>
  readonly inventories: string
}

function InventoryPage({ inventories, locations }: InventoriesServerProps) {
  const unparsedInventories = JSON.parse(inventories)

  return (
    <DashboardView pageTitle={'Inventories'}>
      <InventoriesTable
        locations={locations}
        inventories={unparsedInventories}
      />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<InventoriesServerProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const inventoryData = await prismaClient.inventory.findMany({
    include: { storeLocations: true, productOfInventory: true },
  })
  const locations = await prismaClient.storeLocations.findMany()

  return {
    props: {
      inventories: JSON.stringify(inventoryData),
      locations,
    },
  }
}
export default InventoryPage
