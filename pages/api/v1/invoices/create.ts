import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'

const prisma = new PrismaClient()

/**
 * post
 * create an Invoice from a previous customer order
 */
export default handler(async (req) => {})
