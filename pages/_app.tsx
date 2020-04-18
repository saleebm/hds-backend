import { useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { enableMapSet, setAutoFreeze } from 'immer'
// todo don't import from dist
import { AppPropsType } from 'next/dist/next-server/lib/utils'

import { SnackbarProvider } from '@Utils/context'
import { withRedux } from '@Lib/hoc'
import { ErrorBoundary } from '@Components/Elements/ErrorBoundary'
import { darkTheme } from '@Config'
import { Layout } from '@Components/Layout'

import '@Static/styles/index.global.scss'

// enable immer support for maps
enableMapSet()
// https://immerjs.github.io/immer/docs/freezing
setAutoFreeze(false)

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
    </ThemeProvider>
  )
}

export default withRedux(App)
