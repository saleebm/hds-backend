import { GetStaticProps } from 'next'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { EmployeesTable } from '@Components/Entities/Employees'
import { DashboardView } from '@Components/Views/dashboard'

export type Employees = Array<ReturnType<typeof getEmpData>>

export interface EmployeesProps {
  employeeData: Employees
}

function EmployeesPage({ employeeData }: EmployeesProps) {
  return (
    <DashboardView pageTitle={'Employees'}>
      <EmployeesTable employees={employeeData} />
    </DashboardView>
  )
}

export const getStaticProps: GetStaticProps<EmployeesProps> = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const prismaClient = new PrismaClient()
  const employees = await prismaClient.employee.findMany()
  return {
    props: {
      employeeData: employees.map((emp) => ({ ...getEmpData(emp) })),
    },
  }
}
export default EmployeesPage
