import { ReactNode } from 'react'

import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { classNames } from '@Utils/common'

import styles from './views.module.scss'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: theme.shadows['1'],
  },
}))

export function DashboardView({
  children,
  pageTitle,
}: {
  children: ReactNode
  pageTitle: string
}) {
  const classes = useStyles()
  return (
    <Container
      maxWidth={'xl'}
      className={classNames(styles.dashboardWrap, classes.root)}
    >
      <Typography className={styles.pageTitle} variant={'h2'}>
        {pageTitle}
      </Typography>
      <Container className={classes.root} maxWidth={'xl'}>
        {children}
      </Container>
    </Container>
  )
}
