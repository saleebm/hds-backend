import {
  EmployeeInclude,
  EmployeeOrderByInput,
  EmployeeSelect,
  EmployeeWhereInput,
  PrismaClient,
} from '@prisma/client'

import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmployeesAllPayload } from '@Types/employees'

const prisma = new PrismaClient()

/**
 * post
 * Returns many employees
 * @return res.data.employees: employeeData[] | undefined if not found
 */
export default handler(
  async (req): Promise<EmployeesAllPayload | { employees: null }> => {
    // bail if not getting
    if (req.method?.toLowerCase() !== 'post') {
      throw new NotImplementedError()
    }
    const { userId } = await checkAuth(req.headers)

    if (!userId || isNaN(userId)) {
      // unauthorized
      // no userId from auth headers
      throw new UnauthenticatedError()
    }

    const orderByArg: EmployeeOrderByInput = ('orderBy' in req.body &&
      req.body.orderBy) || { employeeId: 'asc' }

    const includeArg: EmployeeInclude =
      ('include' in req.body && req.body.include) || undefined

    const selectArg =
      ('select' in req.body && (req.body.select as EmployeeSelect)) || undefined

    const whereArg =
      ('where' in req.body && (req.body.where as EmployeeWhereInput)) ||
      undefined

    const empData = await prisma.employee.findMany({
      orderBy: { ...orderByArg },
      ...(selectArg ? { select: selectArg } : undefined),
      ...(whereArg ? { where: whereArg } : undefined),
      ...(includeArg
        ? { include: includeArg }
        : { include: { storeLocations: true } }),
    })

    if (!!empData) {
      const employees = empData.map((emp) => ({ ...getEmpData(emp) }))

      return {
        employees,
      }
    }
    // no employee by id found
    return {
      employees: null,
    }
  }
)
