import useSWR from 'swr'
import { useEffect } from 'react'
import { Column } from 'material-table'
import { Typography } from '@material-ui/core'

import {
  Inventories,
  InventoriesData,
  Inventory,
} from '@Pages/dashboard/inventories'
import { useSnackbarContext } from '@Utils/context'
import { Loading } from '@Components/Elements/Loading'
import Table from '@Components/Elements/Table/table'
import { camelCaseToFormal } from '@Utils/common'
import { StoreLocations } from '@prisma/client'

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
        case 'product':
          return {
            title: 'PRODUCT BRAND AND MODEL',
            field: value,
            editable: 'never',
            render: (rowData) => (
              <Typography variant={'body2'}>
                <span
                  key={rowData.product.idProduct}
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.product.brand} - ${rowData.product.modelNumber}`,
                  }}
                />
              </Typography>
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
      optionsToMerge={{
        tableLayout: 'auto',
        showTextRowsSelected: true,
        pageSize: 10,
      }}
    />
  )
}
