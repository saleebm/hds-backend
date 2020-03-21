import { AuthTokenSecurity } from '@Lib/server/auth-token-security'

export const getAccessToken = async ({
  signingSecret,
  userId,
  jwtid,
}: {
  userId: number
  signingSecret: string
  jwtid: string
}) =>
  await AuthTokenSecurity.sign({
    payload: { userId },
    isRefreshToken: false,
    signingSecret,
    jwtOptions: {
      // critical to set the jwtid here as this is what verifies it on the server in addition to the signing secret, so I can sleep tight
      jwtid,
    },
  })
