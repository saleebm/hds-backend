import { Action } from 'redux'
import { Role } from '@prisma/client'

export enum AuthActionTypes {
  LoginSuccess = '@auth/USER_AUTHENTICATE_SUCCESS',
  Logout = '@auth/USER_LOGOUT',
  CheckAuthStatus = '@auth/CHECK_AUTH_STATUS',
  CheckAuthStatusSuccess = '@auth/CHECK_AUTH_STATUS_SUCCESS',
  RefreshToken = '@auth/REFRESH_TOKEN',
}

export type CurrentUserType = {
  /**
   * first name of user
   */
  readonly firstName: string
  /**
   * Last name of the user.
   */
  readonly lastName: string
  /**
   * Email of the user.
   */
  readonly email: string
  /**
   * The Id of the user.
   */
  readonly userId: number
  /**
   * the role
   */
  readonly role: Role
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
  | ILoginUserAction
  | ILogoutUserAction
  | ICheckAuthStatusAction
  | ICheckAuthStatusSuccessAction
  | IRefreshJWTAction
