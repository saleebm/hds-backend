import { GetServerSideProps } from 'next'
import { Location } from '@prisma/client'

import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmployeesTable } from '@Components/Entities/Employees'
import { DashboardView } from '@Components/Views/dashboard'

export type Employees = ReadonlyArray<ReturnType<typeof getEmpData>>

export interface EmployeesProps {
  readonly locations: ReadonlyArray<Location>
  readonly employeeData: Employees
}

function EmployeesPage({ locations, employeeData }: EmployeesProps) {
  return (
    <DashboardView pageTitle={'Employees'}>
      <EmployeesTable locations={locations} initialData={employeeData} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<EmployeesProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const employees = await prismaClient.employee.findMany({
    include: { locationId: true },
  })
  const locations = await prismaClient.location.findMany()

  const employeeData = employees.map((emp) => ({ ...getEmpData(emp) }))
  return {
    props: {
      employeeData,
      locations,
    },
  }
}
export default EmployeesPage
