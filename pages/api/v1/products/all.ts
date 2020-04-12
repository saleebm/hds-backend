import { FindManyProductArgs, PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import { NotImplementedError } from '@Lib/server/known-errors'

const prisma = new PrismaClient()

/**
 * post
 * Returns many products
 * @return res.data.products: products[] | undefined if not found
 */
export default handler(async (req) => {
  // bail if not getting
  if (req.method?.toLowerCase() !== 'post') {
    throw new NotImplementedError()
  }
  const args =
    (!!req.body && 'options' in req.body && (req.body.options as FindManyProductArgs)) || {}

  const products = await prisma.product.findMany({})

  return {
    products,
  }
})
