import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { connect } from 'react-redux'

import styles from './layout.module.scss'
import { RootStateType } from '@Store/modules/types'
import { Snackbar } from '@Components/Elements/Snackbar'

// won't need it on login page anyways
const Header = dynamic(() => import('./header'))

type Props = {
  children: ReactNode
} & ReturnType<typeof mapStateToProps>

const mapStateToProps: (
  state: RootStateType
) => {
  isAuthenticated: boolean
} = (state: RootStateType) => {
  const { authReducer } = state
  return {
    isAuthenticated: authReducer.isAuthenticated,
  }
}

export const Layout = connect(mapStateToProps)(
  ({ isAuthenticated, children }: Props) => (
    <div className={styles.layout}>
      {isAuthenticated && <Header />}
      <div className={styles.mainContent}>{children}</div>
      <Snackbar />
    </div>
  )
)
