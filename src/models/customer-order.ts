import {
  CustomerOrderCreateInput,
  CustomerOrderProducts,
  CustomerOrderProductsCreateManyWithoutCustomerOrderInput,
} from '@prisma/client'

/**
 * slightly modified type to match database description
 */
export type OrderProduct = Omit<
  CustomerOrderProducts,
  'customerOrderId' | 'idCustomerOrderProducts'
> & {
  name: string
  storeLocationId: number
  category: string
  deliveryFee: number
}

export type OrderProductInStore = {
  quantity: number
  unitCost: number
  deliveryFee: number
  name: string
  storeLocationId: number
  category: string
}

// the type for the stored OrderProduct
export type OrderProductsInStore = ReadonlyMap<number, OrderProductInStore>

/**
 * this is the expected body arg for the endpoint
 * @see /pages/api/v1/customer-orders/create.ts
 */
export type CustomerOrderCreateInputBodyArgs = {
  customerOrderProducts: CustomerOrderProductsCreateManyWithoutCustomerOrderInput
  orderTotal: number | string
  storeLocationId: number
} & Omit<CustomerOrderCreateInput, 'invoice' | 'orderTotal' | 'storeLocations'>

// the info the customer will want to know
// how much how many what
// also delivery price
export type CustomerOrderProductInCart = {
  name: string
  category: string
  id: number
  quantity: number
  price: number
  deliveryFee: number
  storeLocationId: number
}

export type CustomerOrderProductsPOS = Array<CustomerOrderProductInCart>

export type CustomerOrderProductKeys = keyof CustomerOrderProductInCart
