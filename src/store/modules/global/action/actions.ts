import { Dispatch } from 'redux'

import { IErrorResult } from '../types'
import { GlobalActionTypes } from './types'

export const setErrorAction = (error: IErrorResult) => {
  return (dispatch: Dispatch) =>
    dispatch({
      error,
      type: GlobalActionTypes.SetError,
    })
}

export const clearErrorsAction = () => {
  return (dispatch: Dispatch) =>
    dispatch({
      type: GlobalActionTypes.ClearErrors,
    })
}
