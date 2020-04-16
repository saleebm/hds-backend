import { applyMiddleware, createStore, Store } from 'redux'
// dev
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { RootAction } from './modules/root-action'
import { rootReducer } from './modules/root-reducer'
import { RootState } from './modules/root-state'
import { RootStateType, ThunkExtraArgs } from './modules/types'

const composeEnhancers = composeWithDevTools({
  trace: true,
  serialize: {
    map: true,
  },
})

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
      ? composeEnhancers(applyMiddleware(...middleware))
      : applyMiddleware(...middleware)

  return createStore<RootStateType, RootAction, any, any>(
    rootReducer,
    initialState,
    enhancer
  )
}
