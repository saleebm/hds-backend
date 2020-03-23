import { ThunkAction } from 'redux-thunk'

import {
  AuthActions,
  checkAuthStatusAction,
  CurrentUserType,
  loginUserAction,
  logoutUserAction,
  registerUserAction,
} from './action'
import { ThunkExtraArgs } from '@Store/modules/types'

export type UserResult<TResult> = ThunkAction<
  TResult,
  IAuthState,
  ThunkExtraArgs,
  AuthActions
>

type ThunkActionDispatch<
  TActionCreator extends (
    ...args: any[]
  ) => ThunkAction<any, IAuthState, any, AuthActions>
> = (
  ...args: Parameters<TActionCreator>
) => ReturnType<ReturnType<TActionCreator>>

export interface IAuthState {
  readonly currentUser?: CurrentUserType
  readonly isAuthenticated: boolean
}

//todo use this with bindActionCreators, like in React-Redux example...
// but how can I use this in the store to check for truth??
// putting this in place of the actual type AuthActions in defining the root actions gives error,
// "type Action does not fit.."
export interface IAuthActionDispatchs {
  loginUserAction: ThunkActionDispatch<typeof loginUserAction>
  registerUserAction: ThunkActionDispatch<typeof registerUserAction>
  logoutUserAction: ThunkActionDispatch<typeof logoutUserAction>
  checkAuthStatusAction: ThunkActionDispatch<typeof checkAuthStatusAction>
}
