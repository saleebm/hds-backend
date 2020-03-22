import { Store } from 'redux'

declare global {
  interface Window {
    __HDS_REDUX_STORE__: Store
  }
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_STORAGE_KEY: string
      TOKEN_SIGNING_SECRET: string
    }
  }
}
