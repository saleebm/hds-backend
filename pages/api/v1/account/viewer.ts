import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'

/**
 * POST
 * @return userId Id if authenticated
 */
export default handler(async (req) => {
  // first make sure the method is post
  if (req.method !== 'POST') throw new NotImplementedError()

  const { userId } = await checkAuth(req.headers)

  if (userId && !isNaN(userId)) {
    return {
      userId,
    }
  }
  // no return above
  throw new UnauthenticatedError()
})
