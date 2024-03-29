import Router from 'next/router'
import { ThunkDispatch } from 'redux-thunk'

import { IAuthState, UserResult } from '../types'
import { authService } from '@Services'
import { setErrorAction } from '@Store/modules/global/action'
import { AuthActionTypes } from './types'
import { LoginRequestSuccess } from '@Pages/api/v1/account/login'
import { Viewer } from '@Pages/api/v1/account/viewer'
import { Refresh } from '@Pages/api/v1/account/refresh'
import { getAxiosInstance } from '@Lib/axios-instance'

export const loginUserAction = ({
  loginSuccessResponse,
}: {
  loginSuccessResponse: LoginRequestSuccess
}): UserResult<Promise<void>> => async (dispatch, getState, { ctx }) => {
  // store user in global auth state
  const {
    lastName,
    email,
    firstName,
    employeeId: userId,
    roleCapability,
  } = loginSuccessResponse
  // put user in store
  dispatch({
    type: AuthActionTypes.LoginSuccess,
    payload: {
      lastName,
      firstName,
      userId,
      email,
      role: roleCapability,
    },
  })
  // save tokens in cookie jar
  await authService
    .logIn({
      authToken: loginSuccessResponse.accessToken,
      refreshToken: loginSuccessResponse.refreshToken,
      ctx,
    })
    // catch errors
    .catch((e) => console.warn(e))
  await Router.replace('/dashboard')
}

export const logoutUserAction = () => async (
  dispatch: ThunkDispatch<IAuthState, any, any>
) => {
  dispatch({ type: AuthActionTypes.Logout })
  await authService.logOut()
  // put user in place
  // replace does not leave url history
  await Router.replace('/')
}

export const refreshJWTAction = (): UserResult<Promise<void>> => async (
  dispatch,
  getState,
  { ctx }
) => {
  const refreshToken = authService.getRefreshToken(ctx)
  const accessToken = authService.getAccessToken(ctx)
  if (refreshToken) {
    try {
      const refreshTokenPayload = await getAxiosInstance().post<Refresh>(
        'account/refresh',
        {
          refreshToken: refreshToken,
        },
        {
          headers: {
            authentication: `Bearer ${accessToken}`,
          },
        }
      )
      if (refreshTokenPayload.data && refreshTokenPayload.data.accessToken) {
        const { accessToken } = refreshTokenPayload.data
        // console.log(accessToken)
        dispatch({ type: AuthActionTypes.RefreshToken })
        // do not pass context since we want to set it on the client only
        authService.setAccessToken(accessToken)
      }
    } catch (e) {
      console.warn('failed to refresh jwt', e)
    }
  }
}

// removes user from store and clears cookies
async function errorResolver(dispatch: any, e: any) {
  dispatch(
    setErrorAction({
      error: e,
      reference: 'check auth status action',
    })
    // log out because we check tokens exist before running this action, so remove tokens
  )
  dispatch(logoutUserAction())
}

// store viewer in store
// check auth by making api call
export const checkAuthStatusAction = (): UserResult<Promise<any>> => async (
  dispatch,
  getState,
  { ctx }
) => {
  const authToken = authService.getAccessToken(ctx)
  if (!!authToken) {
    try {
      // dynamic import saves client data if server
      const authCodeResponse = await getAxiosInstance().post<Viewer>(
        'account/viewer',
        undefined,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      )
      if (authCodeResponse.data && authCodeResponse.data.userId) {
        const {
          lastName,
          firstName,
          email,
          userId,
          roleCapability,
        } = authCodeResponse.data
        return dispatch({
          type: AuthActionTypes.CheckAuthStatusSuccess,
          payload: {
            lastName,
            firstName,
            email,
            userId,
            role: roleCapability,
          },
        })
      } else {
        return await errorResolver(dispatch, authCodeResponse)
      }
    } catch (e) {
      await errorResolver(dispatch, e)
    }
  }
}
