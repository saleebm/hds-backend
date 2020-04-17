import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  InvalidArgumentError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmpDataFiltered } from '@Types/employees'

const prisma = new PrismaClient()

export interface FindOneEmployee {
  employee: EmpDataFiltered | undefined
}
/**
 * post
 * Returns one employee by id, if supplied, defaults to id of user requesting
 * @param req.body: { empId: number }
 * @param res.data.employee: employeeData | undefined if not found
 */
export default handler(
  async (req): Promise<FindOneEmployee> => {
    // bail if not posting
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    const { userId, employee } = await checkAuth(req.headers)

    if (userId && !isNaN(userId)) {
      let empIdToSearchFor = ('empId' in req.body && req.body.empId) || userId

      if (isNaN(empIdToSearchFor)) {
        empIdToSearchFor = parseInt(empIdToSearchFor)
      }
      // if requesting self, return now
      if (empIdToSearchFor === userId) {
        return {
          employee: getEmpData(employee),
        }
      }
      if (!isNaN(empIdToSearchFor)) {
        const empData = await prisma.employee.findOne({
          where: { employeeId: empIdToSearchFor },
          include: { storeLocations: true },
        })

        if (!!empData) {
          return {
            employee: getEmpData(empData),
          }
        }
        // no employee by id found
        return {
          employee: undefined,
        }
      }
      throw new InvalidArgumentError('empId must be a number')
    }
    // unauthorized
    // no userId from auth headers
    throw new UnauthenticatedError()
  }
)
