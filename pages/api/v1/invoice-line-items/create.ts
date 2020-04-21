import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { InvoiceLineItemCreateArgs } from '@Types/invoices'

const prisma = new PrismaClient()

export default handler(
  async (req): Promise<{ isSuccessful: boolean }> => {
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    const { userId } = await checkAuth(req.headers)

    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }

    const { dueDate, lineItemTotal, invoiceId } = req.body
      .createLineItem as InvoiceLineItemCreateArgs
    try {
      // noinspection SuspiciousTypeOfGuard
      await prisma.invoiceLineItems.create({
        data: {
          dueDate: new Date(dueDate),
          invoice: { connect: { idInvoice: invoiceId } },
          lineItemTotal:
            typeof lineItemTotal === 'string'
              ? Number(lineItemTotal)
              : lineItemTotal,
        },
      })
      return {
        isSuccessful: true,
      }
    } catch (e) {
      throw new Error(e)
    }
  }
)
