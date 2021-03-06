import jwt from 'jsonwebtoken'
import { AuthPayload } from '@Types'

// 1 day
const AUTH_TOKEN_EXPIRES_IN = 60 * 60 * 24
// 1 year
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 365

export const AuthTokenSecurity = {
  // creates the token
  sign: ({
    payload,
    signingSecret,
    isRefreshToken,
    jwtOptions,
  }: {
    payload: AuthPayload
    signingSecret: string
    isRefreshToken: boolean
    jwtOptions?: jwt.SignOptions
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        signingSecret,
        Object.assign(
          {
            expiresIn: isRefreshToken
              ? REFRESH_TOKEN_EXPIRES_IN
              : AUTH_TOKEN_EXPIRES_IN,
            algorithm: 'HS512',
            notBefore: -60, // backtrack a minute
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
  // simply decoding
  // first get userId to get jwtid from employee data
  decode: (
    token: string
  ): AuthPayload | null | string | { [key: string]: any } => {
    return jwt.decode(token)
  },
  // actual verification of accessToken
  verify: ({
    token,
    envSigningSecret,
    userJwtSecret,
  }: {
    token: string
    envSigningSecret: string
    userJwtSecret: string
  }): Promise<AuthPayload> => {
    // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        envSigningSecret,
        { algorithms: ['HS512'], jwtid: userJwtSecret },
        (err, decoded) => {
          if (err) {
            return reject(err)
          }
          resolve(decoded as AuthPayload)
        }
      )
    })
  },
}
