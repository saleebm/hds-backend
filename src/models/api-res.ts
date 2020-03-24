import { LoginRequestSuccess } from '@Pages/api/v1/account/login'

export interface EmployeeRes {
  employee: {
    firstName: string
    lastName: string
    userId: number
    address: string
    city: string
    state: string
    zip: number
    role: string
    email: string
    phone: string
  }
}

export type LoginRes = LoginRequestSuccess