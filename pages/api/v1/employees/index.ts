import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * todo obviously make this route auth-only for privacy
 * @param req
 * @param res
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method?.toLowerCase() !== 'get') {
    res.status(204)
  } else {
    // todo filters in query params
    // returns all employees
    const empData = await prisma.employee.findMany({ orderBy: { id: 'asc' } })
    res.status(200).json({ employees: empData })
  }
}
