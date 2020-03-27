import Typography from '@material-ui/core/Typography'
import { ReactNode } from 'react'

import styles from './views.module.scss'

export function DashboardView({
  children,
  pageTitle,
}: {
  children: ReactNode
  pageTitle: string
}) {
  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.innerDashWrap}>
        <Typography variant={'h2'}>{pageTitle}</Typography>
        {children}
      </div>
    </div>
  )
}
