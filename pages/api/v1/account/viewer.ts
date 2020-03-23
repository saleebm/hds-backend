import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { EmployeeRes } from '@Types/api-res'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'

export interface Viewer extends EmployeeRes {
  userId: number
}
/**
 * POST
 * @params none
 * @return userId Id if authenticated
 */
export default handler(async (req) => {
  // first make sure the method is post
  if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

  const { userId, employee } = await checkAuth(req.headers)

  if (userId && !isNaN(userId)) {
    return {
      userId,
      employee: getEmpData(employee),
    }
  }
  // no return above
  throw new UnauthenticatedError()
})
