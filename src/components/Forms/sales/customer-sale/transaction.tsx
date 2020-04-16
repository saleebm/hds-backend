import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { setDeliveryAction } from '@Store/modules/customer-order/action'
import { RootAction } from '@Store/modules/root-action'
import { RootStateType } from '@Store/modules/types'
import { ProductWithInventory } from '@Pages/dashboard/products'

type Transaction = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    products: ReadonlyArray<ProductWithInventory>
  }

/**
 * Time to seal the deal.
 * 1. Choose product(s) to sell
 * 2. Let the employee pick the delivery date
 * 3. Show total. Calculated by the customer order store - todo don't forget the tax (6.5% tax)
 *
 * @param customerOrderState
 * @param setDeliveryDate
 * @constructor
 */
function Transaction({
  customerOrderState,
  setDeliveryDate,
  products,
}: Transaction) {
  return <></>
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
