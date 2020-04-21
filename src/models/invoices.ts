import { ParsedUrlQuery } from 'querystring'
import {
  CustomerGetPayload,
  CustomerOrder,
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

// the return type of the static props
export type InvoiceStaticProps = {
  customerOrder: CustomerOrder & {
    storeLocations: StoreLocationsGetPayload<
      {
        storeLocations: boolean
        invoice: boolean
        customer: boolean
      }['storeLocations']
    >
    invoice: InvoiceGetPayload<
      {
        storeLocations: boolean
        invoice: boolean
        customer: boolean
      }['invoice']
    >
    customer: CustomerGetPayload<
      {
        storeLocations: boolean
        invoice: boolean
        customer: boolean
      }['customer']
    >
  }
}
