import { Column } from 'material-table'
import { Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { Location } from '@prisma/client'

import { useSnackbarContext } from '@Utils/reducers'
import { Employees } from '@Pages/dashboard/employees'
import { Table } from '@Components/Elements/Table'
import { RootStateType } from '@Store/modules/types'
import { CurrentUserType } from '@Store/modules/auth/action'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import mutator from '@Lib/server/mutator'
import { CreateEmployee } from '@Pages/api/v1/employees/create'
import { useEffect } from 'react'

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
  const { toggleSnackbar } = useSnackbarContext()
  const { role } = currentUser || {}

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
              /*todo actually do a rest hook here to get the options? */
              1: 'Phoenix, AZ.',
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
  ) => Promise<void> = async (newData) => {
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

    try {
      const createdUser = await mutator('/api/v1/employees/create', {
        state,
        role,
        locationId,
        phone,
        lastName,
        firstName,
        email,
        address,
        city,
        zip,
      } as CreateEmployee)
      console.log(createdUser)
      if (createdUser?.userId) {
        toggleSnackbar({
          message: `Employee created with user ID #${createdUser.userId} and will be sent an email to reset password.`,
          isOpen: true,
          severity: 'success',
        })
      }
    } catch (e) {
      toggleSnackbar({
        message: e.toString(),
        severity: 'error',
        isOpen: true,
      })
    }
  }

  return (
    <>
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
    </>
  )
}

export default connect(mapStateToProps)(EmployeesTable)
