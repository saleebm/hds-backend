import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  FailedLoginError,
  MissingParameterError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { cryptoFactory } from '@Utils/crypto'
import { AuthTokenSecurity } from '@Lib/server/auth-token-security'
import { IncomingMessage } from 'http'

const prisma = new PrismaClient()

export type LoginRequestBody = {
  email: string
  password: string
}

export type LoginRequestSuccess = {
  accessToken: string
  refreshToken: string
}

/**
 * @param req
 * @param res
 */
export default handler(
  async (
    req: IncomingMessage & {
      query: { [p: string]: string | string[] }
      cookies: { [p: string]: string }
      body: any
    }
  ): Promise<LoginRequestSuccess> => {
    // bail
    if (req.method !== 'POST') throw new NotImplementedError()

    // missing parameters
    if (!req.body || !req.body.email || !req.body.password) {
      throw new MissingParameterError()
    }
    const employee = await prisma.employee.findOne({
      where: { email: req.body.email },
    })
    // if no employee by email
    if (!employee) {
      throw new UnauthenticatedError()
    } else {
      // verify pass
      const match = await cryptoFactory.verifyUserPassword({
        reqBodyPassword: req.body.password,
        storedPasswordHash: employee.password,
      })
      // bail! wrong password or email
      if (!match) {
        throw new FailedLoginError()
      }
      const signingSignature = process.env.TOKEN_SIGNING_SECRET
      // token signing secret must be in env
      if (!signingSignature) {
        throw new Error('Server misconfiguration')
      }
      //todo
      // generate access token and refresh token
      // sign them both with env secret and ship
      const accessToken = await AuthTokenSecurity.sign({
        payload: { userId: employee.id },
        isRefreshToken: false,
        userSigningSecret: signingSignature,
        jwtOptions: {
          // critical to set the jwtid here as this is what verifies it on the server in addition to the signing secret, so I can sleep tight
          jwtid: employee.jwtUserSecret,
        },
      })
      const refreshToken = await AuthTokenSecurity.sign({
        payload: { userSecret: employee.jwtUserSecret },
        isRefreshToken: true,
        userSigningSecret: signingSignature,
        jwtOptions: {
          subject: `${employee.id}`,
        },
      })
      return {
        accessToken,
        refreshToken,
      }
    }
  }
)
