import { applyMiddleware, createStore, Store } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import throttle from 'lodash.throttle'
// dev
import { composeWithDevTools } from 'redux-devtools-extension'

import { RootState } from './modules/root-state'
import { rootReducer } from './modules/root-reducer'
import { RootStateType, ThunkExtraArgs } from './modules/types'
import { RootAction } from './modules/root-action'
import {
  checkAuthStatusAction,
  refreshJWTAction,
} from '@Store/modules/auth/action'

export function configureStore(
  initialState: RootStateType = RootState,
  { ctx }: ThunkExtraArgs
): Store {
  const middleware = [
    thunk.withExtraArgument({
      ctx,
    }) as ThunkMiddleware<RootStateType>,
  ]
  const enhancer =
    process.env.NODE_ENV !== 'production'
      ? composeWithDevTools(applyMiddleware(...middleware))
      : applyMiddleware(...middleware)

  const store = createStore<RootStateType, RootAction, any, any>(
    rootReducer,
    initialState,
    enhancer
  )

  const checkAuthorized = () => {
    const currentAuthState: RootStateType = store.getState()
    const { authReducer } = currentAuthState
    // if loading account, not authenticated, bail
    return !(authReducer.loadingAccount || !authReducer.isAuthenticated)
  }

  /**
   * Fetching initial user is done in header,
   * this allows us to periodically (5 min) check for auth
   */
  store.subscribe(
    throttle(() => {
      if (!checkAuthorized()) {
        return
      }
      try {
        console.log('check auth status action')
        store.dispatch(checkAuthStatusAction())
      } catch (e) {
        console.log(e)
      }
    }, 30000)
  )

  /**
   * Refresh jwt action
   */
  store.subscribe(
    throttle(() => {
      if (!checkAuthorized()) {
        return
      }
      try {
        console.log('refreshing jwt action')
        store.dispatch(refreshJWTAction())
      } catch (e) {}
    }, 30000)
  )

  return store
}
