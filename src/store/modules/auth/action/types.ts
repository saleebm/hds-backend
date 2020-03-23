import { Action } from 'redux'

export enum AuthActionTypes {
  LoginSuccess = '@auth/USER_AUTHENTICATE_SUCCESS',
  RegisterSuccess = '@auth/USER_REGISTER_SUCCESS',
  Logout = '@auth/USER_LOGOUT',
  CheckAuthStatus = '@auth/CHECK_AUTH_STATUS',
  CheckAuthStatusSuccess = '@auth/CHECK_AUTH_STATUS_SUCCESS',
  RefreshToken = '@auth/REFRESH_TOKEN',
}

export type CurrentUserType = {
  readonly firstName: string
  /**
   * Last name of the user. This is equivalent to the WP_User-&gt;user_last_name property.
   */
  readonly lastName: string
  /**
   * Email of the user. This is equivalent to the WP_User-&gt;user_email property.
   */
  readonly email: string
  /**
   * The Id of the user. Equivalent to WP_User-&gt;ID
   */
  readonly userId: number
}

export interface IRegisterUserAction
  extends Action<AuthActionTypes.RegisterSuccess> {
  type: typeof AuthActionTypes.RegisterSuccess
  payload: CurrentUserType
}

export interface ILoginUserAction extends Action<AuthActionTypes.LoginSuccess> {
  type: typeof AuthActionTypes.LoginSuccess
  payload: CurrentUserType
}

export interface ILogoutUserAction extends Action<AuthActionTypes.Logout> {
  type: typeof AuthActionTypes.Logout
}

export interface ICheckAuthStatusAction
  extends Action<AuthActionTypes.CheckAuthStatus> {
  type: typeof AuthActionTypes.CheckAuthStatus
}

export interface ICheckAuthStatusSuccessAction
  extends Action<AuthActionTypes.CheckAuthStatusSuccess> {
  type: typeof AuthActionTypes.CheckAuthStatusSuccess
  payload: CurrentUserType
}

export interface IRefreshJWTAction
  extends Action<AuthActionTypes.RefreshToken> {
  type: typeof AuthActionTypes.RefreshToken
}

export type AuthActions =
  | IRegisterUserAction
  | ILoginUserAction
  | ILogoutUserAction
  | ICheckAuthStatusAction
  | ICheckAuthStatusSuccessAction
  | IRefreshJWTAction
