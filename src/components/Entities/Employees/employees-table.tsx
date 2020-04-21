import { useEffect, useMemo } from 'react'
import { Column, MTableEditField } from 'material-table'
import { Typography } from '@material-ui/core'
import useSWR from 'swr'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { useSnackbarContext } from '@Utils/context'
import { Table } from '@Components/Elements/Table'
import mutator from '@Lib/server/mutator'
import { Loading } from '@Components/Elements/Loading'
import { camelCaseToFormal, parseLocaleNumber } from '@Utils/common'
import {
  CreateEmployeeBodyArgs,
  EmpDataFiltered,
  EmployeeCreated,
  EmployeesAllPayload,
  EmployeesPageProps,
  EmployeeTableColumnKeys,
  SillyMaterialTable,
} from '@Types/employees'
import { FindManyEmployeeArgs } from '@prisma/client'

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
function EmployeesTable({ locations, employeeData }: EmployeesPageProps) {
  const classes = useStyles()
  const {
    operationVariables,
  }: { operationVariables: FindManyEmployeeArgs } = useMemo(
    () => ({
      operationVariables: {
        include: {
          storeLocations: true,
        },
      },
    }),
    []
  )

  const { data, error, isValidating, revalidate } = useSWR<EmployeesAllPayload>(
    /** the array forces the post op */
    ['/api/v1/employees/all', operationVariables],
    async () =>
      await mutator<EmployeesAllPayload, FindManyEmployeeArgs>(
        '/api/v1/employees/all',
        operationVariables
      ),
    {
      onError: async (err, key, config) => {
        console.error(err, key, config)
      },
      initialData: {
        employees: employeeData.employees,
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
  const columnData: Array<Column<Partial<EmpDataFiltered>>> = Array.from(
    Object.keys(
      data.employees[0] as EmpDataFiltered
    ) as EmployeeTableColumnKeys[]
  )
    .filter((key) => key !== 'tableData')
    .filter((key) => key !== 'storeLocationId')
    .map((value) => {
      switch (value) {
        case 'employeeId':
          // can not let this be editable! obv.
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            disableClick: true,
            editable: 'never',
            readonly: true,
          }
        case 'createdAt':
        case 'updatedAt':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'never',
            readonly: true,
            type: 'datetime',
          }
        case 'positionName':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'always',
            lookup: {
              PRESIDENT_CEO: 'President, CEO',
              VP_CEO: 'VP, CEO',
              STORE_MANAGER: 'Store Manager',
              OFFICE_MANAGER: 'Office Manager',
              SALES_DESIGN_MANAGER: 'Sales Design Manager',
              SALES_DESIGN_ASSOCIATE: 'Sales Design Associate',
              SCHEDULING: 'Scheduling',
              TECHNICIAN: 'Technician',
              DELIVERY: 'Delivery',
              WAREHOUSE: 'Warehouse',
              INFORMATION_TECHNOLOGY: 'Information Technology',
              INSTALLATIONS: 'Installations',
              INSTALLATIONS_DELIVERIES: 'Installations and Deliveries',
              INSTALLATIONS_DELIVERIES_SALES:
                'Installations, Deliveries, and Sales',
              NOT_ASSIGNED: 'Not assigned',
              WAREHOUSE_INSTALLATIONS_DELIVERIES:
                'Installations, Deliveries, and Warehouse',
              WAREHOUSE_DELIVERIES: 'Warehouse and Deliveries',
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
        case 'storeLocations':
          // this is a number, the store location ID. I screwed up the database. todo fix naming
          return {
            title: 'LOCATION',
            field: value,
            editable: 'always',
            render: (rowData: Partial<EmpDataFiltered>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.storeLocations?.city}, ${rowData.storeLocations?.state} - ID #${rowData.storeLocations?.idStoreLocations}`,
                  }}
                />
              </Typography>
            ),
            lookup: locations.reduce((acc, curr) => {
              ;(acc as { [key: number]: string })[
                curr.idStoreLocations
              ] = `${curr.city}, ${curr.state} - ID#${curr.idStoreLocations}`
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

  const onRowAdd: (
    newData: Partial<SillyMaterialTable>
  ) => Promise<void> = async (newData) => {
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
      zipCode,
      storeLocations, // number
    } = newData

    // console.log(newData)
    // material table returns back salary as a string since its a currency type above, but sometimes a user can enter a number as well and it just returns the number
    const formattedSalary =
      typeof salary === 'string' ? parseLocaleNumber(salary) : salary

    try {
      const createdUser = await mutator<
        EmployeeCreated,
        CreateEmployeeBodyArgs
      >('/api/v1/employees/create', {
        state,
        lastName,
        firstName,
        positionName,
        roleCapability,
        salary: formattedSalary,
        email,
        address,
        city,
        zipCode,
        storeLocations: {
          connect: {
            idStoreLocations:
              typeof storeLocations === 'string'
                ? parseInt(storeLocations)
                : storeLocations,
          },
        },
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
