import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { DashboardView } from '@Components/Views/dashboard'
import { RootStateType } from '@Store/modules/types'

//todo maybe some widgets
function Dashboard({ employee }: ReturnType<typeof mapStateToProps>) {
  return (
    <DashboardView pageTitle={'Dashboard'}>
      <Typography variant={'h2'} style={{ textTransform: 'uppercase' }}>
        Welcome, {employee?.firstName} {employee?.lastName}
      </Typography>
    </DashboardView>
  )
}

const mapStateToProps = (state: RootStateType) => ({
  employee: state.authReducer.currentUser,
})

export default connect(mapStateToProps)(Dashboard)
