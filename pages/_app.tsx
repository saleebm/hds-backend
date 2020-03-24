import { useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
// todo don't import from dist
import { AppPropsType } from 'next/dist/next-server/lib/utils'

import { withRedux } from '@Lib/hoc'
import { ErrorBoundary } from '@Components/Elements/ErrorBoundary'
import { darkTheme } from '@Config'
import { Layout } from '@Components/Layout'

import '@Static/styles/index.global.scss'

function App({ pageProps, Component, router }: AppPropsType) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')

    if (!!jssStyles && !!jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <Layout pathname={router.pathname}>
          <Component {...pageProps} />
        </Layout>
        <CssBaseline />
      </ThemeProvider>
      <style jsx global>{`
        #__next {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
    </ErrorBoundary>
  )
}

export default withRedux(App)
