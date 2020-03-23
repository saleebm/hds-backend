import { GetServerSideProps } from 'next'

import { LoginForm } from '@Components/Forms'
import { authService } from '@Services'
import { ServerSideProps } from '@Types'
import { Viewer } from '@Pages/api/v1/account/viewer'

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authToken = authService.getAccessToken(ctx as ServerSideProps)

  console.log(`Access token: ${authToken}`)
  console.log(`Req url: ${ctx.req.url}`)

  if (!!authToken && ctx.req.url === '/') {
    // dynamic import saves client data
    const { getAxiosInstance } = await import('@Lib/axios-instance')

    try {
      await getAxiosInstance()
        .post<Viewer>(
          'account/viewer',
          {
            withCredentials: true,
          },
          {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((res) => {
          if (res.data && res.data.userId) {
            // authenticated, redirect to dashboard from here
            console.log(res.data.userId)
            ctx.res.writeHead(302, 'Authenticated', { Location: '/dashboard' })
            ctx.res.end()
          }
        })
    } catch {}
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
