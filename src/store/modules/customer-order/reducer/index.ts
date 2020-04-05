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
        break
      case CustomerOrderActionTypes.SetDeliveryDate:
        break
      case CustomerOrderActionTypes.SetOrderTotal:
        break
      case CustomerOrderActionTypes.SetStoreLocation:
        break
      case CustomerOrderActionTypes.AddOrderProduct:
        break
      case CustomerOrderActionTypes.RemoveOrderProduct:
        break
    }
  })
