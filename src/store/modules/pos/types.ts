/**
 * Store for handling customer orders from front to back
 * will manage the process to create the customerOrder, compute the total, finalize it,
 * and then it will also allow for invoices to be created with a report for jobs to do, etc.
 */
import { CustomerOrderProducts } from '@prisma/client'

export type OrderProducts = Omit<
  CustomerOrderProducts,
  'customerOrderId' | 'idCustomerOrderProducts'
>

export interface ICustomerOrderState {
  /**
   * customer id number
   */
  readonly customerId: number
  /**
   * Delivery date as Date object
   */
  readonly expectedDeliveryDate: Date
  /**
   * The total computed by the store from the products added
   */
  readonly orderTotal: number
  /**
   * the array of OrderProducts (product id number, quantity desired number, perUnitCost float)
   */
  readonly orderProducts: ReadonlyArray<OrderProducts>
  /**
   * Store location id number
   */
  readonly storeLocationId: number
}
