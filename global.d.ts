import { Store } from 'redux'

declare global {
  interface Window {
    __HDS_REDUX_STORE__: Store
  }
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_STORAGE_KEY: string
      TOKEN_SIGNING_SECRET: string
      SENDGRID_API_KEY: string
      ADMIN_PASS: string
      ADMIN_EMAIL: string
    }
  }
}
