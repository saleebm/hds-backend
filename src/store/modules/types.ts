import { IAuthState } from './auth/types'
import { IGlobalState } from './global/types'
import { AppPropsWithStore } from '@Types/_app'

export type ThunkExtraArgs = {
  ctx?: AppPropsWithStore
}

export type RootStateType = {
  authReducer: IAuthState
  globalReducer: IGlobalState
}
