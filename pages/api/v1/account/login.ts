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
import { getEnv } from '@Pages/api/v1/account/_get-env'
import { getAccessToken } from '@Pages/api/v1/account/_get-access-token'

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
 * POST
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
    if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

    // missing parameters
    if (!req.body || !req.body.email || !req.body.password) {
      throw new MissingParameterError()
    }
    console.log(req.body)
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
      // token signing secret must be in env
      const { signingSignature } = getEnv()

      // generate access token and refresh token
      // sign them both with env secret and ship
      const accessToken = await getAccessToken({
        jwtid: employee.jwtUserSecret,
        userId: employee.id,
        signingSecret: signingSignature,
      })
      const refreshToken = await AuthTokenSecurity.sign({
        payload: { userId: employee.id },
        isRefreshToken: true,
        signingSecret: signingSignature,
        jwtOptions: {
          subject: `${employee.id}`,
          jwtid: employee.jwtUserSecret,
        },
      })
      return {
        accessToken,
        refreshToken,
      }
    }
  }
)
