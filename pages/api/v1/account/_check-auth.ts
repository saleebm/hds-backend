/**
 * internal api util
 * anything prefixed with _ is hidden
 * utility to check for auth
 **/
import { IncomingHttpHeaders } from 'http'
import { UnauthenticatedError } from '@Lib/server/known-errors'
import { PrismaClient } from '@prisma/client'
import { AuthTokenSecurity } from '@Lib/server/auth-token-security'
import { getEnv } from '@Pages/api/v1/account/_get-env'

const prisma = new PrismaClient()

/**
 * returns userId if authenticated, wrap with try catch for token decryption may throw an exception
 * @param headers
 */
export const checkAuth = async (headers: IncomingHttpHeaders) => {
  const authHeader = headers.Authorization || headers.authorization
  const { signingSignature } = getEnv()

  // bail early if no cookies or auth headers
  //todo also check for req.cookies and use for auth
  if (!authHeader) throw new UnauthenticatedError()

  const bearerToken = Array.isArray(authHeader) ? authHeader[0] : authHeader

  if (bearerToken && bearerToken.split(' ')[0] === 'Bearer') {
    // console.log(bearerToken)
    const token = bearerToken.split(' ')[1]
    const userDataDecoded = await AuthTokenSecurity.decode(token)

    // make sure this is properly handled and that userId is in the object payload
    if (
      !!userDataDecoded &&
      typeof userDataDecoded === 'object' &&
      'userId' in userDataDecoded
    ) {
      // prisma lookup for the employee by id
      const emp = await prisma.employee.findOne({
        where: { id: userDataDecoded.userId },
      })
      if (!!emp) {
        // now we verify the jwt using the signature and jwt token which is set as the jwtid
        const userIdVerified = await AuthTokenSecurity.verify({
          token,
          envSigningSecret: signingSignature,
          userJwtSecret: emp.jwtUserSecret,
        })

        return {
          userId: userIdVerified.userId,
          jwtUserSecret: emp.jwtUserSecret,
          // return it diligently since fields unchecked in db for auth access rights
          employee: emp,
        }
      }
    }
  }
  // code path above does not return anything so throw
  throw new UnauthenticatedError()
}
