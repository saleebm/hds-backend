import { Column } from 'material-table'
import Container from '@material-ui/core/Container'
import { Typography } from '@material-ui/core'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import { Location } from '@prisma/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'

import { useSnackbarContext } from '@Utils/reducers'
import { Employees } from '@Pages/dashboard/employees'
import { Table } from '@Components/Elements/Table'
import { RootStateType } from '@Store/modules/types'
import { CurrentUserType } from '@Store/modules/auth/action'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import mutator from '@Lib/server/mutator'
import { CreateEmployee } from '@Pages/api/v1/employees/create'
import { classNames } from '@Utils/common'

import styles from '@Components/Entities/tables.module.scss'

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

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      display: 'flex',
    },
    label: {
      margin: theme.spacing(1),
    },
  })
)

function EmployeesTable({ employees, currentUser }: EmployeesTable) {
  const classes = useStyles()
  const { toggleSnackbar } = useSnackbarContext()
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
  ) => Promise<void> = useCallback(
    async (newData) => {
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
    },
    [toggleSnackbar]
  )

  return (
    <Container
      maxWidth={'xl'}
      className={classNames(styles.tableContainer, classes.root)}
    >
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
    </Container>
  )
}

export default connect(mapStateToProps)(EmployeesTable)
