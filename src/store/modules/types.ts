import { IAuthState } from './auth/types'
import { IGlobalState } from './global/types'
import { AppPropsWithStore } from '@Types/_app'
import { ServerSideProps } from '@Types'
import { ICustomerOrderState } from '@Store/modules/customer-order/types'

export type ThunkExtraArgs = {
  ctx?: AppPropsWithStore | ServerSideProps
}

export type RootStateType = {
  authReducer: IAuthState
  globalReducer: IGlobalState
  customerOrderReducer: ICustomerOrderState
}
