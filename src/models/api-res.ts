import { LoginRequestSuccess } from '@Pages/api/v1/account/login'
import { EmployeePosition } from '@prisma/client'

export interface EmployeeRes {
  employee: {
    firstName: string
    lastName: string
    userId: number
    address: string
    city: string
    state: string
    zip: number
    employeePosition: EmployeePosition
    email: string
    phone: string
  }
}

export type LoginRes = LoginRequestSuccess
