import {
  EmployeeOrderByInput,
  EmployeeWhereUniqueInput,
  FindManyEmployeeArgs,
  PrismaClient,
} from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

const prisma = new PrismaClient()

export type EmployeesBodyArgs = FindManyEmployeeArgs

/**
 * post
 * Returns many employees
 * @param req.body: { empId: number }
 * @param res.data.employees: employeeData[] | undefined if not found
 */
export default handler(async (req) => {
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
    req.body.orderBy) || { id: 'asc' }

  const afterArg =
    ('after' in req.body && (req.body.after as EmployeeWhereUniqueInput)) ||
    undefined

  // if last is set, don't pass first arg
  const lastArg =
    typeof afterArg !== 'undefined'
      ? undefined
      : ('last' in req.body &&
          req.body.last &&
          parseInt(
            Array.isArray(req.body.last) ? req.body.last[0] : req.body.last
          )) ||
        undefined

  // if last is set, don't pass first arg
  const firstArg =
    typeof lastArg !== 'undefined'
      ? undefined
      : ('first' in req.body &&
          req.body.first &&
          parseInt(
            Array.isArray(req.body.first) ? req.body.first[0] : req.body.first
          )) ||
        10

  const beforeArg =
    ('before' in req.body && (req.body.before as EmployeeWhereUniqueInput)) ||
    undefined

  const empData = await prisma.employee.findMany({
    where: {
      /*todo*/
    },
    first: firstArg,
    after: afterArg,
    last: lastArg,
    before: beforeArg,
    orderBy: { ...(orderByArg as EmployeeOrderByInput) },
  })

  if (!!empData) {
    return {
      employees: empData,
    }
  }
  // no employee by id found
  return {
    employees: undefined,
  }
})
