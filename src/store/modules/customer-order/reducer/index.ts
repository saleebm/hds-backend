import produce from 'immer'
import {
  CustomerOrderActions,
  CustomerOrderActionTypes,
  ICustomerOrderState,
} from '@Store/modules/customer-order/types'

export const customerOrderState: ICustomerOrderState = {
  customerId: undefined,
  expectedDeliveryDate: undefined,
  orderTotal: 0,
  orderProducts: undefined,
  storeLocationId: undefined,
}

export const CustomerOrderReducer = (
  state: ICustomerOrderState = customerOrderState,
  action: CustomerOrderActions
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CustomerOrderActionTypes.SetCustomer:
      case CustomerOrderActionTypes.CreatedCustomer:
      case CustomerOrderActionTypes.UpdatedCustomer:
        draft.customerId = action.payload.customerId
        return
      case CustomerOrderActionTypes.SetDeliveryDate:
        draft.expectedDeliveryDate = action.payload.expectedDeliveryDate
        return
      case CustomerOrderActionTypes.SetOrderTotal:
        /*todo*/
        return
      case CustomerOrderActionTypes.SetStoreLocation:
        /*todo*/
        return
      case CustomerOrderActionTypes.AddOrderProduct:
        /*todo*/
        return
      case CustomerOrderActionTypes.RemoveOrderProduct:
        /*todo*/
        return
    }
  })
