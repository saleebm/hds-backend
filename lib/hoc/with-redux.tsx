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
import { getAxiosInstance } from '@Lib/axios-instance'
import { Viewer } from '@Pages/api/v1/account/viewer'
import { useInterval } from '@Utils/hooks'

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
    const reduxStore: Store<RootStateType, any> = initStore({
      initialStoreState,
    })

    const { dispatch } = reduxStore || {}
    const currentState = reduxStore.getState() || {}

    // refresh token every 5 min
    useInterval(() => {
      if (!!currentState && dispatch) {
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

    // using GIP instead of GSSP because then I can statically generate those pages
    // routing authenticated/unauthenticated server side
    // also used in Dashboard to control routing
    if (req && res) {
      const authToken = authService.getAccessToken(ctx)
      const redirectUnauthenticated = () => {
        if (req.url !== '/' && !req.url?.match(/^\/auth\/.+/)) {
          res.writeHead(302, 'Unauthenticated', { Location: '/' }).end()
        }
      }
      if (!!store && authToken) {
        // did not work with checkAuthStatusAction thunk for some reason
        try {
          const authCodeResponse = await getAxiosInstance().post<Viewer>(
            'account/viewer',
            undefined,
            {
              headers: {
                authorization: `Bearer ${authToken}`,
              },
              withCredentials: true,
            }
          )
          if (authCodeResponse.data && authCodeResponse.data.userId) {
            const {
              employee: { lastName, firstName, email, userId, role },
            } = authCodeResponse.data
            // dispatch
            store.dispatch({
              type: AuthActionTypes.CheckAuthStatusSuccess,
              payload: { lastName, firstName, email, userId, role },
            })
            // the req url is the login index page... and authenticated ^
            if (req.url === '/') {
              // redirect to dashboard
              res
                .writeHead(302, 'Authenticated', { Location: '/dashboard' })
                .end()
            } // if not authorized by server and not going to login page or auth page (reset password), redirect to login
          } else {
            redirectUnauthenticated()
          }
        } catch (e) {
          redirectUnauthenticated()
        }
      } else {
        //no auth token at all
        redirectUnauthenticated()
      }
    }

    return {
      ...appProps,
      initialStoreState: store?.getState(),
    }
  }

  return AppProvider
}
