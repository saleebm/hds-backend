import { GetServerSideProps } from 'next'

import { getEmpDataForTable } from '@Pages/api/v1/account/_get-emp-data'
import { EmployeesTable } from '@Components/Entities/Employees'
import { DashboardView } from '@Components/Views/dashboard'
import { EmployeesPageProps } from '@Types/employees'

function EmployeesPage({ locations, employeeData }: EmployeesPageProps) {
  return (
    <DashboardView pageTitle={'Employees'}>
      <EmployeesTable locations={locations} initialData={employeeData} />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<EmployeesPageProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const employees = await prismaClient.employee.findMany({
    include: { locationId: true, employeePosition: true },
  })
  const locations = await prismaClient.location.findMany()

  const employeeData = {
    employees: employees.map((emp) => ({ ...getEmpDataForTable(emp) })),
  }
  return {
    props: {
      employeeData,
      locations,
    },
  }
}
export default EmployeesPage
