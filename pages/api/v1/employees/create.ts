import { EmployeeCreateInput, PrismaClient } from '@prisma/client'
import { handler } from '@Lib/server'
import {
  DatabaseNotEquippedError,
  InvalidArgumentError,
  NotImplementedError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { checkAuth } from '@Pages/api/v1/account/_check-auth'
import { cryptoFactory } from '@Utils/crypto'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'

const prisma = new PrismaClient()

interface CreateEmployee extends EmployeeCreateInput {}

/**
 * post
 * Must be admin
 * @param CreateEmployee input ^
 * @return { userId: number } ID of employee created
 */
export default handler(async (req) => {
  if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

  const { userId, employee } = await checkAuth(req.headers)
  // throw if unauthenticated
  if (!userId || (userId && isNaN(userId)) || employee.role !== 'ADMIN') {
    // unauthorized
    // no userId from auth headers
    throw new UnauthenticatedError()
  }

  // invalid password supplied?
  if (
    !req.body.password ||
    (req.body.password && Array.isArray(req.body.password)
      ? req.body.password[0].length < 8
      : req.body.password.length < 8)
  ) {
    throw new InvalidArgumentError('Password must be 8 characters or greater')
  }

  // invalid role supplied??
  if (
    typeof req.body.role !== 'undefined' ||
    req.body.role !== 'ADMIN' ||
    req.body.role !== 'MODERATOR'
  )
    throw new InvalidArgumentError('Role can only be MODERATOR or ADMIN')

  // use a location as default
  const locations = await prisma.location.findMany()
  const defaultLocation =
    (Array.isArray(locations) && locations[0]) || undefined
  // if no location provided throw
  if (typeof defaultLocation === 'undefined' && !req.body.location) {
    throw new DatabaseNotEquippedError('Create a location first')
  }

  const {
    address,
    city,
    email,
    firstName,
    lastName,
    password,
    phone,
    role = 'MODERATOR',
    state,
    locationId = defaultLocation?.id,
    zip,
  } = req.body as CreateEmployee

  // encrypt pw
  const { hash } = await cryptoFactory.encryptUserPassword(password)
  const jwtUserSecret = await cryptoFactory.generateJWTSecret(32)

  try {
    const userCreated = await prisma.employee.create({
      data: {
        address,
        city,
        email,
        firstName,
        lastName,
        phone,
        role,
        state,
        locationId:
          typeof locationId === 'object'
            ? locationId
            : { connect: { id: locationId } },
        jwtUserSecret,
        password: hash,
        zip,
      },
      include: {
        // if location created anew, then include it in create op response
        locationId: typeof locationId === 'object',
      },
    })

    return {
      userId: userCreated.id,
      employee: getEmpData(userCreated),
    }
  } catch (e) {
    throw e
  }
})
