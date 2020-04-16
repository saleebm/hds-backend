import {
  CustomerOrderCreateInput,
  CustomerOrderProductsCreateManyWithoutCustomerOrderInput,
} from '@prisma/client'

export type CustomerOrderCreateInputBodyArgs = {
  customerOrderProducts: CustomerOrderProductsCreateManyWithoutCustomerOrderInput
  orderTotal: number | string
  storeLocationId: number
} & Omit<CustomerOrderCreateInput, 'invoice' | 'orderTotal' | 'storeLocations'>
