import { Customer, CustomerUpdateArgs, PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { NextApiRequest } from 'next'

const prisma = new PrismaClient()

export interface UpdateOneBody {
  updateCustomer: CustomerUpdateArgs
}

export interface CustomerUpdatedResponse {
  customer: Customer
}

/**
 * post
 * create one customer
 * @param req.body.updateCustomer
 */
export default handler(
  async (
    req: NextApiRequest & { body: UpdateOneBody }
  ): Promise<CustomerUpdatedResponse> => {
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
      const customer = await prisma.customer.update(req.body.updateCustomer)
      return {
        customer,
      }
    } catch (e) {
      throw new Error(e)
    }
  }
)
