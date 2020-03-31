import { GetServerSideProps } from 'next'
import { InventoryGetPayload, Location } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { InventoriesTable } from '@Components/Entities/Inventories'

export type Inventory = InventoryGetPayload<{
  include: { locationId: boolean }
}>

export type Inventories = ReadonlyArray<Inventory>

export interface InventoriesData {
  readonly locations: ReadonlyArray<Location>
  readonly inventories: Inventories
}

function InventoryPage({ inventories, locations }: InventoriesData) {
  return (
    <DashboardView pageTitle={'Inventories'}>
      <InventoriesTable locations={locations} inventories={inventories} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<InventoriesData> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const inventoryData = await prismaClient.inventory.findMany({
    include: { locationId: true },
  })
  const locations = await prismaClient.location.findMany()

  return {
    props: {
      inventories: inventoryData,
      locations,
    },
  }
}
export default InventoryPage
