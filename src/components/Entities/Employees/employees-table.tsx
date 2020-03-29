import { useEffect, useMemo } from 'react'
import { Column } from 'material-table'
import { Typography } from '@material-ui/core'
import { Location } from '@prisma/client'
import useSWR from 'swr'

import { useSnackbarContext } from '@Utils/reducers'
import { Employees } from '@Pages/dashboard/employees'
import { Table } from '@Components/Elements/Table'
import { getEmpData } from '@Pages/api/v1/account/_get-emp-data'
import mutator from '@Lib/server/mutator'
import { CreateEmployee } from '@Pages/api/v1/employees/create'
import { Loading } from '@Components/Elements/Loading'
import { EmployeesBodyArgs } from '@Pages/api/v1/employees/all'
import { camelCaseToFormal } from '@Utils/common'

interface EmployeesData {
  readonly employees: Readonly<Employees>
}

interface EmployeesTable {
  readonly locations: ReadonlyArray<Location>
  readonly initialData: Readonly<Employees>
}

/**
 * every entity is configured to useSWR with swrConfig at the Dashboard element surrounding each.
 *
 * @param locations Needed in order to give options to select for when creating employee
 * @param initialData initial ssr data
 * @constructor
 */
function EmployeesTable({ locations, initialData }: EmployeesTable) {
  const {
    operationVariables,
  }: { operationVariables: EmployeesBodyArgs } = useMemo(
    () => ({
      operationVariables: {
        first: 30 /*todo use paging*/,
        include: {
          locationId: true,
        },
      },
    }),
    []
  )

  const { data, error, isValidating, revalidate } = useSWR<EmployeesData>(
    /** the array forces the post op */
    ['/api/v1/employees/all', operationVariables],
    async () =>
      await mutator<EmployeesData, EmployeesBodyArgs>(
        '/api/v1/employees/all',
        operationVariables
      ),
    {
      onError: async (err, key, config) => {
        console.error(err, key, config)
      },
      initialData: { employees: initialData },
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
  const columnData: Array<Column<any>> = Array.from(
    Object.keys(data.employees[0])
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
        case 'role':
          return {
            title: value.toUpperCase(),
            field: value,
            editable: 'always',
            lookup: { ADMIN: 'ADMIN', MODERATOR: 'MODERATOR' },
            initialEditValue: 'MODERATOR',
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
            ...(typeof data.employees[0] === 'number'
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
      data={(data.employees as unknown) as Object[]}
      optionsToMerge={{
        toolbar: true,
      }}
    />
  )
}

export default EmployeesTable
