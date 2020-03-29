import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { classNames } from '@Utils/common'

import styles from './views.module.scss'
import fetcher from '@Lib/server/fetcher'
import { authService } from '@Services'

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
  const authToken = authService.getAccessToken()

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
        <SWRConfig
          value={{
            /** makes sure we have authToken in there */
            refreshInterval: 300000 /* every 5min */,
            fetcher: async (...args) => await fetcher(authToken, ...args),
            onError: async (err, key, config) => {
              console.error(err, key, config)
            },
          }}
        >
          {children}
        </SWRConfig>
      </Container>
    </Container>
  )
}
