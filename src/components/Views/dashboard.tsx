import { EmployeesTable } from '@Components/Entities/Employees'
import Typography from '@material-ui/core/Typography'

export function DashboardView() {
  return (
    <>
      <Typography variant={'h2'}>Dashboard</Typography>
      <EmployeesTable />
    </>
  )
}
