import { ReactNode } from 'react'

import { Snackbar } from '@Components/Elements/Snackbar'
import Header from '@Components/Layout/header'

import styles from './layout.module.scss'

type Props = {
  children: ReactNode
}

export const Layout = ({ children }: Props) => (
  <div className={styles.layout}>
    <Header />
    <div className={styles.mainContent}>{children}</div>
    <Snackbar />
  </div>
)
