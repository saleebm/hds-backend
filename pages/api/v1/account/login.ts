import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  MissingParameterError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { cryptoFactory } from '@Utils/crypto'

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
  if (req.method === 'POST') {
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
      // bail!
      if (!match) {
        throw new UnauthenticatedError()
      }
      //todo
      // generate access token and refresh token
      // sign them both with env secret and ship
      return {
        match,
      }
    }
  } else {
    throw new NotImplementedError()
  }
})
