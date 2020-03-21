import { PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { AuthTokenSecurity } from '@Lib/server/auth-token-security'

const prisma = new PrismaClient()

export default handler(async (req) => {
  const { headers } = req
  const authHeader = headers.Authorization || headers.authorization
  // first make sure the method is post
  if (req.method !== 'POST') throw new NotImplementedError()

  // also bail early if no cookies or auth headers
  //todo also check for req.cookies and use for auth
  if (!authHeader) throw new UnauthenticatedError()

  const signingSignature = process.env.TOKEN_SIGNING_SECRET
  // token signing secret must be in env
  if (!signingSignature) {
    throw new Error('Server misconfiguration')
  }

  const bearerToken = Array.isArray(authHeader) ? authHeader[0] : authHeader
  // if the header has the auth bearer
  if (bearerToken && bearerToken.split(' ')[0] === 'Bearer') {
    const token = bearerToken.split(' ')[1]
    try {
      // simply decode the user data, https://github.com/auth0/node-jsonwebtoken#jwtdecodetoken--options
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
        if (emp) {
          // now we verify the jwt using the signature and jwt token which is set as the jwtid
          const userIdVerified = await AuthTokenSecurity.verify({
            token,
            userSigningSecret: signingSignature,
            userJwtSecret: emp.jwtUserSecret,
          })
          if (userIdVerified.userId) {
            return {
              userId: userIdVerified.userId,
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      // https://github.com/auth0/node-jsonwebtoken#errors--codes
      throw new UnauthenticatedError()
    }
  }
  throw new UnauthenticatedError()
})
