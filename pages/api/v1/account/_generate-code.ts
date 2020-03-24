import { randomBytes } from 'crypto'
import { PrismaClient } from '@prisma/client'
import { hex2patq, patq2hex, isValidPatq } from 'urbit-ob'
import ms from 'ms'

const KEY_LENGTH = 32 // bytes
const KEY_TIMEOUT = ms('1d') // 1 day to reset password
const prisma = new PrismaClient()

/**
 * Generate the magic code and stores it in user's tuple
 * @param id The user ID number
 * @return code Generated code to link to reset password page
 */
export const generateCode = async (id: number) => {
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

export const getValidUserIdForCode = async (
  code: string
): Promise<number | null> => {
  // if not valid @q...
  if (!isValidPatq(code)) {
    return null
  }
  // decrypt @q to hex, and find it in the db
  const hexStringType = patq2hex(code)

  const magicCode = await prisma.magicCode.findOne({
    where: { code: hexStringType },
    select: { updatedAt: true, user: { select: { id: true } } },
  })

  //todo
  // if code does not exist...
  // return invalid code error
  if (!magicCode) {
    return null
  }

  //todo
  // if code has expired...
  // return code expired error
  if (Date.now() > magicCode.updatedAt.getTime() + KEY_TIMEOUT) {
    return null
  }

  // otherwise it's valid, so delete it
  await prisma.magicCode.delete({ where: { code } })

  // return user id
  return magicCode.user.id
}
