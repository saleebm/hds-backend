import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmpDataFiltered } from '@Types/employees'

export interface Viewer extends EmpDataFiltered {
  userId: number
}
/**
 * POST
 * @params none
 * @return userId Id if authenticated
 */
export default handler(
  async (req): Promise<Viewer> => {
    // first make sure the method is post
    if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

    const { userId, employee } = await checkAuth(req.headers)

    if (userId && !isNaN(userId)) {
      return {
        userId,
        ...getEmpData(employee),
      }
    }
    // no return above
    throw new UnauthenticatedError()
  }
)
