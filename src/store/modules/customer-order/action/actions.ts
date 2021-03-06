import {
  CustomerCreateWithoutCustomerOrderInput,
  CustomerUpdateArgs,
} from '@prisma/client'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'

import {
  CustomerOrderActionTypes,
  CustomerResult,
  ISetCustomerAction,
} from '@Store/modules/customer-order/types'
import { ThunkExtraArgs } from '@Store/modules/types'
import {
  CreateCustomerArgs,
  CustomerCreatedResponse,
  CustomerUpdatedResponse,
  UpdateOneBody,
} from '@Types/customer'
import { setErrorAction } from '@Store/modules/global/action'
import mutator from '@Lib/server/mutator'
import { OrderProduct, OrderProductInStore } from '@Types/customer-order'

/**
 * first step of POS form is to select a customer, whether that is a new one, or an existing one
 * this redux action handles any update to the customer object during the transaction
 * also experimenting here with typescript ActionCreator
 **/
export const setCustomerAction: ActionCreator<ThunkAction<
  // aka the return type of this function
  // The type of the last action to be dispatched - will always be promise<T> for async actions
  Promise<ISetCustomerAction>,
  // the state to be mutated
  // The type for the data within the last action
  { customerId: number },
  // Extra args
  // The type of the parameter for the nested function
  ThunkExtraArgs,
  // the type of the return
  // The type of the last action to be dispatched
  ISetCustomerAction
>> = ({ customerId }: { customerId: number }) => async (dispatch) => {
  return dispatch({
    type: CustomerOrderActionTypes.SetCustomer,
    payload: { customerId },
  })
}

export const createCustomerAction = (
  customerCreateWithoutCustomerOrderInput: CustomerCreateWithoutCustomerOrderInput
): CustomerResult<Promise<any>> => async (dispatch) => {
  try {
    const customerCreated = await mutator<
      CustomerCreatedResponse,
      CreateCustomerArgs
    >('/api/v1/customers/create', {
      createCustomer: customerCreateWithoutCustomerOrderInput,
    })
    if (customerCreated) {
      return dispatch({
        type: CustomerOrderActionTypes.CreatedCustomer,
        payload: { customerId: customerCreated.customer.idCustomer },
      })
    } else {
      return dispatch(
        setErrorAction({
          error: String(customerCreated),
          reference: 'create customer failed',
        })
      )
    }
  } catch (e) {
    return dispatch(
      setErrorAction({
        error: e,
        reference: `create customer caught error: ${e.toString()}`,
      })
    )
  }
}

export const updateCustomerAction = (
  customerUpdateArgs: CustomerUpdateArgs
): CustomerResult<Promise<any>> => async (dispatch) => {
  try {
    const customerUpdatedResponse = await mutator<
      CustomerUpdatedResponse,
      UpdateOneBody
    >('/api/v1/customers/update-one', {
      updateCustomer: customerUpdateArgs,
    })
    if (customerUpdatedResponse) {
      return dispatch({
        type: CustomerOrderActionTypes.UpdatedCustomer,
        payload: { customerId: customerUpdatedResponse.customer.idCustomer },
      })
    } else {
      return dispatch(
        setErrorAction({
          error: String(customerUpdatedResponse),
          reference: 'Update customer failed',
        })
      )
    }
  } catch (e) {
    return dispatch(
      setErrorAction({
        error: e,
        reference: `Update customer caught error: ${e.toString()}`,
      })
    )
  }
}

export const setDeliveryAction = (deliveryDate: Date): CustomerResult<void> => (
  dispatch
) => {
  dispatch({
    type: CustomerOrderActionTypes.SetDeliveryDate,
    payload: { expectedDeliveryDate: deliveryDate },
  })
}

export const setStoreLocationAction = (
  storeLocationId: number
): CustomerResult<any> => (dispatch) => {
  dispatch({
    type: CustomerOrderActionTypes.SetStoreLocation,
    payload: { storeLocationId },
  })
}

export const updateOrderProductQuantityAction = ({
  quantity,
  productId,
}: {
  quantity: number
  productId: number
}): CustomerResult<void> => (dispatch) => {
  dispatch({
    type: CustomerOrderActionTypes.SetOrderProduct,
    payload: { quantity, productId },
  })
}

export const addProductOrderInCustomerSaleAction = ({
  product,
}: {
  product: OrderProduct
}): CustomerResult<void> => (dispatch) => {
  const { perUnitCost, ...others } = product
  dispatch({
    type: CustomerOrderActionTypes.AddOrderProduct,
    payload: {
      orderProduct: { perUnitCost: perUnitCost, ...others },
    },
  })
}

/**
 * @param idProduct
 */
export const removeProductOrderInCustomerSaleAction = (
  idProduct: number
): CustomerResult<void> => (dispatch) => {
  dispatch({
    type: CustomerOrderActionTypes.RemoveOrderProduct,
    payload: {
      productIdToRemove: idProduct,
    },
  })
}

export const setOrderTotalAction = (): CustomerResult<void> => (
  dispatch,
  getState
) => {
  const {
    customerOrderReducer: { orderProducts },
  } = getState() || {}

  if (orderProducts && 'values' in orderProducts) {
    const products: ReadonlyArray<OrderProductInStore> = Array.from(
      orderProducts.values()
    )

    let orderTotal = Array.isArray(products)
      ? products.reduce(
          (acc, product) =>
            acc + (product.quantity * product.unitCost + product.deliveryFee),
          0
        )
      : 0

    orderTotal += orderTotal * 0.065

    dispatch({
      type: CustomerOrderActionTypes.SetOrderTotal,
      payload: { orderTotal },
    })
  }
}

export const resetCustomerOrderAction = (): CustomerResult<any> => (
  dispatch
) => {
  dispatch({ type: CustomerOrderActionTypes.ResetCustomerOrder })
}
