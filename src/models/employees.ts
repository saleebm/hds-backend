import {
  Employee,
  EmployeeCreateInput,
  EmployeePosition,
  FindManyEmployeeArgs,
  Location as StoreLocation,
  Location,
  PositionNames,
  Role,
} from '@prisma/client'

export type EmployeesBodyArgs = FindManyEmployeeArgs & {
  forTable?: boolean
}

export interface EmpDataFiltered {
  userId: number
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string | number
  email: string
  phone: string
  locationId?: Location
  employeePosition?: EmployeePosition
}

export interface EmpDataForTable
  extends Omit<EmpDataFiltered, 'employeePosition'> {
  locationId: Location
  salary: number | string
  roleCapability: Role
  positionName: PositionNames
}

export type CreateEmployeeBodyArgs = {
  password?: string
  jwtUserSecret?: string
  locationId: string | Location
  zip: string | number
  roleCapability: Role
  positionName: PositionNames
  salary?: number | string
} & Omit<
  EmployeeCreateInput,
  'password' | 'jwtUserSecret' | 'locationId' | 'zip' | 'employeePosition'
>

export type EmployeesTableDataProps = EmpDataForTable

export type EmployeesAllPayload = {
  employees: EmployeesTableDataProps[]
}

export interface EmployeesPageProps {
  locations: Location[]
  employeeData: EmployeesAllPayload
}

export interface EmployeesTableProps {
  locations: Location[]
  initialData: EmployeesAllPayload
}

export interface GetEmpDataForTableEmployee extends Employee {
  locationId: StoreLocation
  employeePosition: EmployeePosition
}

export interface GetEmpDataEmployee extends Employee {
  locationId?: StoreLocation
  employeePosition?: EmployeePosition
}

export type EmployeeTableColumnKeys =
  | keyof EmployeesTableDataProps
  | 'tableData'
