/**
 * Store for handling customer orders from front to back
 * will manage the process to create the customerOrder, compute the total, finalize it,
 * and then it will also allow for invoices to be created with a report for jobs to do, etc.
 */
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootStateType, ThunkExtraArgs } from '@Store/modules/types'
import { OrderProduct, OrderProductsInStore } from '@Types/customer-order'

export interface ICustomerOrderState {
  /**
   * customer id number
   */
  readonly customerId: number | undefined
  /**
   * Delivery date as Date object
   */
  readonly expectedDeliveryDate: Date | undefined
  /**
   * The total computed by the store from the products added with tax and delivery charge
   */
  readonly orderTotal: number
  /**
   * the array of OrderProducts (product id number, quantity desired number, perUnitCost float)
   */
  readonly orderProducts: OrderProductsInStore
  /**
   * Store location id number
   */
  readonly storeLocationId: number | undefined
}

export enum CustomerOrderActionTypes {
  SetCustomer = '@pos/SET_CUSTOMER',
  CreatedCustomer = '@pos/CREATED_CUSTOMER',
  UpdatedCustomer = '@pos/UPDATED_CUSTOMER',
  SetDeliveryDate = '@pos/SET_DELIVERY_DATE',
  SetOrderTotal = '@pos/SET_ORDER_TOTAL',
  AddOrderProduct = '@pos/ADD_ORDER_PRODUCT',
  SetOrderProduct = '@pos/SET_ORDER_PRODUCT', // i.e. To change the quantity
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
    | CustomerOrderActionTypes.SetOrderProduct
  > {
  type:
    | typeof CustomerOrderActionTypes.AddOrderProduct
    | typeof CustomerOrderActionTypes.SetOrderProduct
  payload: { orderProduct: OrderProduct }
}

export interface IRemoveOrderProductAction
  extends Action<CustomerOrderActionTypes.RemoveOrderProduct> {
  type: typeof CustomerOrderActionTypes.RemoveOrderProduct
  payload: { productIdToRemove: number }
}

export type CustomerResult<TResult> = ThunkAction<
  TResult,
  RootStateType,
  ThunkExtraArgs,
  CustomerOrderActions
>

export type CustomerOrderActions =
  | ISetCustomerAction
  | ISetDeliveryAction
  | ISetOrderTotalAction
  | ISetStoreLocationAction
  | IUpdateOrderProductAction
  | IRemoveOrderProductAction
