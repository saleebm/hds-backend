import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider'
import DateFnsUtils from '@date-io/date-fns'
import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'

import fetcher from '@Lib/server/fetcher'
import { authService } from '@Services'

import styles from './views.module.scss'

/**
 * Page wrap for the dashboard/* views
 * provides swr config for fetching with auth token included
 * @param children
 * @param pageTitle The title for the page
 * @constructor
 */
export function DashboardView({
  children,
  pageTitle,
}: {
  children: ReactNode
  pageTitle: string
}) {
  const authToken = authService.getAccessToken()

  return (
    <Container maxWidth={'xl'} className={styles.dashboardWrap}>
      <Typography className={styles.pageTitle} variant={'h2'}>
        {pageTitle}
      </Typography>
      <Container maxWidth={false} disableGutters>
        <SWRConfig
          value={{
            /** makes sure we have authToken in there */
            refreshInterval: 300000 /* every 5min */,
            fetcher: async (...args) => await fetcher(authToken, ...args),
            errorRetryCount: 3,
            refreshWhenHidden: true,
            onError: async (err, key, config) => {
              console.error(err, key, config)
            },
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {children}
          </MuiPickersUtilsProvider>
        </SWRConfig>
      </Container>
    </Container>
  )
}
