/**
 * Store for handling customer orders from front to back
 * will manage the process to create the customerOrder, compute the total, finalize it,
 * and then it will also allow for invoices to be created with a report for jobs to do, etc.
 */
import { CustomerOrderProducts } from '@prisma/client'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { ThunkExtraArgs } from '@Store/modules/types'

export type OrderProducts = Omit<
  CustomerOrderProducts,
  'customerOrderId' | 'idCustomerOrderProducts'
>

export type OrderProductsStore = ReadonlyArray<OrderProducts>

export interface ICustomerOrderState {
  /**
   * customer id number
   */
  readonly customerId: number | undefined
  /**
   * Delivery date as Date object
   */
  readonly expectedDeliveryDate: Date| undefined
  /**
   * The total computed by the store from the products added
   */
  readonly orderTotal: number
  /**
   * the array of OrderProducts (product id number, quantity desired number, perUnitCost float)
   */
  readonly orderProducts: OrderProductsStore| undefined
  /**
   * Store location id number
   */
  readonly storeLocationId: number| undefined
}

export enum CustomerOrderActionTypes {
  SetCustomer = '@pos/SET_CUSTOMER',
  CreatedCustomer = '@pos/CREATED_CUSTOMER',
  UpdatedCustomer = '@pos/UPDATED_CUSTOMER',
  SetDeliveryDate = '@pos/SET_DELIVERY_DATE',
  SetOrderTotal = '@pos/SET_ORDER_TOTAL',
  AddOrderProduct = '@pos/ADD_ORDER_PRODUCT',
  RemoveOrderProduct = '@pos/REMOVE_ORDER_PRODUCT',
  SetStoreLocation = '@pos/SET_STORE_LOCATION',
}

export interface ISetCustomerAction
  extends Action<
    | CustomerOrderActionTypes.SetCustomer
    | CustomerOrderActionTypes.CreatedCustomer
    | CustomerOrderActionTypes.UpdatedCustomer
  > {
  type:
    | typeof CustomerOrderActionTypes.SetCustomer
    | CustomerOrderActionTypes.CreatedCustomer
    | CustomerOrderActionTypes.UpdatedCustomer
  payload: { customerId: number }
}

export interface ISetDeliveryAction
  extends Action<CustomerOrderActionTypes.SetDeliveryDate> {
  type: typeof CustomerOrderActionTypes.SetDeliveryDate
  payload: { expectedDeliveryDate: Date }
}

export interface ISetOrderTotalAction
  extends Action<CustomerOrderActionTypes.SetOrderTotal> {
  type: typeof CustomerOrderActionTypes.SetOrderTotal
  payload: { orderTotal: number }
}

export interface ISetStoreLocationAction
  extends Action<CustomerOrderActionTypes.SetStoreLocation> {
  type: typeof CustomerOrderActionTypes.SetStoreLocation
  payload: { storeLocationId: number }
}

export interface IUpdateOrderProductAction
  extends Action<
    | CustomerOrderActionTypes.AddOrderProduct
    | CustomerOrderActionTypes.RemoveOrderProduct
  > {
  type:
    | typeof CustomerOrderActionTypes.AddOrderProduct
    | CustomerOrderActionTypes.RemoveOrderProduct
  payload: { orderProducts: OrderProductsStore }
}

export type CustomerResult<TResult> = ThunkAction<
  TResult,
  ICustomerOrderState,
  ThunkExtraArgs,
  CustomerOrderActions
>

export type CustomerOrderActions =
  | ISetCustomerAction
  | ISetDeliveryAction
  | ISetOrderTotalAction
  | ISetStoreLocationAction
  | IUpdateOrderProductAction
