import { AppContext } from 'next/app'

import { Store } from 'redux'
import { RootStateType } from '@Store/modules/types'
import { RootAction } from '@Store/modules/root-action'
import { ThunkDispatch } from 'redux-thunk'
import { NextPageContext } from 'next'

export interface AppStore extends Store<RootStateType, RootAction> {
  dispatch: ThunkDispatch<RootStateType, RootAction, any>
}

export interface WithStore extends NextPageContext {
  store: AppStore
}

export interface AppPropsWithStore extends AppContext {
  ctx: WithStore
}
