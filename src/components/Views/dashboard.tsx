import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'
import Box from '@material-ui/core/Box'

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
    <Container className={styles.dashboardWrap}>
      <Box className={styles.innerDashWrap}>
        <Typography className={styles.pageTitle} variant={'h2'}>
          {pageTitle}
        </Typography>
        <Box className={styles.innerContent}>{children}</Box>
      </Box>
    </Container>
  )
}
