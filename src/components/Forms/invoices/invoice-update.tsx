import { InvoiceStaticProps } from '@Types/invoices'
import { Container } from '@material-ui/core'
import { InvoiceDataView } from '@Components/Forms/invoices/invoice-data'

/**
 * Form handles updates to customer order, in which the invoice primarily determines suppositions
 * @param customerOrder
 * @constructor
 */
function InvoiceUpdate({ customerOrder }: InvoiceStaticProps) {
  return (
    <Container disableGutters maxWidth={false}>
      <InvoiceDataView invoiceData={customerOrder} />
    </Container>
  )
}

export default InvoiceUpdate
