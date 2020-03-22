import { FC } from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'
import { Store } from 'redux'

import { isServer } from '@Utils/common'
import { configureStore } from '@Store/configure-store'
import { AppPropsWithStore } from '@Types/_app'

interface InitStoreOptions {
  initialStoreState?: any
  ctx?: AppPropsWithStore
}

export interface AppProviderProps {
  initialStoreState: any
  appProps: any
}

type NextProvider<Props> = FC<Props> & {
  getInitialProps: (ctx: AppPropsWithStore) => Promise<{} | any>
}

const initStore = ({ initialStoreState, ctx }: InitStoreOptions): Store => {
  const storeKey: string = '__HDS_REDUX_STORE__'
  const createStore = (ctx?: AppPropsWithStore) =>
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
  ctx.ctx.store = initStore({ ctx, initialStoreState: {} })

  return ctx
}

export function withRedux(WrappedApp: any) {
  const AppProvider: NextProvider<AppProviderProps> = ({
    initialStoreState,
    ...rest
  }) => {
    // apolloClient, store will be available on: getDataFromTree & next.js ssr
    // else initialize and reuse on: next.js csr
    const reduxStore = initStore({ initialStoreState })

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
      initialStoreState: store?.getState(),
    }
  }

  return AppProvider
}
