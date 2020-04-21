import { FC } from 'react'
import { Provider } from 'react-redux'
import App from 'next/app'

import { isServer } from '@Utils/common'
import { configureStore } from '@Store/configure-store'
import { AppPropsWithStore } from '@Types/_app'
import { ServerSideProps } from '@Types'
import { Store } from 'redux'
import { RootStateType } from '@Store/modules/types'
import { AuthActionTypes, refreshJWTAction } from '@Store/modules/auth/action'
import { authService } from '@Services'
import { Viewer } from '@Pages/api/v1/account/viewer'
import { useInterval } from '@Utils/hooks'
import mutator from '@Lib/server/mutator'
import getApiHostUrl from '@Lib/server/get-api-host'

interface InitStoreOptions {
  // todo strict type check
  initialStoreState?: any
  ctx?: AppPropsWithStore | ServerSideProps
}

// todo strict type check
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
    const { customerOrderReducer } = initialStoreState || {}

    const { orderProducts, ...customerOrderStore } = customerOrderReducer || {}

    // since a Map exists in store and sometimes passes in through server, deserialize it
    const serializedOrderProducts =
      !!customerOrderReducer && customerOrderReducer.orderProducts
        ? JSON.parse(customerOrderReducer.orderProducts).reduce(
            (opMap: Map<string, any>, [key, val]: any) => opMap.set(key, val),
            new Map()
          )
        : {}

    // initialize and reuse on: next.js csr
    const reduxStore: Store<RootStateType, any> = initStore({
      initialStoreState: {
        authReducer: initialStoreState.authReducer || {},
        globalReducer: initialStoreState.globalReducer || {},
        customerOrderReducer: {
          ...customerOrderStore,
          orderProducts: serializedOrderProducts,
        },
      },
    })

    const { dispatch } = reduxStore || {}
    const currentState = reduxStore.getState() || {}

    // refresh token every 5 min
    useInterval(() => {
      if (!!currentState && !!dispatch) {
        console.log('refreshing jwt')
        dispatch(refreshJWTAction())
      }
    }, 300000)

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
      ctx: { store, req, res },
    } = initOnContext(ctx)
    let appProps = {}

    if (typeof App.getInitialProps === 'function') {
      appProps = await App.getInitialProps.call(WrappedApp, ctx)
    }

    //todo
    // the problem from the README describes this part
    // I wrongly assumed that GIP would still run on the server even with getStaticProps/getStaticPaths
    // but it does not. All the dashboard pages rely on the following to
    // route authenticated/unauthenticated server side
    if (req && res && !res.headersSent && typeof res.writeHead === 'function') {
      const authToken = authService.getAccessToken(ctx)
      /**
       * Redirects unauthorized requests unless from index, or reset password /auth/[code] page
       */
      const redirectUnauthenticated = () => {
        if (req.url !== '/' && !req.url?.match(/^\/auth\/.+/)) {
          res.writeHead(302, 'Unauthenticated', { Location: '/' }).end()
        }
      }

      if (!!store && !!authToken) {
        // did not work with checkAuthStatusAction thunk dispatch.
        // as in doing store.dispatch(checkAuthStatusAction())
        // probably because I have to bindActionCreators??
        try {
          const viewerRequestPath = `${getApiHostUrl(
            req
          )}/api/v1/account/viewer`

          const authCodeResponse = await mutator<Viewer>(
            viewerRequestPath,
            {},
            ctx
          )
          if (authCodeResponse && authCodeResponse.userId) {
            const {
              userId,
              email,
              firstName,
              lastName,
              roleCapability,
            } = authCodeResponse
            // dispatch
            store.dispatch({
              type: AuthActionTypes.CheckAuthStatusSuccess,
              payload: {
                lastName,
                firstName,
                email,
                userId,
                role: roleCapability,
              },
            })
            // the req url is the login index page... and authenticated ^ ?
            if (req.url === '/') {
              // redirect to dashboard
              res
                .writeHead(302, 'Authenticated', { Location: '/dashboard' })
                .end()
            }
          } else {
            // if not authorized by server and not going to login page or auth page (reset password), redirect to login
            redirectUnauthenticated()
          }
        } catch (e) {
          redirectUnauthenticated()
        } // end try-catch
      } //end if store and auth token
      else {
        // if not authorized by server and not going to login page or auth page (reset password), redirect to login
        redirectUnauthenticated()
      }
    }

    const initialState = store?.getState()
    const { customerOrderReducer, authReducer, globalReducer } =
      initialState || {}

    // if customer order state, serialize the Map object in it
    if (!!customerOrderReducer) {
      const { orderProducts, ...customerOrderDeets } =
        customerOrderReducer || {}

      return {
        ...appProps,
        initialStoreState: !!initialState
          ? {
              customerOrderReducer: {
                ...customerOrderDeets,
                orderProducts: JSON.stringify(
                  orderProducts && orderProducts.entries()
                    ? [...orderProducts.entries()]
                    : {}
                ),
              },
              authReducer,
              globalReducer,
            }
          : {},
      }
    }

    return {
      ...appProps,
      initialStoreState: initialState,
    }
  }

  return AppProvider
}
