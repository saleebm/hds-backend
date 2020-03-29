import { DashboardView } from '@Components/Views/dashboard'
import { GetServerSideProps } from 'next'
import { Customer } from '@prisma/client'
import { CustomersTable } from '@Components/Entities/Customers'

export interface Customers {
  customers: ReadonlyArray<Customer> | string
}
function CustomersPage({ customers }: Customers) {
  return (
    <DashboardView pageTitle={'Customers'}>
      <CustomersTable customers={JSON.parse(customers.toString())} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<Customers> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const customerData = await prismaClient.customer.findMany()
  return {
    props: {
      customers: JSON.stringify(customerData),
    },
  }
}

export default CustomersPage
