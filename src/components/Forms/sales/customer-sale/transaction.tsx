import React, { useCallback } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ProductWithInventory } from '@Pages/dashboard/products'
import ProductLookup from '@Components/Forms/sales/product-lookup/product-lookup'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import { CustomerOrderProductsTable } from '@Components/Entities/CustomerOrderProducts'
import Receipt from '@Components/Forms/sales/receipt'
import { CustomerOrderProductInCart } from '@Types/customer-order'
import { RootAction } from '@Store/modules/root-action'
import {
  removeProductOrderInCustomerSaleAction,
  updateOrderProductQuantityAction,
} from '@Store/modules/customer-order/action'
import { connect } from 'react-redux'
import DeliveryDatePicker from '@Components/Forms/sales/delivery-date-picker'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

type Transaction = {
  products: ReadonlyArray<ProductWithInventory>
  storeLocationIdOptions: StoreLocationsIdOptions
  currentEmployee: FindOneEmployee
} & ReturnType<typeof mapDispatchToProps>

const useStyles = makeStyles((theme) => ({
  priceCalc: {
    flex: 1,
  },
  orderTotalsAndDelivery: {
    height: '100%',
    position: 'relative',
  },
  root: {
    height: '100%',
  },
  productTableWrap: {
    marginBottom: theme.spacing(3),
    height:
      '100%' /* make sure the delete button does not cause the other elements below to move awkwardly */,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },
  paper: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
}))

/**
 * Time to seal the deal.
 * 1. Choose product(s) to sell
 * 2. Let the employee pick the delivery date
 */
function Transaction({
  products,
  currentEmployee,
  storeLocationIdOptions,
  removeProduct,
  updateProduct,
}: Transaction) {
  const classes = useStyles()

  const onRowDelete = useCallback(
    async (deletedRow: Partial<CustomerOrderProductInCart>) => {
      if (deletedRow && deletedRow.id) {
        removeProduct(deletedRow.id)
      }
    },
    [removeProduct]
  )

  const onRowUpdate = useCallback(
    async (
      updatedRow: Partial<{ quantity: number | string; id: number | string }>
    ) => {
      if (updatedRow && updatedRow.id && updatedRow.quantity) {
        const quantity =
          typeof updatedRow.quantity === 'string'
            ? parseInt(updatedRow.quantity)
            : updatedRow.quantity
        const productId =
          typeof updatedRow.id === 'string'
            ? parseInt(updatedRow.id)
            : updatedRow.id

        updateProduct({ quantity, productId })
      }
    },
    [updateProduct]
  )

  return (
    <Container disableGutters maxWidth={false} key={'transaction-wrapper'}>
      <Grid className={classes.productTableWrap} container spacing={3}>
        <Grid item>
          <Typography variant={'h2'}>Transaction</Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomerOrderProductsTable
            onRowUpdate={onRowUpdate}
            onRowDelete={onRowDelete}
          />
        </Grid>
      </Grid>
      <Grid className={classes.root} container spacing={2} color={'primary'}>
        <Grid item xs={12} sm={7}>
          <Grid container spacing={3} alignItems={'center'} justify={'center'}>
            <Grid item xs={12}>
              <Paper
                variant={'outlined'}
                className={classes.paper}
                elevation={5}
              >
                <ProductLookup
                  storeLocationIdOptions={storeLocationIdOptions}
                  products={products}
                  currentEmployee={currentEmployee}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <DeliveryDatePicker />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Grid
            className={classes.orderTotalsAndDelivery}
            container
            spacing={0}
            direction={'column'}
          >
            <Grid className={classes.priceCalc} item xs={12}>
              <Receipt />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      removeProduct: removeProductOrderInCustomerSaleAction,
      updateProduct: updateOrderProductQuantityAction,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(Transaction)
