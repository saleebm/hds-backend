import { Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ProductWithInventory } from '@Pages/dashboard/products'
import ProductLookup from '@Components/Forms/sales/product-lookup/product-lookup'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import { CustomerOrderProductsTable } from '@Components/Entities/CustomerOrderProducts'
import PriceCalculator from '@Components/Forms/sales/price-calculator'

//todo
// it would be nice to keep this full profile in a currentEmployee store instead of passing it down 10 components
type Transaction = {
  products: ReadonlyArray<ProductWithInventory>
  storeLocationIdOptions: StoreLocationsIdOptions
  currentEmployee: FindOneEmployee
}

const useStyles = makeStyles({
  priceCalc: {
    flex: 1,
  },
  orderTotalsAndDelivery: {
    height: '100%',
    position: 'relative',
  },
  root: {
    height: '600px',
  },
})

/**
 * Time to seal the deal.
 * 1. Choose product(s) to sell
 * 2. Let the employee pick the delivery date
 */
function Transaction({
  products,
  currentEmployee,
  storeLocationIdOptions,
}: Transaction) {
  const classes = useStyles()
  //todo
  // remove products and update quantity from the table with dispatch

  return (
    <Container disableGutters maxWidth={false} key={'transaction-wrapper'}>
      <ProductLookup
        storeLocationIdOptions={storeLocationIdOptions}
        products={products}
        currentEmployee={currentEmployee}
      />
      <Grid className={classes.root} container spacing={2} color={'primary'}>
        <Grid item xs={12} sm={7}>
          <CustomerOrderProductsTable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Grid
            className={classes.orderTotalsAndDelivery}
            container
            spacing={0}
            direction={'column'}
          >
            <Grid className={classes.priceCalc} item xs={12}>
              <PriceCalculator />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Transaction
