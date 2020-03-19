declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN_STORAGE_KEY: string
      TOKEN_SIGNING_SECRET: string
    }
  }
}
