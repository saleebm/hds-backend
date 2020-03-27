import { Column } from 'material-table'
import Container from '@material-ui/core/Container'
import { Typography } from '@material-ui/core'
import { useCallback } from 'react'
import { connect } from 'react-redux'

import { Employees } from '@Pages/dashboard/employees'
import { Table } from '@Components/Elements/Table'
import { RootStateType } from '@Store/modules/types'
import { CurrentUserType } from '@Store/modules/auth/action'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import { Location } from '@prisma/client'

interface EmployeesTable extends ReturnType<typeof mapStateToProps> {
  readonly employees: Readonly<Employees>
}

const mapStateToProps: (
  state: RootStateType
) => {
  currentUser: CurrentUserType | undefined
} = (state: RootStateType) => {
  return {
    currentUser: state.authReducer.currentUser,
  }
}

function EmployeesTable({ employees, currentUser }: EmployeesTable) {
  const { role } = currentUser || {}
  // console.log(employees)
  const columnData: Array<Column<any>> = Array.from(Object.keys(employees[0]))
    .filter((key) => key !== 'tableData')
    .map((value) => {
      switch (value) {
        case 'userId':
          return {
            title: value.toUpperCase(),
            field: value,
            disableClick: true,
            editable: 'never',
            readonly: true,
          }
        case 'role':
          return {
            title: value.toUpperCase(),
            field: value,
            editable: role === 'ADMIN' ? 'always' : 'never',
            lookup: { ADMIN: 'ADMIN', MODERATOR: 'MODERATOR' },
            initialEditValue: 'MODERATOR',
          }
        case 'locationId':
          return {
            title: 'LOCATION',
            field: value,
            editable: role === 'ADMIN' ? 'always' : 'never',
            render: (rowData: Partial<{ locationId: Location }>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.locationId?.city}, ${rowData.locationId?.state} - ID #${rowData.locationId?.id}`,
                  }}
                />
              </Typography>
            ),
            lookup: {
              /*todo actually do a rest hook here to get the options? */ MAIN: 1,
            },
          }
        default:
          return {
            title: value.toUpperCase(),
            editable: role === 'ADMIN' ? 'always' : 'never',
            field: value,
            ...(Array.isArray(employees) &&
            value in employees[0] &&
            typeof employees[0] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  const onRowAdd: (
    newData: Partial<Omit<ReturnType<typeof getEmpData>, 'userId'>>
  ) => Promise<void> = useCallback(async (newData) => {
    const {
      state,
      role,
      email,
      firstName,
      address,
      city,
      lastName,
      phone,
      zip,
      locationId,
    } = newData
  }, [])

  return (
    <Container>
      <Table<ReturnType<typeof getEmpData>>
        title={'Employees'}
        editable={{
          onRowAdd: role === 'ADMIN' ? onRowAdd : undefined,
          onRowUpdate: undefined,
          onRowDelete: undefined,
        }}
        columns={columnData}
        data={(employees as unknown) as Employees}
      />
      <Typography variant={'body1'}>
        Employee will be sent an email to reset password.
      </Typography>
    </Container>
  )
}

export default connect(mapStateToProps)(EmployeesTable)
