import { DashboardView } from '@Components/Views/dashboard'
import { GetServerSideProps } from 'next'

function Invoices() {
  return (
    <DashboardView pageTitle={'Invoices'}>
      <p>
        todo: Invoices - this will be the single param customerOrderId page that
        curates the customer's invoice.
      </p>
    </DashboardView>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx
  if (params && 'customerOrderId' in params) {
    console.log(params)
  }
  return {
    props: {},
  }
}

export default Invoices
