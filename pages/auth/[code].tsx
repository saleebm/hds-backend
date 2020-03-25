import React from 'react'
import { AuthPage } from '@Components/Views/auth-page'
import { GetServerSideProps } from 'next'

function AuthWithCode({ initialCode }: { initialCode: string }) {
  return <AuthPage initialCode={initialCode} />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const initialCode =
    (typeof ctx.params === 'object' &&
      'code' in ctx.params &&
      ctx.params.code) ||
    undefined

  console.log(initialCode)
  return {
    props: {
      initialCode,
    },
  }
}

export default AuthWithCode
