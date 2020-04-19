import { connect } from 'react-redux'
import { RootAction } from '@Store/modules/root-action'
import { bindActionCreators, Dispatch } from 'redux'
import { setDeliveryAction } from '@Store/modules/customer-order/action'

function DeliveryDatePicker() {
  return <></>
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ setDeliveryDate: setDeliveryAction }, dispatch)

export default connect(null, mapDispatchToProps)(DeliveryDatePicker)
