import { PrismaClient } from '@prisma/client'

import { handler } from '@Lib/server'
import { getValidUserIdForCode } from '@Pages/api/v1/account/_generate-code'
import { MissingParameterError } from '@Lib/server/known-errors'

const prisma = new PrismaClient()

export type VerifyAuthCode = {
  userId: number | string
}
/**
 * post
 * check code for authenticity and updates user's password
 * @param req.body.code
 * @return { userId } The userId
 */
export default handler(
  async (req): Promise<VerifyAuthCode> => {
    if (!req.body.code) {
      throw new MissingParameterError()
    }
    // get code from body
    const { code } = req.body
    // pull user from magic link
    try {
      const userId = await getValidUserIdForCode(code, prisma)
      return {
        userId,
      }
    } catch (e) {
      throw e
    }
  }
)
