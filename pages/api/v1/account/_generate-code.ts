import { randomBytes } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { hex2patq, patq2hex, isValidPatq } from 'urbit-ob'
import ms from 'ms'
import { InvalidArgumentError } from '@Lib/server/known-errors'

const KEY_LENGTH = 8 // bytes
const KEY_TIMEOUT = ms('1d') // 1 day to reset password

/**
 * Generate the magic code and stores it in user's tuple
 * @param id The user ID number
 * @param prisma
 * @return code Generated code to link to reset password page
 */
export const generateCode = async (id: number, prisma: PrismaClient) => {
  const hexStringType = randomBytes(KEY_LENGTH).toString('hex')

  // store the hex code in the db
  await prisma.employee.update({
    where: { id: id },
    data: {
      magicCode: {
        upsert: {
          update: { code: hexStringType },
          create: { code: hexStringType },
        },
      },
    },
  })

  // return encrypted hex code for url link
  return hex2patq(hexStringType)
}

/**
 * Server side util for validating user code
 * @param code The auth code to check
 * @param prisma
 */
export const getValidUserIdForCode = async (
  code: string,
  prisma: PrismaClient
): Promise<number> => {
  if (!code) {
    throw new InvalidArgumentError('Code is not provided')
  }
  // if not valid @q...
  if (!isValidPatq(code)) {
    throw new Error('Invalid code provided')
  }
  // decrypt @q to hex, and find it in the db
  const hexStringType = patq2hex(code)

  const magicCode = await prisma.magicCode.findOne({
    where: { code: hexStringType },
    select: { updatedAt: true, user: { select: { id: true } } },
  })

  // if code does not exist...
  // return invalid code error
  if (!magicCode) {
    throw new Error('No code found matching code requested')
  }

  // if code has expired...
  // return code expired error
  if (Date.now() > magicCode.updatedAt.getTime() + KEY_TIMEOUT) {
    throw new Error('Code is expired')
  }

  // otherwise it's valid, so delete the HEX CODE STRING, not the code.
  // I would know because I have failed every possible way
  await prisma.magicCode.delete({ where: { code: hexStringType } })

  // return user id
  return magicCode.user.id
}
