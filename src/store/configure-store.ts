import { applyMiddleware, createStore, Store } from 'redux'
import thunk, { ThunkMiddleware } from 'redux-thunk'
// dev
import { composeWithDevTools } from 'redux-devtools-extension'

import { RootState } from './modules/root-state'
import { rootReducer } from './modules/root-reducer'
import { RootStateType, ThunkExtraArgs } from './modules/types'
import { RootAction } from './modules/root-action'
import { checkAuthStatusAction } from '@Store/modules/auth/action'
import { authService } from '@Services'

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

  // initially store user in state
  // store.getState() here is stored at another closure below than the subscriptions
  // runs only once and stored in initialStoreState variable, unlike above function checkAuthorized(),
  // which checks state anew every time
  const initialStoreState: RootStateType = Object.freeze(store.getState())
  const { authReducer } = initialStoreState
  // same with this variable
  const authToken = authService.getAccessToken(ctx)
  // there is a token but not authenticated in store state
  if (!!authToken && !authReducer.isAuthenticated) {
    // put em in store
    console.log('checking auth status from configure store')
    store.dispatch(checkAuthStatusAction())
  }

  return store
}
