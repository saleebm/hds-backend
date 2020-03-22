import { produce } from 'immer'

import { AuthActions, AuthActionTypes } from '../action'
import { IAuthState } from '../types'

export const authState: IAuthState = {
  currentUser: undefined,
  isAuthenticated: false,
  loadingAccount: true,
}

// todo as part of refresh token action
export const AuthReducer = (
  state: IAuthState = authState,
  action: AuthActions
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AuthActionTypes.CheckAuthStatusSuccess:
      case AuthActionTypes.LoginSuccess:
      case AuthActionTypes.RegisterSuccess:
        const { email, firstName, lastName, userId } = action.payload
        draft.currentUser = {
          email,
          firstName,
          lastName,
          userId,
        }
        draft.isAuthenticated = true
        // replace the current state...
        return draft
      case AuthActionTypes.Logout:
        draft.currentUser = undefined
        draft.isAuthenticated = false
        return draft
      case AuthActionTypes.LoadingAccount:
        draft.loadingAccount = action.payload
        return draft
      default:
        return state
    }
  })
