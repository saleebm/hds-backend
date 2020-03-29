import { Supplier } from '@prisma/client'
import useSWR from 'swr'
import { Column } from 'material-table'

import { useSnackbarContext } from '@Utils/reducers'
import { Loading } from '@Components/Elements/Loading'
import Table from '@Components/Elements/Table/table'
import { useEffect } from 'react'
import { camelCaseToFormal } from '@Utils/common'
import { Suppliers } from '@Pages/dashboard/suppliers'

type SupplierData = {
  suppliers: ReadonlyArray<Supplier>
}

export function SuppliersTable({ suppliers }: Suppliers) {
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

  const columnData: Array<Column<{}>> | undefined = Array.from(
    Object.keys(data.suppliers[0])
  )
    .filter((key) => key !== 'tableData')
    .map((value) => {
      switch (value) {
        case 'id':
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
            title: value.toUpperCase(),
            editable: 'always',
            field: value,
            ...(Array.isArray(data) &&
            value in data[0] &&
            typeof data[0] === 'number'
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
      data={data.suppliers as Supplier[]}
    />
  )
}