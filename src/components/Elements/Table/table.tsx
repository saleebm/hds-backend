import { connect } from 'react-redux'
import React, { forwardRef, Ref } from 'react'
import dynamic from 'next/dynamic'
import merge from 'lodash.merge'
import { MaterialTableProps, Options } from 'material-table'
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

import { RootStateType } from '@Store/modules/types'
import { CurrentUserType } from '@Store/modules/auth/action'

const MaterialTable = dynamic(() => import('material-table'), { ssr: false })

const tableIcons = {
  Add: forwardRef((props, ref: Ref<any>) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref: Ref<any>) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref: Ref<any>) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref: Ref<any>) => (
    <DeleteOutline {...props} ref={ref} />
  )),
  DetailPanel: forwardRef((props, ref: Ref<any>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref: Ref<any>) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref: Ref<any>) => (
    <SaveAlt {...props} ref={ref} />
  )),
  Filter: forwardRef((props, ref: Ref<any>) => (
    <FilterList {...props} ref={ref} />
  )),
  FirstPage: forwardRef((props, ref: Ref<any>) => (
    <FirstPage {...props} ref={ref} />
  )),
  LastPage: forwardRef((props, ref: Ref<any>) => (
    <LastPage {...props} ref={ref} />
  )),
  NextPage: forwardRef((props, ref: Ref<any>) => (
    <ChevronRight {...props} ref={ref} />
  )),
  PreviousPage: forwardRef((props, ref: Ref<any>) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref: Ref<any>) => (
    <Clear {...props} ref={ref} />
  )),
  Search: forwardRef((props, ref: Ref<any>) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref: Ref<any>) => (
    <ArrowDownward {...props} ref={ref} />
  )),
  ThirdStateCheck: forwardRef((props, ref: Ref<any>) => (
    <Remove {...props} ref={ref} />
  )),
  ViewColumn: forwardRef((props, ref: Ref<any>) => (
    <ViewColumn {...props} ref={ref} />
  )),
}

type TableState<P extends object> = MaterialTableProps<P> &
  ReturnType<typeof mapStateToProps> & {
    optionsToMerge?: Options
  }

const mapStateToProps: (
  state: RootStateType
) => {
  currentUser: CurrentUserType | undefined
} = (state: RootStateType) => {
  return {
    currentUser: state.authReducer.currentUser,
  }
}
function Table<P extends object>({
  columns,
  data,
  editable,
  currentUser,
  optionsToMerge = {},
  ...rest
}: TableState<P>) {
  const { role } = currentUser || {}

  const opts = merge(
    {},
    {
      addRowPosition: 'last',
      draggable: false, // turning this on makes some wierd errors pop up from react-dnd
      columnsButton: true,
      actionsColumnIndex: -1,
      sorting: true,
      thirdSortClick: true,
    },
    optionsToMerge
  )
  return (
    // @ts-ignore
    <MaterialTable
      {...rest}
      icons={tableIcons}
      columns={columns as any}
      data={data as any}
      options={opts}
      isLoading={!data}
      editable={role && role !== 'READ_WRITE' ? false : (editable as any)}
    />
  )
}

export default connect(mapStateToProps)(Table)
