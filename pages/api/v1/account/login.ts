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

const prisma = new PrismaClient()

export type LoginRequestBody = {
  email: string
  password: string
}

/**
 * @param req
 * @param res
 */
export default handler(async (req) => {
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
    //todo
    // generate access token and refresh token
    // sign them both with env secret and ship
    const accessToken = await AuthTokenSecurity.sign({
      payload: { userId: employee.id },
      isRefreshToken: false,
      userSigningSecret: process.env.TOKEN_SIGNING_SECRET!,
    })
    const refreshToken = await AuthTokenSecurity.sign({
      payload: { userSecret: employee.jwtUserSecret },
      isRefreshToken: true,
      userSigningSecret: process.env.TOKEN_SIGNING_SECRET!,
      jwtOptions: {
        subject: `${employee.id}`,
      },
    })
    return {
      accessToken,
      refreshToken,
    }
  }
})
