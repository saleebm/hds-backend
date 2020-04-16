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
  orderProducts: new Map(),
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
        draft.orderTotal = action.payload.orderTotal
        return
      case CustomerOrderActionTypes.SetStoreLocation:
        draft.storeLocationId = action.payload.storeLocationId
        return
      case CustomerOrderActionTypes.SetOrderProduct:
      case CustomerOrderActionTypes.AddOrderProduct:
        const { productId, perUnitCost, quantity } = action.payload.orderProduct
        draft.orderProducts.set(productId, {
          quantity,
          unitCost: perUnitCost,
        })
        return
      case CustomerOrderActionTypes.RemoveOrderProduct:
        const { productIdToRemove } = action.payload
        if (draft.orderProducts.has(productIdToRemove)) {
          draft.orderProducts.delete(productIdToRemove)
        }
        return
    }
  })
