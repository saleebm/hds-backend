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
      case CustomerOrderActionTypes.ResetCustomerOrder:
        draft.orderProducts = new Map([])
        draft.customerId = undefined
        draft.expectedDeliveryDate = undefined
        draft.orderTotal = 0
        return
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
        //  only allowing for quantity updates for simplicity's sake
        const { quantity, productId: idToUpdate } = action.payload
        const previousProduct = draft.orderProducts.get(idToUpdate)
        if (previousProduct)
          draft.orderProducts.set(idToUpdate, { ...previousProduct, quantity })
        return
      case CustomerOrderActionTypes.AddOrderProduct:
        const {
          productId,
          perUnitCost,
          ...others
        } = action.payload.orderProduct
        //todo
        // eliminate this possibility with unit testing and a cup of coffee
        // the initial map can be lost perhaps
        if (
          'set' in draft.orderProducts &&
          typeof draft.orderProducts.set === 'function'
        ) {
          // the Map is intact from server
          console.log('reusing map')
          draft.orderProducts.set(productId, {
            unitCost: perUnitCost,
            ...others,
          })
        } else {
          // the map must be initialized again
          console.log('initializing map')
          draft.orderProducts = new Map()
          draft.orderProducts.set(productId, {
            unitCost: perUnitCost,
            ...others,
          })
        }
        return
      case CustomerOrderActionTypes.RemoveOrderProduct:
        const { productIdToRemove } = action.payload
        if (draft.orderProducts.has(productIdToRemove)) {
          draft.orderProducts.delete(productIdToRemove)
        }
        return
    }
  })
