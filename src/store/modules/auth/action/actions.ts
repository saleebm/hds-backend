import { Dispatch } from 'redux'
import { IAuthState, UserResult } from '../types'
import { authService } from '@Services'
import { setErrorAction } from '@Store/modules/global/action'
import { AuthActionTypes } from './types'
import { ThunkDispatch } from 'redux-thunk'
import { LoginRequestSuccess } from '@Pages/api/v1/account/login'

// todo
export const loginUserAction = ({
  loginSuccessResponse,
}: {
  loginSuccessResponse: LoginRequestSuccess
}): UserResult<Promise<void>> => async (dispatch, getState, { ctx }) => {
  // save tokens in cookie jar
  await authService
    .logIn({
      authToken: loginSuccessResponse.accessToken,
      refreshToken: loginSuccessResponse.refreshToken,
      ctx,
    })
    .catch((e) => console.warn(e))

  // store user in global auth state
  const { lastName, email, firstName, userId } = loginSuccessResponse.employee
  dispatch({
    type: AuthActionTypes.LoginSuccess,
    payload: { lastName, firstName, userId, email },
  })
}

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
