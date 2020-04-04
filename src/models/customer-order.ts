import {
  CustomerOrderCreateInput,
  CustomerOrderProductsCreateManyWithoutCustomerOrderInput,
} from '@prisma/client'

export type CustomerOrderCreateInputBodyArgs = {
  customerOrderProducts: CustomerOrderProductsCreateManyWithoutCustomerOrderInput
  orderTotal: number | string
} & Omit<CustomerOrderCreateInput, 'invoice' | 'orderTotal'>
