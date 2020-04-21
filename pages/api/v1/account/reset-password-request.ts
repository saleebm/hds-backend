import { handler } from '@Lib/server'
import {
  MissingParameterError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { generateCode } from '@Pages/api/v1/account/_generate-code'
import { sendEmail } from '@Lib/server/send-email'
import { PrismaClient } from '@prisma/client'
import getApiHostUrl from '@Lib/server/get-api-host'

const prisma = new PrismaClient()

export type ResetPasswordRequest = {
  email: string
}
/**
 * sends email to reset password
 * @param req.body.password || req.body.code
 * @return success boolean
 */
export default handler(async (req) => {
  if (!req.body.email) {
    throw new MissingParameterError()
  }

  const employee = await prisma.employee.findOne({
    where: { email: req.body.email.toString() },
  })

  if (!employee) {
    throw new UnauthenticatedError()
  }
  const hostname = getApiHostUrl(req)

  const magicCode = await generateCode(employee.employeeId, prisma)
  await sendEmail(employee.email, magicCode, hostname)

  return {
    success: true,
  }
})
