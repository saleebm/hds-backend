import { FC } from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'

import { isServer } from '@Utils/common'
import { configureStore } from '@Store/configure-store'
import { AppPropsWithStore } from '@Types/_app'
import { ServerSideProps } from '@Types'
import throttle from 'lodash.throttle'
import { Store } from 'redux'
import { RootStateType } from '@Store/modules/types'
import { refreshJWTAction } from '@Store/modules/auth/action'
import { RootAction } from '@Store/modules/root-action'

interface InitStoreOptions {
  initialStoreState?: any
  ctx?: AppPropsWithStore | ServerSideProps
}

export interface AppProviderProps {
  initialStoreState: any
  appProps: any
}

type NextProvider<Props> = FC<Props> & {
  getInitialProps: (ctx: AppPropsWithStore) => Promise<{} | any>
}

export const initStore = ({ initialStoreState, ctx }: InitStoreOptions) => {
  const storeKey: string = '__HDS_REDUX_STORE__'
  const createStore = (ctx?: AppPropsWithStore | ServerSideProps) =>
    configureStore(initialStoreState, { ctx })

  // if window is undefined
  if (isServer()) {
    return createStore(ctx)
  }
  // Memoize store if client
  if (!(storeKey in (window as { [key: string]: any }))) {
    window['__HDS_REDUX_STORE__'] = createStore()
  }

  return window['__HDS_REDUX_STORE__']
}

function initOnContext(ctx: AppPropsWithStore) {
  ctx.ctx.store = initStore({ ctx })

  return ctx
}

export function withRedux(WrappedApp: any) {
  const AppProvider: NextProvider<AppProviderProps> = ({
    initialStoreState,
    ...rest
  }) => {
    // initialize and reuse on: next.js csr
    const reduxStore: Store<RootStateType, RootAction> = initStore({
      initialStoreState,
    })

    const checkAuthorized = (state: RootStateType) =>
      state.authReducer.isAuthenticated

    const unsubscribe = reduxStore.subscribe(
      throttle(() => {
        if (!checkAuthorized(reduxStore.getState())) {
          console.log('not refreshing jwt')
          return
        }
        try {
          console.log('refreshing jwt action')
          reduxStore.dispatch(refreshJWTAction() as any)
        } catch (e) {}
        return () => unsubscribe()
      }, 300000)
    )

    return (
      <Provider store={reduxStore}>
        <WrappedApp {...rest} />
      </Provider>
    )
  }
  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = WrappedApp.displayName || WrappedApp.name || 'Component'
    AppProvider.displayName = `AppProvider(${displayName})`
  }

  AppProvider.getInitialProps = async function (
    ctx: AppPropsWithStore
  ): Promise<{} | AppProviderProps> {
    const {
      ctx: { store },
    } = initOnContext(ctx)
    let appProps = {}

    if (typeof App.getInitialProps === 'function') {
      appProps = await App.getInitialProps.call(WrappedApp, ctx)
    }

    return {
      ...appProps,
      initialStoreState:
        store && typeof store.getState() === 'function'
          ? store.getState()
          : undefined,
    }
  }

  return AppProvider
}
