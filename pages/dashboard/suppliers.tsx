import { GetStaticProps } from 'next'
import { Supplier } from '@prisma/client'

import { DashboardView } from '@Components/Views/dashboard'
import { SuppliersTable } from '@Components/Entities/Suppliers'

export interface Suppliers {
  suppliers: ReadonlyArray<Supplier> | string
}

function SuppliersPage({ suppliers }: Suppliers) {
  return (
    <DashboardView pageTitle={'Suppliers'}>
      <SuppliersTable suppliers={JSON.parse(suppliers.toString())} />
    </DashboardView>
  )
}

export const getStaticProps: GetStaticProps<Suppliers> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const supplierData = await prismaClient.supplier.findMany()

  return {
    props: {
      suppliers: JSON.stringify(supplierData),
    },
  }
}
export default SuppliersPage
