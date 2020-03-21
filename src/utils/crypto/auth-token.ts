import jwt from 'jsonwebtoken'

// on second thought, storing the email in the token is a bad idea.
export type DecodedToken = {
  readonly userId: number
  readonly exp: number
}

// limit to server side use unlike the auth service
export class AuthToken {
  readonly decodedToken: DecodedToken

  constructor(readonly token?: string) {
    // we are going to default to an expired decodedToken
    this.decodedToken = { userId: -1, exp: 0 }

    // then try and decode the jwt using jwt-decode
    try {
      if (token) this.decodedToken = jwt.decode(token) as DecodedToken
    } catch (e) {}
  }

  get authorizationString() {
    return `Bearer ${this.token}`
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000)
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  get isValid(): boolean {
    return !this.isExpired
  }
}
