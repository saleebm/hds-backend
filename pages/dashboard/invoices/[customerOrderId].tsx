import { GetServerSideProps } from 'next'

import { DashboardView } from '@Components/Views/dashboard'
import { InvoiceGetStaticPropsReturnType, InvoiceParams } from '@Types/invoices'

function Invoices({ customerOrder }: InvoiceGetStaticPropsReturnType) {
  return (
    <DashboardView pageTitle={'Invoice'}>
      <p>{!!customerOrder ? customerOrder : 'Nothing here'}</p>
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<
  InvoiceGetStaticPropsReturnType,
  InvoiceParams
> = async ({ params }) => {
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
  } else {
    return {
      props: {
        customerOrder: '',
      },
    }
  }
}

export default Invoices
