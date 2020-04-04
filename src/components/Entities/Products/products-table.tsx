import { InventoryGetPayload } from '@prisma/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Column } from 'material-table'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { Table as MaterialTable } from '@Components/Elements/Table'
import { Loading } from '@Components/Elements/Loading'
import { camelCaseToFormal } from '@Utils/common'
import { Products, ProductWithInventory } from '@Pages/dashboard/products'
import { Paper } from '@material-ui/core'

// i have no clue where this 'tableData' is coming from still...
type ProductKeys = keyof ProductWithInventory | 'tableData'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: theme.shadows['1'],
    minWidth: 650,
    backgroundColor: theme.palette.background.paper,
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    width: '100%',
  },
}))

export function ProductsTable({ products }: Products) {
  const classes = useStyles()

  if (!products || (products && !Array.isArray(products))) {
    return <Loading />
  }

  const columnData: Array<Column<
    Partial<{ [key in ProductKeys]: any }>
  >> = Array.from(
    Object.keys(products[0] as ProductWithInventory) as ProductKeys[]
  )
    .filter((key) => key !== 'tableData')
    .filter((key) => key !== 'inventory')
    .map((value: ProductKeys) => {
      switch (value) {
        case 'idProduct':
          return {
            title: 'PRODUCT ID',
            field: value,
            type: 'numeric',
            disableClick: true,
            editable: 'never',
            readonly: true,
          }
        case 'unitPrice':
        case 'listPrice':
        case 'deliveryPrice':
        case 'salePrice':
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
            value in products[0] &&
            products[0][value] &&
            typeof products[0][value] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  /**
   * todo editable functions
   */
  return (
    <MaterialTable
      editable={{
        onRowAdd: undefined,
        onRowUpdate: undefined,
        onRowDelete: undefined,
      }}
      optionsToMerge={{
        pageSize: 10,
      }}
      detailPanel={(rowData) => (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow color={'primary'}>
                <TableCell align={'justify'}>
                  <Typography variant={'h4'}>Location</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography variant={'h4'}>Aisle</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography variant={'h4'}>Bin #</Typography>
                </TableCell>
                <TableCell align={'center'}>
                  <Typography variant={'h4'}>Quantity on Hand</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowData as ProductWithInventory).inventory.map(
                (
                  inventoryDetails: Partial<
                    InventoryGetPayload<{
                      include: { storeLocations: boolean }
                    }>
                  >
                ) => (
                  <TableRow
                    key={inventoryDetails.idInventory}
                    className={classes.root}
                  >
                    <TableCell component="th" scope="row">
                      <Typography component={'p'} variant={'h4'}>
                        {inventoryDetails.storeLocations?.city}
                      </Typography>
                    </TableCell>

                    <TableCell align={'center'}>
                      <Typography component={'p'} variant={'body1'}>
                        {inventoryDetails.aisle}
                      </Typography>
                    </TableCell>
                    <TableCell align={'center'}>
                      <Typography component={'p'} variant={'body1'}>
                        {inventoryDetails.bin}
                      </Typography>
                    </TableCell>

                    <TableCell align={'center'}>
                      <Typography component={'p'} variant={'body1'}>
                        {inventoryDetails.quantityOnHand}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      title={'Products'}
      columns={columnData}
      data={products as ProductWithInventory[]}
    />
  )
}
