import { handler } from '@Lib/server'
import { InvalidCodeError } from '@Lib/server/known-errors'
import { getValidUserIdForCode } from '@Pages/api/v1/account/_generate-code'

// post
//todo
// check code for authenticity and updates user's password
export default handler(async (req) => {
  // get code from body
  const { code } = req.body
  // pull user from magic link
  const userId = await getValidUserIdForCode(code)
  if (!userId) {
    throw new InvalidCodeError()
  }

  // todo
  return {

  }
})
