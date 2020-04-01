import { PrismaClient } from '@prisma/client'
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
import { generateCode } from '@Pages/api/v1/account/_generate-code'
import { sendEmail } from '@Lib/server/send-email'
import getApiHostUrl from '@Lib/server/get-api-host'
import { CreateEmployeeBodyArgs } from '@Types/employees'

const prisma = new PrismaClient()

/**
 * post
 * Must have read_write to create employee
 * @param CreateEmployee input ^
 * @return { userId: number } ID of employee created
 */
export default handler(async (req) => {
  if (req.method?.toLowerCase() !== 'post') throw new NotImplementedError()

  const { userId, employee } = await checkAuth(req.headers)
  // throw if unauthenticated
  if (!userId || employee.roleCapability !== 'READ_WRITE') {
    // unauthorized
    // no userId from auth headers or not admin
    throw new UnauthenticatedError()
  }

  //todo more stringent checking, since im in control of client, should be done there obv.
  // invalid password supplied? does not care if it is empty, that is handled below by generateDefaultPasswordOrReturn()
  if (req.body.password) {
    if (
      Array.isArray(req.body.password)
        ? req.body.password[0].length < 8
        : req.body.password.length < 8
    )
      throw new InvalidArgumentError('Password must be 8 characters or greater')
  }

  // use a location as default
  const locations = await prisma.storeLocations.findMany()
  const defaultLocation =
    (Array.isArray(locations) && locations[0]) || undefined
  // if no location provided throw
  if (typeof defaultLocation === 'undefined' && !req.body.location) {
    throw new DatabaseNotEquippedError('Create a location first')
  }

  // no password provided
  // generate default password
  const generateDefaultPasswordOrReturn = async () => {
    // no password provided?
    if (!req.body.password) {
      const defaultPassword = await cryptoFactory.generateDefaultSecret()
      return await cryptoFactory.encryptUserPassword(defaultPassword)
    }
    // else encrypt supplied password and return that
    return await cryptoFactory.encryptUserPassword(req.body.password)
  }

  // input body -
  // must be validated client side
  const {
    address,
    city,
    email,
    firstName,
    lastName,
    roleCapability,
    positionName,
    salary,
    state,
    zipCode,
    storeLocations = defaultLocation?.idStoreLocations,
    /*todo salesOrders and invoices*/
  } = req.body as CreateEmployeeBodyArgs

  // encrypt pw
  const { passwordHash } = await generateDefaultPasswordOrReturn()
  // generate some random secret unique to user for signing the jwt provided to them on login
  const jwtUserSecret = await cryptoFactory.generateJWTSecret(32)

  try {
    // creates the user
    // intellij giving issue with locationId to string
    // noinspection SuspiciousTypeOfGuard
    const userCreated = await prisma.employee.create({
      data: {
        address,
        city,
        email,
        firstName,
        lastName,

        roleCapability,
        positionName,
        salary: typeof salary === 'string' ? Number(salary) : salary ?? 32000.0,
        state,
        /** makes sure if location supplied is a number, then just connects it to that number */
        storeLocations:
          typeof storeLocations === 'object'
            ? storeLocations
            : {
                connect: {
                  idStoreLocations:
                    typeof storeLocations === 'string'
                      ? parseInt(storeLocations)
                      : defaultLocation?.idStoreLocations,
                },
              },
        userSigningSecret: jwtUserSecret,
        password: passwordHash,
        zipCode: typeof zipCode === 'string' ? parseInt(zipCode) : zipCode,
      },
      include: {
        /** if location created anew, then include it in create op response */
        storeLocations: true,
      },
    })

    // if no password was supplied and user has been created successfully
    // then now generate code. this has to be done after the user is created obv.
    if (!req.body.password && !!userCreated) {
      const hostname = getApiHostUrl(req)
      // first generate magicCode for user to go to reset password
      const magicCode = await generateCode(userCreated.employeeId, prisma)
      await sendEmail(userCreated.email, magicCode, hostname)
    }

    /**
     *  getEmpData prevents leaking of secure data to viewer, filtering out the user fields necessary
     */
    return {
      userId: userCreated.employeeId,
      employee: getEmpData(userCreated),
    }
  } catch (e) {
    throw e
  }
})
