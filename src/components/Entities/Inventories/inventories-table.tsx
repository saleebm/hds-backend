import useSWR from 'swr'
import { useEffect } from 'react'
import { Column } from 'material-table'
import { Typography } from '@material-ui/core'

import {
  Inventories,
  InventoriesData,
  Inventory,
} from '@Pages/dashboard/inventories'
import { useSnackbarContext } from '@Utils/reducers'
import { Loading } from '@Components/Elements/Loading'
import Table from '@Components/Elements/Table/table'
import { camelCaseToFormal } from '@Utils/common'
import { Product, StoreLocations } from '@prisma/client'

type InventoriesTableKey = keyof Inventory | 'tableData'

export function InventoriesTable({ inventories, locations }: InventoriesData) {
  const { toggleSnackbar } = useSnackbarContext()
  const { data, error /* todo: isValidating, revalidate */ } = useSWR<{
    inventories: Inventories
  }>('/api/v1/inventories/all', undefined, {
    initialData: {
      inventories: (Array.isArray(inventories) && inventories) || [],
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

  if (!data || (data && data.inventories && !Array.isArray(data.inventories))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in keyof Inventory]: any }>
  >> = Array.from(
    Object.keys(data.inventories[0] as Inventory) as InventoriesTableKey[]
  )
    .filter((key) => key !== 'tableData')
    .map((value) => {
      switch (value) {
        case 'idInventory':
          return {
            title: 'INVENTORY ID',
            field: value,
            type: 'numeric',
            disableClick: true,
            editable: 'never',
            readonly: true,
          }
        case 'productOfInventory':
          return {
            title: 'PRODUCT BRAND AND MODEL',
            field: value,
            editable: 'never',
            render: (rowData) => (
              <>
                {Array.isArray(rowData.productOfInventory) ? (
                  <Typography variant={'body2'}>
                    <>
                      {rowData.productOfInventory?.map((product: Product) => (
                        <span
                          key={product.idProduct}
                          dangerouslySetInnerHTML={{
                            __html: `${product.brand} - $${product.modelNumber}`,
                          }}
                        />
                      ))}
                    </>
                  </Typography>
                ) : (
                  <Typography variant={'body2'}>
                    <span
                      key={rowData.productOfInventory.idProduct}
                      dangerouslySetInnerHTML={{
                        __html: `${rowData.productOfInventory.brand} - $${rowData.productOfInventory.modelNumber}`,
                      }}
                    />
                  </Typography>
                )}
              </>
            ),
          }
        /**todo refactor duplicates */
        case 'storeLocations':
          return {
            title: 'LOCATION',
            field: value,
            editable: 'always',
            render: (rowData) =>
              Array.isArray(rowData.storeLocations) ? (
                <Typography variant={'body2'}>
                  <>
                    {rowData.storeLocations?.map((loc: StoreLocations) => (
                      <span
                        key={loc.idStoreLocations}
                        dangerouslySetInnerHTML={{
                          __html: `${loc.city}, ${loc.state} - ID #${loc.idStoreLocations}`,
                        }}
                      />
                    ))}
                  </>
                </Typography>
              ) : (
                <Typography variant={'body2'}>
                  <span
                    key={rowData.storeLocations.idStoreLocations}
                    dangerouslySetInnerHTML={{
                      __html: `${rowData.storeLocations.city}, ${rowData.storeLocations.state} - ID #${rowData.storeLocations.idStoreLocations}`,
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
            ...(value !== 'tableData' &&
            value in data.inventories[0] &&
            data.inventories[0][value] &&
            typeof data.inventories[0][value] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  /**
   * todo editable functions, at least delete for here
   */
  return (
    <Table
      editable={{
        onRowAdd: undefined,
        onRowUpdate: undefined,
        onRowDelete: undefined,
      }}
      title={'Inventories'}
      columns={columnData}
      data={(data.inventories as unknown) as Inventory[]}
      optionsToMerge={{ tableLayout: 'auto' }}
    />
  )
}
