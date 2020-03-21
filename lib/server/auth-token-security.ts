import jwt from 'jsonwebtoken'
import { AuthPayload, RefreshTokenPayload } from '@Types'

// 1 hour
const AUTH_TOKEN_EXPIRES_IN = Math.floor(Date.now() / 1000) + 60 * 60
// 1 year
const REFRESH_TOKEN_EXPIRES_IN = Math.floor(Date.now() / 1000) + 60 * 60 * 365

export const AuthTokenSecurity = {
  sign: ({
    payload,
    userSigningSecret,
    isRefreshToken,
    jwtOptions,
  }: {
    payload: AuthPayload | RefreshTokenPayload
    userSigningSecret: string
    isRefreshToken: boolean
    jwtOptions?: jwt.SignOptions
  }) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        userSigningSecret,
        Object.assign(
          {
            expiresIn: isRefreshToken
              ? REFRESH_TOKEN_EXPIRES_IN
              : AUTH_TOKEN_EXPIRES_IN,
            algorithm: 'HS512',
            notBefore: Math.floor(Date.now() / 1000) - 60,
          },
          jwtOptions
        ),
        (err, encoded) => {
          if (err) {
            return reject(err)
          }
          resolve(encoded)
        }
      )
    })
  },
}
