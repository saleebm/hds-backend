import { useEffect } from 'react'
import useSWR from 'swr'
import { Location } from '@prisma/client'
import { Column } from 'material-table'

import { Table } from '@Components/Elements/Table'
import { useSnackbarContext } from '@Utils/reducers'
import { Loading } from '@Components/Elements/Loading'
import { camelCaseToFormal } from '@Utils/common'

interface LocationsTable {
  locations: ReadonlyArray<Location>
}

type LocationsKey = keyof Location | 'tableData'

export function LocationsTable({ locations }: LocationsTable) {
  const { toggleSnackbar } = useSnackbarContext()
  const { data, error /* todo: isValidating, revalidate */ } = useSWR<
    LocationsTable
  >('/api/v1/locations/all', { initialData: { locations } })

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message: error.toString() || 'Oops, there was an error',
        isOpen: true,
        severity: 'error',
      })
    }
  }, [error, toggleSnackbar])

  if (!data || (data && data.locations && !Array.isArray(data.locations))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in keyof Location]: any }>
  >> = Array.from(Object.keys(data.locations[0] as Location) as LocationsKey[])
    .filter((key) => key !== 'tableData')
    .map((value: LocationsKey) => {
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
        default:
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            editable: 'always',
            field: value,
            ...(value !== 'tableData' &&
            value in data.locations[0] &&
            data.locations[0][value] &&
            typeof data.locations[0][value] === 'number'
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
      title={'Locations'}
      columns={columnData}
      data={data.locations as Location[]}
    />
  )
}
