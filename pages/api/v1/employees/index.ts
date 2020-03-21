import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import { NotImplementedError } from '@Lib/server/known-errors'

const prisma = new PrismaClient()

/**
 * todo obviously make this route auth-only for privacy.
 *
 * @param req
 * @param res
 */
export default handler(async (req) => {
  // bail
  if (req.method !== 'GET') {
    throw new NotImplementedError()
  }
  // todo filters in query params
  // returns all employees
  const empData = await prisma.employee.findMany({ orderBy: { id: 'asc' } })
  return { employees: empData }
})
