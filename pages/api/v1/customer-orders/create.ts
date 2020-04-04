import { handler } from '@Lib/server'
import { CustomerOrder, PrismaClient } from '@prisma/client'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { parseLocaleNumber } from '@Utils/common'

const prisma = new PrismaClient()

/**
 * post
 * creates customer order
 *
 * @param req.body.TODO
 */
export default handler(
  async (req): Promise<{ customerOrder: CustomerOrder }> => {
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    // authorized?
    const { userId } = await checkAuth(req.headers)
    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }

    // first create order to map with products...
    try {
      const customerOrder = await prisma.customerOrder.create({
        data: {
          customer: req.body.customer,
          expectedDeliveryDate: new Date(req.body.expectedDeliveryDate),
          orderTotal:
            typeof req.body.orderTotal === 'string'
              ? Number(parseLocaleNumber(req.body.orderTotal))
              : req.body.orderTotal,
          storeLocations: req.body.storeLocations,
          customerOrderProducts: req.body.customerOrderProducts
        },
      })

      return { customerOrder }
    } catch (e) {
      throw new Error(e)
    }
  }
)
