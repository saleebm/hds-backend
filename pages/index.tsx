import { GetServerSideProps } from 'next'

import { LoginForm } from '@Components/Forms'
import { authService } from '@Services'
import { ServerSideProps } from '@Types'
import { Viewer } from '@Pages/api/v1/account/viewer'

function MainPage() {
  return (
    <>
      <h1>Home Design Solutions: Admin Portal</h1>
      <main>
        <LoginForm />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authToken = authService.getAccessToken(ctx as ServerSideProps)

  console.log(`Access token: ${authToken}`)
  if (!!authToken) {
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
    } catch (e) {}

    return {
      props: {},
    }
  }
  // else, nothing to do
  return {
    props: {},
  }
}

export default MainPage
