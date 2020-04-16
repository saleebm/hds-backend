import { useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { enableMapSet } from 'immer'
// todo don't import from dist
import { AppPropsType } from 'next/dist/next-server/lib/utils'

import { SnackbarProvider } from '@Utils/context'
import { withRedux } from '@Lib/hoc'
import { ErrorBoundary } from '@Components/Elements/ErrorBoundary'
import { darkTheme } from '@Config'
import { Layout } from '@Components/Layout'

import '@Static/styles/index.global.scss'

enableMapSet()

function App({ pageProps, Component }: AppPropsType) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')

    if (!!jssStyles && !!jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
        <ErrorBoundary>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <CssBaseline />
        </ErrorBoundary>
      </SnackbarProvider>
      <style jsx global>{`
        #__next {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
    </ThemeProvider>
  )
}

export default withRedux(App)
