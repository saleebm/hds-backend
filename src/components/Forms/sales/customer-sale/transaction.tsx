import { RootAction } from '@Store/modules/root-action'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { setDeliveryAction } from '@Store/modules/customer-order/action'

function Transaction() {
  return <></>
}

const mapStateToProps = () => {}
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setDeliveryDate: setDeliveryAction,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
