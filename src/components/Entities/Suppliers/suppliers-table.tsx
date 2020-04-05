import { Suppliers } from '@prisma/client'
import useSWR from 'swr'
import { Column } from 'material-table'

import { useSnackbarContext } from '@Utils/context'
import { Loading } from '@Components/Elements/Loading'
import Table from '@Components/Elements/Table/table'
import { useEffect } from 'react'
import { camelCaseToFormal } from '@Utils/common'
import { SuppliersProps } from '@Pages/dashboard/suppliers'

type SupplierData = {
  suppliers: ReadonlyArray<Suppliers>
}

type SuppliersTableKey = keyof Suppliers | 'tableData'

export function SuppliersTable({ suppliers }: SuppliersProps) {
  const { toggleSnackbar } = useSnackbarContext()
  const { data, error /* todo: isValidating, revalidate */ } = useSWR<
    SupplierData
  >('/api/v1/suppliers/all', undefined, {
    initialData: {
      suppliers: (Array.isArray(suppliers) && suppliers) || [],
    },
  })

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])

  if (!data || (data && data.suppliers && !Array.isArray(data.suppliers))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in keyof SuppliersTableKey]: any }>
  >> = Array.from(
    Object.keys(data.suppliers[0] as Suppliers) as SuppliersTableKey[]
  )
    .filter((key) => key !== 'tableData')
    .map((value) => {
      switch (value) {
        case 'idSupplier':
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
            value in data.suppliers[0] &&
            data.suppliers[0][value] &&
            typeof data.suppliers[0][value] === 'number'
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
      title={'Suppliers'}
      columns={columnData}
      data={data.suppliers as Suppliers[]}
    />
  )
}
