import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

const prisma = new PrismaClient()

/**
 * post
 * Returns many employees
 * @param res.data.employees: employeeData[] | undefined if not found
 */
export default handler(async (req) => {
  // bail if not getting
  if (req.method?.toLowerCase() !== 'get') {
    throw new NotImplementedError()
  }
  const { userId } = await checkAuth(req.headers)

  if (!userId || isNaN(userId)) {
    // unauthorized
    // no userId from auth headers
    throw new UnauthenticatedError()
  }

  const suppliers = await prisma.supplier.findMany()

  return {
    suppliers: suppliers.map((supp) => ({ ...supp })),
  }
})
