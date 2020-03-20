import { NextPage } from 'next'
import Router from 'next/router'

interface IProps {
  statusCode?: number
}

interface InitialProps {}

const Error: NextPage<IProps, InitialProps> = ({ statusCode }) => {
  return (
    <div>
      <p>Todo: error page</p>
      {statusCode}
    </div>
  )
}

Error.getInitialProps = async ({ res, err, asPath }) => {
  // Capture 404 of pages with traling slash and redirect them
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  // remove trailing slash
  if (statusCode && statusCode === 404) {
    const [path, query = ''] = asPath?.split('?') || []
    if (path.match(/\/$/)) {
      const withoutTrailingSlash = path.substr(0, path.length - 1)
      if (res) {
        res.writeHead(302, {
          Location: `${withoutTrailingSlash}${query ? `?${query}` : ''}`,
        })
        res.end()
      } else {
        Router.push(`${withoutTrailingSlash}${query ? `?${query}` : ''}`)
      }
    }
  }
  return { statusCode }
}
export default Error
