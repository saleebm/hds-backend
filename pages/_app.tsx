import { useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppPropsType } from 'next/dist/next-server/lib/utils'

import { theme } from '@Config'
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout pathname={router.pathname}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default App
