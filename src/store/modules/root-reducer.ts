import { combineReducers, Reducer } from 'redux'

import { GlobalReducer } from './global/reducer'
import { AuthReducer } from './auth/reducer'
import { CustomerOrderReducer } from '@Store/modules/customer-order/reducer'

export const rootReducer: Reducer = combineReducers({
  globalReducer: GlobalReducer,
  authReducer: AuthReducer,
  customerOrderReducer: CustomerOrderReducer,
})
