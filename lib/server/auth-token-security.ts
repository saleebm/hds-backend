import jwt from 'jsonwebtoken'
import { AuthPayload } from '@Types'

export const AuthTokenSecurity = {
  sign: ({
    payload,
    userSigningSecret,
  }: {
    payload: AuthPayload
    userSigningSecret: string
  }) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, userSigningSecret, {})
    })
  },
}
