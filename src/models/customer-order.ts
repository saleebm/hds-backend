import {
  CustomerOrderCreateInput,
  CustomerOrderProducts,
  CustomerOrderProductsCreateManyWithoutCustomerOrderInput,
} from '@prisma/client'

export type OrderProduct = Omit<
  CustomerOrderProducts,
  'customerOrderId' | 'idCustomerOrderProducts'
>

export type OrderProductsInStore = ReadonlyMap<
  number,
  { quantity: number; unitCost: number }
>

export type CustomerOrderCreateInputBodyArgs = {
  customerOrderProducts: CustomerOrderProductsCreateManyWithoutCustomerOrderInput
  orderTotal: number | string
  storeLocationId: number
} & Omit<CustomerOrderCreateInput, 'invoice' | 'orderTotal' | 'storeLocations'>
