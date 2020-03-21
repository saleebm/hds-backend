import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  MissingParameterError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { AuthTokenSecurity } from '@Lib/server/auth-token-security'
import { getEnv } from '@Pages/api/v1/account/_get-env'
import { getAccessToken } from '@Pages/api/v1/account/_get-access-token'

const prisma = new PrismaClient()

/**
 * POST
 * @param req.body.refreshToken
 * @return accessToken
 */
export default handler(async (req) => {
  // first make sure the method is post
  if (req.method !== 'POST') throw new NotImplementedError()

  if (!req.body || !req.body.refreshToken) throw new MissingParameterError()

  const refreshToken = req.body.refreshToken
  const userDataDecoded = await AuthTokenSecurity.decode(refreshToken)
  const { signingSignature } = getEnv()

  // the refreshToken contains the userSecret as verification and the subject is the userId
  if (
    !!userDataDecoded &&
    typeof userDataDecoded === 'object' &&
    'jti' in userDataDecoded && // jti is the jwtid
    'sub' in userDataDecoded &&
    'userId' in userDataDecoded
  ) {
    // subject is set to userId for triple double super loopy verification. todo
    const empId = parseInt(userDataDecoded.sub)

    //todo probably could cut this down in half
    // too redundant
    // do it later when mind is running right
    if (!isNaN(empId)) {
      const emp = await prisma.employee.findOne({ where: { id: empId } })
      // again the quadruple mega verification, so i can sleep tight
      if (!!emp && emp.jwtUserSecret === userDataDecoded.jti) {
        // employee is still in system...
        const userMetadataVerified = await AuthTokenSecurity.verify({
          token: refreshToken,
          envSigningSecret: signingSignature,
          userJwtSecret: emp.jwtUserSecret,
        })
        if (userMetadataVerified) {
          const accessToken = await getAccessToken({
            jwtid: emp.jwtUserSecret,
            userId: emp.id,
            signingSecret: signingSignature,
          })
          return {
            accessToken,
          }
        }
      }
    }
  }
  // no return above
  throw new UnauthenticatedError()
})
