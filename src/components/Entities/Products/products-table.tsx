import { Product } from '@prisma/client'
import { Table } from '@Components/Elements/Table'
import { useSnackbarContext } from '@Utils/reducers'
import useSWR from 'swr'
import { useEffect } from 'react'
import { Loading } from '@Components/Elements/Loading'
import { Column } from 'material-table'
import { camelCaseToFormal } from '@Utils/common'

interface ProductsTable {
  products: ReadonlyArray<Product>
}

// i have no clue where this 'tableData' is coming from still...
type ProductKeys = keyof Product | 'tableData'

export function ProductsTable({ products }: ProductsTable) {
  const { toggleSnackbar } = useSnackbarContext()
  const { data, error /* todo: isValidating, revalidate */ } = useSWR<
    ProductsTable
  >('/api/v1/products/all', { initialData: { products } })

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])

  if (!data || (data && data.products && !Array.isArray(data.products))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in ProductKeys]: any }>
  >> = Array.from(Object.keys(data.products[0] as Product) as ProductKeys[])
    .filter((key) => key !== 'tableData')
    .map((value: ProductKeys) => {
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
        case 'unitCost':
        case 'listPrice':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'always',
            type: 'currency',
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
            value in data.products[0] &&
            data.products[0][value] &&
            typeof data.products[0][value] === 'number'
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
        pageSize: 10,
      }}
      title={'Products'}
      columns={columnData}
      data={data.products as Product[]}
    />
  )
}
