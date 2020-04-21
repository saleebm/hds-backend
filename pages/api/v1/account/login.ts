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
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmpDataFiltered } from '@Types/employees'

const prisma = new PrismaClient()

export type LoginRequestBody = {
  email: string
  password: string
}

export type LoginRequestSuccess = {
  accessToken: string
  refreshToken: string
} & EmpDataFiltered

export type LoginBody = {
  email: string
  password: string
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
      body: LoginBody
    }
  ): Promise<LoginRequestSuccess> => {
    // bail
    if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

    // missing parameters
    if (!req.body || !req.body.email || !req.body.password) {
      throw new MissingParameterError()
    }
    // console.log(req.body)
    const employee = await prisma.employee.findOne({
      where: { email: req.body.email.toLowerCase() },
      include: { storeLocations: true },
    })
    // if no employee found by email, should not happen because client login verifies this
    if (!employee) {
      throw new UnauthenticatedError()
    } else {
      // verify pw
      const match = await cryptoFactory.verifyUserPassword({
        reqBodyPassword: req.body.password,
        storedPasswordHash: employee.password,
      })
      // bail! wrong password or email!
      if (!match) {
        throw new FailedLoginError()
      }
      // token signing secret must be in env
      const { signingSignature } = getEnv()

      // generate access token and refresh token
      // sign them both with env secret and ship
      const accessToken = await getAccessToken({
        jwtid: employee.userSigningSecret,
        userId: employee.employeeId,
        signingSecret: signingSignature,
      })
      const refreshToken = await AuthTokenSecurity.sign({
        payload: { userId: employee.employeeId },
        isRefreshToken: true,
        signingSecret: signingSignature,
        jwtOptions: {
          subject: `${employee.employeeId}`,
          jwtid: employee.userSigningSecret,
        },
      })
      return {
        accessToken,
        refreshToken,
        ...getEmpData(employee),
      }
    }
  }
)
