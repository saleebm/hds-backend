import { Employee, PrismaClient } from '@prisma/client'

import { handler } from '@Lib/server'
import {
  MissingParameterError,
  UnauthenticatedError,
} from '@Lib/server/known-errors'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { cryptoFactory } from '@Utils/crypto'
import { EmpDataFiltered } from '@Types/employees'

const prisma = new PrismaClient()

export interface ResetPassword {
  newPassword: string
  userId: number
}
export interface ResetPasswordRes {
  success: boolean
  employee: EmpDataFiltered
}
/**
 * sends email to reset password
 * @param req.body.newPassword
 * @param req.body.userId
 * @returns { success: boolean, employee: the user updated }
 */
export default handler(async (req) => {
  if (!req.body.newPassword || !req.body.userId) {
    throw new MissingParameterError()
  }

  const employee = await prisma.employee.findOne({
    where: { employeeId: req.body.userId },
  })

  if (!employee) {
    throw new UnauthenticatedError()
  }

  // make sure to hash it so it is not plain text in the db
  // that would be bad
  const { passwordHash } = await cryptoFactory.encryptUserPassword(
    req.body.newPassword
  )

  try {
    const userWithNewPassword = await prisma.employee.update({
      where: { employeeId: employee.employeeId },
      data: {
        password: passwordHash,
      },
      include: {
        storeLocations: true,
      },
    })
    return {
      success: true,
      employee: getEmpData(userWithNewPassword),
    }
  } catch (e) {
    throw e
  }
})
