import { CustomerLookupForm } from '@Components/Forms/sales/customer-lookup'

export function CustomerSaleForm() {
  // initially show a customer lookup autocomplete input, but switch to create customer if employee has to create one (ie not found in lookup)

  return (
    <>
      <CustomerLookupForm />
    </>
  )
}
