import { Customer, FindOneCustomerArgs, PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

const prisma = new PrismaClient()

export interface FindOneCustomerBodyArgs {
  findOneBy: FindOneCustomerArgs
}

/**
 * post
 * get one customer
 */
export default handler(
  async (req): Promise<{ customer: Customer | null }> => {
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
      const maybeCustomer = await prisma.customer.findOne(req.body.findOneBy)
      if (maybeCustomer) {
        return {
          customer: maybeCustomer,
        }
      }
      // not found
      return {
        customer: null,
      }
    } catch (e) {
      throw new Error(e)
    }
  }
)
