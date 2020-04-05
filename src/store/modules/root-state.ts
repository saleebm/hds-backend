import { RootStateType } from './types'
import { globalState } from './global/reducer'
import { authState } from './auth/reducer'
import { customerOrderState } from '@Store/modules/customer-order/reducer'

export const RootState: RootStateType = {
  globalReducer: globalState,
  authReducer: authState,
  customerOrderReducer: customerOrderState,
}
