import jwt from 'jsonwebtoken'
import { NextPageContext } from 'next'
import { STORAGE_KEYS } from '@Config'
import { cookieService, CookieService } from './cookie-service'
import { ServerCtx, ServerSideProps } from '@Types'
import { AppPropsWithStore } from '@Types/_app'

// client storage provider
class AuthStorageProvider {
  private storageService: CookieService

  public constructor(storageService: CookieService) {
    this.storageService = storageService
  }

  logIn = async ({
    authToken,
    refreshToken,
    ctx,
  }: {
    authToken: string
    refreshToken: string
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  }) => {
    await Promise.all([
      this.setAccessToken(authToken, ctx),
      this.setRefreshToken(refreshToken, ctx),
    ])
  }

  logOut = async () => {
    await Promise.all([this.removeAccessToken(), this.removeRefreshToken()])
  }

  // Access Token
  setAccessToken = (
    token: string,
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => {
    const expiryDate: Date = new Date(0) // The 0 there is the key, which sets the date to the epoch

    const jwtAuthExpiration = this.getExpiryFromToken(token)
    // if passed an auth exp value and it is a number, set exp date
    if (jwtAuthExpiration && !isNaN(jwtAuthExpiration)) {
      expiryDate.setUTCSeconds(parseInt(jwtAuthExpiration))
    }

    this.storageService.setItem(
      STORAGE_KEYS.ACCESS_TOKEN,
      token,
      {
        expires: !!expiryDate ? expiryDate : undefined,
        path: '/',
        sameSite: 'strict',
      },
      ctx
    )
  }
  getAccessToken = (
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => this.storageService.getItem(STORAGE_KEYS.ACCESS_TOKEN, ctx)

  removeAccessToken = (
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => {
    console.log(`removing access token`)
    this.storageService.removeItem(STORAGE_KEYS.ACCESS_TOKEN, ctx)
  }

  // todo feels weird duplicating this and setAccessToken method above. refactor
  // Refresh Token
  setRefreshToken = (
    token: string,
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => {
    const expiryDate = new Date(0) // The 0 there is the key, which sets the date to the epoch

    const jwtAuthExpiration = this.getExpiryFromToken(token)
    // if passed an auth exp value and it is a number, set exp date
    if (jwtAuthExpiration && !isNaN(jwtAuthExpiration)) {
      expiryDate.setUTCSeconds(parseInt(jwtAuthExpiration))
    }
    this.storageService.setItem(
      STORAGE_KEYS.REFRESH_TOKEN,
      token,
      {
        expires: expiryDate,
        sameSite: 'strict',
        path: '/',
      },
      ctx
    )
  }
  getRefreshToken = (
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => this.storageService.getItem(STORAGE_KEYS.REFRESH_TOKEN, ctx)

  removeRefreshToken = (
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) => {
    console.log(`removing refresh token`)
    this.storageService.removeItem(STORAGE_KEYS.REFRESH_TOKEN, ctx)
  }

  isTokenValid = (token: string): boolean => {
    const decodedToken = this.getExpiryFromToken(token)
    if (!decodedToken) {
      return false
    }
    const now = new Date()
    return now.getTime() < decodedToken.exp * 1000
  }

  getExpiryFromToken(token: string) {
    const decodedToken = jwt.decode(token)

    if (!decodedToken) {
      return undefined
    }

    return typeof decodedToken === 'object' && 'exp' in decodedToken
      ? decodedToken.exp
      : undefined
  }
}

export const authService = new AuthStorageProvider(cookieService)
