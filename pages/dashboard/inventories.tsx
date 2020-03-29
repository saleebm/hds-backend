import { GetServerSideProps } from 'next'
import { InventoryGetPayload, Location } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { InventoriesTable } from '@Components/Entities/Inventories'

export type Inventories = ReadonlyArray<
  InventoryGetPayload<{ include: { locationId: boolean } }>
>

export interface InventoriesData {
  readonly locations: ReadonlyArray<Location>
  inventories: Inventories
}

function InventoryPage({ inventories, locations }: InventoriesData) {
  return (
    <DashboardView pageTitle={'Suppliers'}>
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
