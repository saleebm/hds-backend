import { Dispatch } from 'redux'
import { IAuthState, UserResult } from '../types'
import { authService } from '@Services'
import { setErrorAction } from '@Store/modules/global/action'
import { AuthActionTypes } from './types'
import { ThunkDispatch } from 'redux-thunk'

// todo
export const loginUserAction = (): UserResult<Promise<void>> => async (
  dispatch,
  getState,
  { ctx }
) => {}

// todo
export const registerUserAction = (): UserResult<Promise<void>> => async (
  dispatch,
  getState,
  { ctx }
) => {}

export const logoutUserAction = () => async (
  dispatch: ThunkDispatch<IAuthState, any, any>
) => {
  await authService.logOut()
  dispatch({ type: AuthActionTypes.Logout })
}

export const setAccountLoadingOff = () => (dispatch: Dispatch) => {
  dispatch({
    type: AuthActionTypes.LoadingAccount,
    payload: false,
  })
}

// todo
export const refreshJWTAction = (): UserResult<Promise<void>> => async (
  dispatch,
  getState,
  { ctx }
) => {}

const loadingAccountFinished = () => async (dispatch: Dispatch) => {
  return dispatch({
    type: AuthActionTypes.LoadingAccount,
    payload: false,
  })
}

async function errorResolver(dispatch: any, e: any) {
  dispatch(
    setErrorAction({
      error: e,
      reference: 'check auth status action',
    })
    // log out because we check tokens exist before running this action, so remove tokens
  )
  await Promise.all([
    dispatch(loadingAccountFinished()),
    dispatch(logoutUserAction()),
  ])
}

// todo
export const checkAuthStatusAction = (): UserResult<Promise<void>> => async (
  dispatch,
  getState,
  { ctx }
) => {
  try {
  } catch (e) {
    await errorResolver(dispatch, e)
  }
}
