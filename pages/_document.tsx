import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets'
import { Children } from 'react'

class WebAppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      })

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    }
  }

  render() {
    return (
      <Html lang={'en'} dir={'ltr'}>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name={'description'}
            content={'Home Design Solutions Admin Portal'}
            key={'description'}
          />
          <meta
            name={'viewport'}
            content={
              'initial-scale=1.0, width=device-width, shrink-to-fit= no, minimum-scale=1.0'
            }
            key={'viewport'}
          />
          <meta content={'#b91d47'} name={'msapplication-TileColor'} />
          <meta content={'#b91d47'} name={'theme-color'} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default WebAppDocument
