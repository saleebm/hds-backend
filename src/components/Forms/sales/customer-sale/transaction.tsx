import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { setDeliveryAction } from '@Store/modules/customer-order/action'
import { RootAction } from '@Store/modules/root-action'
import { RootStateType } from '@Store/modules/types'
import { ProductWithInventory } from '@Pages/dashboard/products'
import ProductLookup from '@Components/Forms/sales/product-lookup/product-lookup'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'

type Transaction = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    products: ReadonlyArray<ProductWithInventory>
    storeLocationIdOptions: StoreLocationsIdOptions
    currentEmployee: FindOneEmployee // it would be nice to keep this full profile in a currentEmployee store instead of passing it down 10 components
  }

/**
 * Time to seal the deal.
 * 1. Choose product(s) to sell
 * 2. Let the employee pick the delivery date
 *
 */
function Transaction({
  customerOrderState,
  setDeliveryDate,
  products,
  currentEmployee,
  storeLocationIdOptions,
}: Transaction) {
  return (
    <>
      <ProductLookup
        storeLocationIdOptions={storeLocationIdOptions}
        products={products}
        currentEmployee={currentEmployee}
      />
    </>
  )
}

const mapStateToProps = (state: RootStateType) => ({
  customerOrderState: state.customerOrderReducer,
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setDeliveryDate: setDeliveryAction,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
