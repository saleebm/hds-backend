import { ParsedUrlQuery } from 'querystring'
import {
  CustomerGetPayload,
  CustomerOrder,
  CustomerOrderProductsGetPayload,
  EmployeeGetPayload,
  InvoiceGetPayload,
  InvoiceLineItems,
  InvoiceLineItemsWhereInput,
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
    CustomerOrderProductsGetPayload<{
      include: {
        storeLocation: true
        product: true
      }
    }>
  >
  invoice: InvoiceGetPayload<{
    include: {
      invoiceLineItems: true
    }
  }>
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

export type InvoiceLineItemBodyReq = InvoiceLineItemsWhereInput

export interface InvoiceLineItemsMod extends InvoiceLineItems {}
export interface InvoiceLineItemsReturn {
  invoiceLineItems: InvoiceLineItemsMod[]
}

export interface InvoiceEditableFields {
  lineItemTotal: number
  dueDate: Date
}

export interface InvoiceLineItemCreateArgs extends InvoiceEditableFields {
  invoiceId: number
}

export interface InvoiceLineCreateBodyArgs {
  createLineItem: InvoiceLineItemCreateArgs
}
