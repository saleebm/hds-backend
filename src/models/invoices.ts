import { ParsedUrlQuery } from 'querystring'
import {
  CustomerGetPayload,
  CustomerOrder,
  CustomerOrderProductsGetPayload,
  EmployeeGetPayload,
  InvoiceGetPayload,
  StoreLocationsGetPayload,
} from '@prisma/client'

export interface InvoiceParams extends ParsedUrlQuery {
  customerOrderId: string
}

// i need to stringify the dates
export interface InvoiceGetStaticPropsReturnType {
  customerOrder: string
}
export type InvoiceData = CustomerOrder & {
  storeLocations: StoreLocationsGetPayload<
    {
      storeLocations: boolean
      customerOrderProducts: boolean
      invoice: boolean
      employee: boolean
      customer: boolean
    }['storeLocations']
  >
  customerOrderProducts: Array<
    CustomerOrderProductsGetPayload<
      {
        storeLocations: boolean
        customerOrderProducts: boolean
        invoice: boolean
        employee: boolean
        customer: boolean
      }['customerOrderProducts']
    >
  >
  invoice: InvoiceGetPayload<
    {
      storeLocations: boolean
      customerOrderProducts: boolean
      invoice: boolean
      employee: boolean
      customer: boolean
    }['invoice']
  >
  employee: EmployeeGetPayload<
    {
      storeLocations: boolean
      customerOrderProducts: boolean
      invoice: boolean
      employee: boolean
      customer: boolean
    }['employee']
  >
  customer: CustomerGetPayload<
    {
      storeLocations: boolean
      customerOrderProducts: boolean
      invoice: boolean
      employee: boolean
      customer: boolean
    }['customer']
  >
}

// the return type of the static props
export type InvoiceStaticProps = {
  customerOrder: InvoiceData
}
export type InvoiceSingle = InvoiceGetPayload<{
  include: {
    storeLocations: boolean
    customerOrder: boolean
    employee: boolean
    customer: boolean
  }
}>
export type InvoicesServerSideProps = Array<InvoiceSingle>
