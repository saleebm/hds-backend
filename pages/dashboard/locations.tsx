import { GetServerSideProps } from 'next'
import { Location } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { LocationsTable } from '@Components/Entities/Locations'

export interface Locations {
  locations: ReadonlyArray<Location>
}

function LocationsPage({ locations }: Locations) {
  return (
    <DashboardView pageTitle={'Locations'}>
      <LocationsTable locations={locations} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<Locations> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const locationsData = await prismaClient.location.findMany()

  return {
    props: {
      locations: locationsData,
    },
  }
}
export default LocationsPage
