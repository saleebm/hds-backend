import { Employee, EmployeeCreateInput, StoreLocations } from '@prisma/client'

export type EmployeesWithStoreLocations = Employee & {
  storeLocations: StoreLocations
}

export type EmpDataFiltered = Omit<
  EmployeesWithStoreLocations,
  'userSigningSecret' | 'password'
>

// it gives salary as a string onRowAdd... so just in case...
export type SillyMaterialTable = Omit<EmpDataFiltered, 'salary'> & {
  salary: string | number
}

export type CreateEmployeeBodyArgs = { password?: string } & Omit<
  EmployeeCreateInput,
  'userSigningSecret' | 'password'
>

export type EmployeesAllPayload = {
  employees: EmpDataFiltered[]
}

export interface EmployeesPageProps {
  locations: StoreLocations[]
  employeeData: EmployeesAllPayload
}

export interface EmployeesServerSideProps {
  locations: StoreLocations[]
  employeeData: string
}

export type EmployeeTableColumnKeys = keyof EmpDataFiltered | 'tableData'

export type EmployeeCreated = Promise<{
  userId: number
  employee: EmpDataFiltered
}>
