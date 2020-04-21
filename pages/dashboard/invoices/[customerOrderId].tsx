import { GetServerSideProps } from 'next'

import { DashboardView } from '@Components/Views/dashboard'
import {
  InvoiceData,
  InvoiceGetStaticPropsReturnType,
  InvoiceParams,
} from '@Types/invoices'
import { InvoiceUpdateForm } from '@Components/Forms/invoices'
import { Typography } from '@material-ui/core'

/**
 * Technically, the customer order contains all the data needed, including the invoice.
 *
 * @param customerOrder InvoiceStaticProps
 */
function Invoices({ customerOrder }: InvoiceGetStaticPropsReturnType) {
  const invoiceData: InvoiceData = JSON.parse(customerOrder)
  return (
    <DashboardView pageTitle={'Invoice'}>
      {!!invoiceData ? (
        <InvoiceUpdateForm customerOrder={invoiceData} />
      ) : (
        <Typography variant={'h2'}>Nothing found</Typography>
      )}
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
    if (isNaN(customerOrderId)) return { props: { customerOrder: '' } }

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const customerOrder = await prisma.customerOrder.findOne({
      where: { idCustomerOrder: customerOrderId },
      include: {
        invoice: true,
        customer: true,
        storeLocations: true,
        customerOrderProducts: { include: { storeLocation: true } },
        employee: true,
      },
    })

    if (!customerOrder) return { props: { customerOrder: '' } }

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
