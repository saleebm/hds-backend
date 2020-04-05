import { DashboardView } from '@Components/Views/dashboard'
import { CustomerSaleForm } from '@Components/Forms'

function PointOfSale() {
  return (
    <DashboardView pageTitle={'Point of Sale'}>
      <CustomerSaleForm />
    </DashboardView>
  )
}

export default PointOfSale
