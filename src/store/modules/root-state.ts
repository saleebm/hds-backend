import { RootStateType } from './types'
import { globalState } from './global/reducer'
import { authState } from './auth/reducer'

export const RootState: RootStateType = {
  globalReducer: globalState,
  authReducer: authState,
}
