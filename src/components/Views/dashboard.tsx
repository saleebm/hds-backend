import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import Typography from '@material-ui/core/Typography'
import { Container } from '@material-ui/core'

import styles from './views.module.scss'
import fetcher from '@Lib/server/fetcher'
import { authService } from '@Services'

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
      <Container maxWidth={'xl'}>
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
          {children}
        </SWRConfig>
      </Container>
    </Container>
  )
}
