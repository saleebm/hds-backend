import { InvoiceLineItemsWhereInput, PrismaClient } from '@prisma/client'

import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { InvoiceLineItemsReturn } from '@Types/invoices'

const prisma = new PrismaClient()

/**
 * post
 */
export default handler(
  async (req): Promise<InvoiceLineItemsReturn> => {
    if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()
    const { userId } = await checkAuth(req.headers)

    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }

    if (req.body && 'invoiceId' in req.body) {
      const { invoiceId } = req.body as InvoiceLineItemsWhereInput
      const invoiceLineItems = await prisma.invoiceLineItems.findMany({
        where: { invoiceId },
      })

      return {
        invoiceLineItems,
      }
    } else {
      throw new Error('invoiceId missing')
    }
  }
)
