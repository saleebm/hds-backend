import { Column } from 'material-table'
import Container from '@material-ui/core/Container'

import { Employees } from '@Pages/dashboard/employees'
import { Table } from '@Components/Elements/Table'

export default function ({ employees }: { employees: Employees }) {
  // console.log(employees)
  const columnData: Array<Column<any>> = Array.from(Object.keys(employees[0]))
    .filter((key) => key !== 'tableData')
    .map((value) => ({
      title: value.toUpperCase(),
      field: value,
      ...(Array.isArray(employees) &&
      value in employees[0] &&
      typeof employees[0] === 'number'
        ? { type: 'numeric' }
        : {}),
    }))

  return (
    <Container>
      <Table
        title={'Employees'}
        functions={{
          onRowAdd: undefined,
          onRowUpdate: undefined,
          onRowDelete: undefined,
        }}
        columns={columnData}
        data={employees as Partial<any>[]}
      />
    </Container>
  )
}
