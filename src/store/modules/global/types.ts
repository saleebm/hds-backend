import { clearErrorsAction, setErrorAction } from './action'

export interface IErrorResult extends Record<Readonly<string>, any> {
  readonly error: any
  readonly reference: string
}
export type ErrorsType = Array<IErrorResult>

export interface IGlobalState {
  errors: ErrorsType
}

export interface IGlobalActionDispatchs {
  setErrorAction: typeof setErrorAction
  clearErrorsAction: typeof clearErrorsAction
}
