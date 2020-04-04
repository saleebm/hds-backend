import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  MissingParameterError,
  NotImplementedError,
} from '@Lib/server/known-errors'
import { isEmail } from '@Utils/common'

const prisma = new PrismaClient()

/**
 * simply checks if email exists or not
 * GET
 * @param req.query.email The email to search for
 * @return { exists: Boolean } - whether the email is taken or not
 */
export default handler(async (req) => {
  if (req.method?.toLowerCase() !== 'get') throw new NotImplementedError()

  if (!req.query || !req.query.email) throw new MissingParameterError()

  // if not valid email return false immediately
  if (!isEmail(req.query.email.toString().toLowerCase()))
    return { exists: false }

  const possibleEmpByEmail = await prisma.employee.findOne({
    where: {
      email: Array.isArray(req.query.email)
        ? req.query.email[0].toLowerCase()
        : req.query.email.toLowerCase(),
    },
  })

  return {
    exists: !!possibleEmpByEmail,
  }
})
