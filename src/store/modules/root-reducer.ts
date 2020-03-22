import { combineReducers, Reducer } from 'redux'

import { GlobalReducer } from './global/reducer'
import { AuthReducer } from './auth/reducer'

export const rootReducer: Reducer = combineReducers({
  globalReducer: GlobalReducer,
  authReducer: AuthReducer,
})
