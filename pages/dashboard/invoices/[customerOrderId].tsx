import { GetStaticPaths, GetStaticProps } from 'next'

import { DashboardView } from '@Components/Views/dashboard'
import { InvoiceGetStaticPropsReturnType, InvoiceParams } from '@Types/invoices'

function Invoices({ customerOrder }: InvoiceGetStaticPropsReturnType) {
  return (
    <DashboardView pageTitle={'Invoice'}>
      <p>{customerOrder ? customerOrder : 'Nothing here'}</p>
    </DashboardView>
  )
}

// docs: https://nextjs.org/docs/basic-features/data-fetching#simple-example
export const getStaticPaths: GetStaticPaths<InvoiceParams> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  // get all customer orders, but only select the customer order id
  const customerOrders = await prisma.customerOrder.findMany({
    select: { idCustomerOrder: true },
  })

  const paths = customerOrders.map((order) => ({
    params: { customerOrderId: `${order.idCustomerOrder}` },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  InvoiceGetStaticPropsReturnType,
  InvoiceParams
> = async ({ params }) => {
  // type guarding
  if (params && 'customerOrderId' in params) {
    const customerOrderId = parseInt(params.customerOrderId)
    // stop if not a number
    if (isNaN(customerOrderId)) throw new Error('Nope')

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const customerOrder = await prisma.customerOrder.findOne({
      where: { idCustomerOrder: customerOrderId },
      include: { invoice: true, customer: true, storeLocations: true },
    })

    if (!customerOrder) throw new Error('No customer order found')

    return {
      props: {
        // have to stringify the dates so to remove cyclic data
        customerOrder: JSON.stringify(customerOrder),
      },
    }
  }
  throw new Error('Oooooops')
}

export default Invoices
