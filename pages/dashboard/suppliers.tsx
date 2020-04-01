import { GetServerSideProps } from 'next'
import { Suppliers } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { SuppliersTable } from '@Components/Entities/Suppliers'

export interface SuppliersProps {
  suppliers: ReadonlyArray<Suppliers> | string
}

function SuppliersPage({ suppliers }: SuppliersProps) {
  return (
    <DashboardView pageTitle={'Suppliers'}>
      <SuppliersTable suppliers={JSON.parse(suppliers.toString())} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<SuppliersProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const supplierData = await prismaClient.suppliers.findMany()

  return {
    props: {
      /** anything with dates needs to be stringified */
      suppliers: JSON.stringify(supplierData),
    },
  }
}
export default SuppliersPage
