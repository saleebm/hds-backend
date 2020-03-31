import { useEffect, useMemo } from 'react'
import { Column, MTableEditField } from 'material-table'
import { Typography } from '@material-ui/core'
import { Employee, Location } from '@prisma/client'
import useSWR from 'swr'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { useSnackbarContext } from '@Utils/reducers'
import { Table } from '@Components/Elements/Table'
import mutator from '@Lib/server/mutator'
import { Loading } from '@Components/Elements/Loading'
import { camelCaseToFormal, parseLocaleNumber } from '@Utils/common'
import {
  CreateEmployeeBodyArgs,
  EmpDataForTable,
  EmployeesAllPayload,
  EmployeesBodyArgs,
  EmployeesTableProps,
  EmployeeTableColumnKeys,
} from '@Types/employees'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: theme.shadows['1'],
    minWidth: 'max-content',
  },
}))

/**
 * every entity is configured to useSWR with swrConfig at the Dashboard element surrounding each.
 *
 * @param locations Needed in order to give options to select for when creating employee
 * @param initialData initial ssr data
 * @constructor
 */
function EmployeesTable({ locations, initialData }: EmployeesTableProps) {
  const classes = useStyles()
  const {
    operationVariables,
  }: { operationVariables: EmployeesBodyArgs } = useMemo(
    () => ({
      operationVariables: {
        first: 10 /*todo use paging*/,
        include: {
          locationId: true,
          employeePosition: true,
        },
        forTable: true,
      },
    }),
    []
  )

  const { data, error, isValidating, revalidate } = useSWR<EmployeesAllPayload>(
    /** the array forces the post op */
    ['/api/v1/employees/all', operationVariables],
    async () =>
      await mutator<EmployeesAllPayload, EmployeesBodyArgs>(
        '/api/v1/employees/all',
        operationVariables
      ),
    {
      onError: async (err, key, config) => {
        console.error(err, key, config)
      },
      initialData: {
        employees: initialData.employees,
      },
    }
  )

  const { toggleSnackbar } = useSnackbarContext()

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])

  if (!data || (data && data.employees && !Array.isArray(data.employees))) {
    return <Loading />
  }

  /**
   * Maps out the column value to each data variable
   */
  const columnData: Array<Column<
    Partial<{ [key in EmployeeTableColumnKeys]: any }>
  >> = Array.from(
    Object.keys(
      data.employees[0] as Partial<Employee>
    ) as EmployeeTableColumnKeys[]
  )
    .filter((key) => key !== 'tableData')
    .map((value) => {
      switch (value) {
        case 'userId':
          // can not let this be editable! obv.
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            disableClick: true,
            editable: 'never',
            readonly: true,
          }
        case 'positionName':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'always',
            lookup: {
              PRESIDENT_CEO: 'PRESIDENT_CEO',
              VP_CEO: 'VP_CEO',
              STORE_MANAGER: 'STORE_MANAGER',
              OFFICE_MANAGER: 'OFFICE_MANAGER',
              SALES_DESIGN_MANAGER: 'SALES_DESIGN_MANAGER',
              SALES_DESIGN_ASSOCIATE: 'SALES_DESIGN_ASSOCIATE',
              SCHEDULING: 'SCHEDULING',
              TECHNICIAN: 'TECHNICIAN',
              DELIVERY: 'DELIVERY',
              WAREHOUSE: 'WAREHOUSE',
              INSTALLATIONS: 'INSTALLATIONS',
            },
          }
        case 'roleCapability':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'always',
            lookup: {
              READ_WRITE: 'READ_WRITE',
              READ: 'READ',
              NONE: 'NONE',
            },
          }
        case 'salary':
          return {
            title: 'Salary',
            type: 'currency',
            field: value,
            editable: 'always',
          }
        case 'locationId':
          return {
            title: 'LOCATION',
            field: value,
            editable: 'always',
            render: (rowData: Partial<{ locationId: Location }>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.locationId?.city}, ${rowData.locationId?.state} - ID #${rowData.locationId?.id}`,
                  }}
                />
              </Typography>
            ),
            lookup: locations.reduce((acc, curr) => {
              ;(acc as { [key: number]: string })[
                curr.id
              ] = `${curr.city}, ${curr.state} - ID#${curr.id}`
              return acc
            }, {}),
          }
        default:
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            editable: 'always',
            field: value,
            cellStyle: {
              whiteSpace: 'pre',
            },
            ...(value !== 'tableData' &&
            value in data.employees[0] &&
            data.employees[0][value] &&
            typeof data.employees[0][value] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  const onRowAdd: (newData: Partial<EmpDataForTable>) => Promise<void> = async (
    newData
  ) => {
    const {
      state,
      email,
      positionName,
      roleCapability,
      salary,
      firstName,
      address,
      city,
      lastName,
      phone,
      zip,
      locationId,
    } = newData
    const unformateedSalary = parseLocaleNumber((salary as string) || '')
    try {
      const createdUser = await mutator('/api/v1/employees/create', {
        state,
        locationId,
        phone,
        lastName,
        firstName,
        positionName,
        roleCapability,
        salary: unformateedSalary,
        email,
        address,
        city,
        zip,
      } as CreateEmployeeBodyArgs)
      // console.log(createdUser)
      if (createdUser?.userId) {
        await revalidate()
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
    <Table
      title={'Employees'}
      editable={{
        onRowAdd: onRowAdd,
        onRowUpdate: undefined,
        onRowDelete: undefined,
      }}
      isLoading={isValidating}
      columns={columnData}
      data={data.employees}
      components={{
        EditField: (props) => (
          <MTableEditField className={classes.root} {...props} />
        ),
      }}
      optionsToMerge={{
        toolbar: true,
        pageSize: 10,
      }}
    />
  )
}

export default EmployeesTable
