import { GetServerSideProps } from 'next'
import { StoreLocations } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { LocationsTable } from '@Components/Entities/Locations'

export interface StoreLocationsProps {
  locations: ReadonlyArray<StoreLocations>
}

function LocationsPage({ locations }: StoreLocationsProps) {
  return (
    <DashboardView pageTitle={'Locations'}>
      <LocationsTable locations={locations} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<StoreLocationsProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const locationsData = await prismaClient.storeLocations.findMany()

  return {
    props: {
      locations: locationsData,
    },
  }
}
export default LocationsPage
