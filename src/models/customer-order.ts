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

// the info the customer will want to know
// how much how many what
export type CustomerOrderProductInCart = {
  name: string
  category: string
  id: number
  quantity: number
  price: number
  storeLocationId: number
}

export type CustomerOrderProductsPOS = Array<CustomerOrderProductInCart>

export type CustomerOrderProductKeys = keyof CustomerOrderProductInCart
