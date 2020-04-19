import { handler } from '@Lib/server'
import { CustomerOrder, PrismaClient } from '@prisma/client'
import {
  InvalidArgumentError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { parseLocaleNumber } from '@Utils/common'
import { CustomerOrderCreateInputBodyArgs } from '@Types/customer-order'

const prisma = new PrismaClient()

/**
 * post
 * creates customer order
 *
 * @param req.body.customerOrderCreate
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

    if (!req.body.customerOrderCreate) {
      throw new InvalidArgumentError('Missing customerOrderCreate body arg')
    }

    const {
      customer,
      expectedDeliveryDate,
      storeLocationId,
      orderTotal,
      customerOrderProducts,
    } = req.body.customerOrderCreate as CustomerOrderCreateInputBodyArgs
    //
    // const filteredOrderProducts =
    //   Array.isArray(customerOrderProducts.create) &&
    //   customerOrderProducts.create.map((orderProduct) => ({}))

    try {
      const customerOrder = await prisma.customerOrder.create({
        data: {
          customer: customer,
          expectedDeliveryDate: new Date(expectedDeliveryDate),
          orderTotal:
            typeof orderTotal === 'string'
              ? Number(parseLocaleNumber(req.body.orderTotal))
              : orderTotal,
          storeLocations: {
            connect: { idStoreLocations: storeLocationId },
          },
          customerOrderProducts: customerOrderProducts,
        },
      })

      return { customerOrder }
    } catch (e) {
      throw new Error(e)
    }
  }
)
