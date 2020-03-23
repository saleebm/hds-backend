import { IAuthState } from './auth/types'
import { IGlobalState } from './global/types'
import { AppPropsWithStore } from '@Types/_app'
import { ServerSideProps } from '@Types'

export type ThunkExtraArgs = {
  ctx?: AppPropsWithStore | ServerSideProps
}

export type RootStateType = {
  authReducer: IAuthState
  globalReducer: IGlobalState
}
