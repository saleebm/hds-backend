import { GetServerSideProps } from 'next'

import { LoginForm } from '@Components/Forms'
import { authService } from '@Services'
import { ServerSideProps } from '@Types'

function MainPage() {
  return (
    <div>
      <h1>Home Design Solutions: Admin Portal</h1>
      <main>
        <LoginForm />
      </main>
    </div>
  )
}

// also used in Dashboard to control routing
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // auth token is managed by store actions
  const authToken = authService.getAccessToken(ctx as ServerSideProps)

  // there is an auth token and the req url is not the dashboard
  if (!!authToken && ctx.req.url === '/') {
    // get the viewer
    ctx.res.writeHead(302, 'Authenticated', { Location: '/dashboard' })
    ctx.res.end()
  } // if no auth token and not going to login page, redirect to login
  else if (!authToken && ctx.req.url !== '/') {
    ctx.res.writeHead(302, 'Unauthenticated', { Location: '/' })
    ctx.res.end()
  }
  // else, nothing to do
  return {
    props: {},
  }
}

export default MainPage
