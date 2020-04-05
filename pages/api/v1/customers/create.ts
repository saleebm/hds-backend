import {
  Customer,
  CustomerCreateWithoutCustomerOrderInput,
  PrismaClient,
} from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

const prisma = new PrismaClient()

export interface CreateCustomerArgs {
  createCustomer: CustomerCreateWithoutCustomerOrderInput
}

export interface CustomerCreatedResponse {
  customer: Customer
}

/**
 * post
 * create one customer
 * @param req.body.createCustomer
 */
export default handler(
  async (req): Promise<CustomerCreatedResponse> => {
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
      const {
        address,
        city,
        firstName,
        lastName,
        middleInitial,
        state,
        zipCode,
      } =
        (req.body.createCustomer as CustomerCreateWithoutCustomerOrderInput) ||
        {}

      const customer = await prisma.customer.create({
        data: {
          address,
          city,
          firstName,
          lastName,
          middleInitial,
          state,
          zipCode,
        },
      })
      return {
        customer,
      }
    } catch (e) {
      throw new Error(e)
    }
  }
)
