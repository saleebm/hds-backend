import { GetServerSideProps } from 'next'

import { EmployeesTable } from '@Components/Entities/Employees'
import { DashboardView } from '@Components/Views/dashboard'
import { EmployeesServerSideProps } from '@Types/employees'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'

function EmployeesPage({ locations, employeeData }: EmployeesServerSideProps) {
  const unparsedEmployeeData = JSON.parse(employeeData)
  return (
    <DashboardView pageTitle={'Employees'}>
      <EmployeesTable
        locations={locations}
        employeeData={unparsedEmployeeData}
      />
    </DashboardView>
  )
}

export const getServerSideProps: GetServerSideProps<EmployeesServerSideProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const employees = await prismaClient.employee.findMany({
    include: { storeLocations: true },
  })
  const locations = await prismaClient.storeLocations.findMany()

  const employeeData = {
    employees: employees.map((emp) => ({ ...getEmpData(emp) })),
  }
  return {
    props: {
      employeeData: JSON.stringify(employeeData),
      locations,
    },
  }
}
export default EmployeesPage
