import React from 'react'
import MaterialTable, { Column } from 'material-table'

interface Row<P> {
  name: string
  props: P
}

interface TableFunctions<P> {
  onRowAdd?: (newData: Partial<Row<P>>) => Promise<any>
  onRowUpdate?: (
    newData?: Partial<Row<P>>,
    oldData?: Partial<Row<P>>
  ) => Promise<any>
  onRowDelete?: (oldData: Partial<Row<P>>) => Promise<any>
}

interface TableState<P> extends React.ComponentProps<typeof MaterialTable> {
  columns: Array<Column<Partial<Row<P>>>>
  data: Partial<Row<P>>[]
  functions: TableFunctions<P>
}

export default function Table<P>({
  columns,
  data,
  functions,
  ...rest
}: TableState<P>) {
  return (
    <MaterialTable
      {...rest}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: functions.onRowAdd,
        onRowUpdate: functions.onRowUpdate,
        onRowDelete: functions.onRowDelete,
      }}
    />
  )
}
