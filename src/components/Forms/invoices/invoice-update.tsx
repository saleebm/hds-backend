import {
  InvoiceLineItemBodyReq,
  InvoiceLineItemsReturn,
  InvoiceStaticProps,
} from '@Types/invoices'
import { Container, Grid } from '@material-ui/core'
import { InvoiceDataView } from '@Components/Forms/invoices/invoice-data'
import { UpdateBillForm } from '@Components/Forms/invoices/update-bill'
import { useSnackbarContext } from '@Utils/context'
import { useEffect, useMemo } from 'react'
import mutator from '@Lib/server/mutator'
import useSWR from 'swr'

/**
 * Form handles updates to customer order, in which the invoice primarily determines suppositions
 * @param customerOrder
 * @constructor
 */
function InvoiceUpdate({ customerOrder }: InvoiceStaticProps) {
  const initialData = {
    invoiceLineItems: customerOrder.invoice.invoiceLineItems,
  }
  const operationArgs: InvoiceLineItemBodyReq = useMemo(
    () => ({
      invoiceId: customerOrder.invoice.idInvoice,
    }),
    [customerOrder.invoice.idInvoice]
  )
  const { data, revalidate, isValidating, error } = useSWR<
    InvoiceLineItemsReturn
  >(
    ['/api/v1/invoice-line-items', operationArgs],
    async () =>
      await mutator<InvoiceLineItemsReturn, InvoiceLineItemBodyReq>(
        '/api/v1/invoice-line-items',
        operationArgs
      ),
    {
      initialData:
        (initialData &&
          initialData.invoiceLineItems && {
            invoiceLineItems: initialData.invoiceLineItems,
          }) ||
        undefined,
    }
  )

  const { toggleSnackbar } = useSnackbarContext()

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])
  return (
    <Container disableGutters maxWidth={false}>
      <Grid
        container
        direction={'column'}
        spacing={4}
        alignItems={'center'}
        justify={'space-between'}
      >
        <Grid item xs={12}>
          <UpdateBillForm
            revalidate={revalidate}
            invoiceId={customerOrder.invoice.idInvoice}
          />
        </Grid>
        <Grid item xs={12}>
          <InvoiceDataView
            invoiceData={customerOrder}
            invoiceLineItems={data?.invoiceLineItems}
            isValidating={isValidating}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default InvoiceUpdate
