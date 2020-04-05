import { Customer } from '@prisma/client'
import { Table } from '@Components/Elements/Table'
import { useSnackbarContext } from '@Utils/context'
import useSWR from 'swr'
import { useEffect } from 'react'
import { Loading } from '@Components/Elements/Loading'
import { Column } from 'material-table'
import { camelCaseToFormal } from '@Utils/common'

interface CustomersTable {
  customers: ReadonlyArray<Customer>
}

type CustomersKey = keyof Customer | 'tableData'

export function CustomersTable({ customers }: CustomersTable) {
  const { toggleSnackbar } = useSnackbarContext()
  const { data, error /* todo: isValidating, revalidate */ } = useSWR<
    CustomersTable
  >('/api/v1/customers/all', { initialData: { customers } })

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])

  if (!data || (data && data.customers && !Array.isArray(data.customers))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in keyof Customer]: any }>
  >> = Array.from(Object.keys(data.customers[0] as Customer) as CustomersKey[])
    .filter((key) => key !== 'tableData')
    .map((value: CustomersKey) => {
      switch (value) {
        case 'idCustomer':
          return {
            title: value.toUpperCase(),
            field: value,
            type: 'numeric',
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
        default:
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            editable: 'always',
            field: value,
            ...(value !== 'tableData' &&
            value in data.customers[0] &&
            data.customers[0][value] &&
            typeof data.customers[0][value] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  /**
   * todo editable functions
   */
  return (
    <Table
      editable={{
        onRowAdd: undefined,
        onRowUpdate: undefined,
        onRowDelete: undefined,
      }}
      optionsToMerge={{
        pageSize: 20,
      }}
      title={'Customers'}
      columns={columnData}
      data={data.customers as Customer[]}
    />
  )
}
