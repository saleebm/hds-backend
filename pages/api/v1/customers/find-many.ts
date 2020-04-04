import { Customer, PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

const prisma = new PrismaClient()

export type CustomerFindManyReturn = { customers: Customer[] | null }
/**
 * post
 * get many customers, useful when searching by name
 * @param req.body.customerWhereArgs CustomerWhereArgs
 * @return customers or null
 */
export default handler(
  async (req): Promise<CustomerFindManyReturn> => {
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    const { userId } = await checkAuth(req.headers)

    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }
    try {
      const maybeCustomers = await prisma.customer.findMany(
        req.body.customerWhereArgs
      )
      if (maybeCustomers) {
        return {
          customers: maybeCustomers,
        }
      }
      // not found
      return {
        customers: null,
      }
    } catch (e) {
      throw new Error(e)
    }
  }
)
