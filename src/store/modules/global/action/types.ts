import { Action } from 'redux'

import { IErrorResult } from '../types'

export enum GlobalActionTypes {
  SetError = '@global/SET_ERROR',
  ClearErrors = '@global/CLEAR_ERRORS',
}

export interface ISetErrorAction extends Action<GlobalActionTypes.SetError> {
  type: typeof GlobalActionTypes.SetError
  error: IErrorResult
}

export interface IClearErrorsAction
  extends Action<GlobalActionTypes.ClearErrors> {
  type: typeof GlobalActionTypes.ClearErrors
}

export type GlobalActions = ISetErrorAction | IClearErrorsAction
