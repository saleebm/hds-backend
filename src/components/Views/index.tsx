import { useState } from 'react'
import dynamic from 'next/dynamic'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { LoginForm } from '@Components/Forms'

import styles from './views.module.scss'

const ResetPasswordRequestForm = dynamic(() =>
  import('@Components/Forms/reset-password-request')
)

export const IndexView = () => {
  const [isResetFormVisible, setResetFormVisible] = useState(false)

  return (
    <div className={styles.indexWrap}>
      <h1>Home Design Solutions: Admin Portal</h1>
      <main className={styles.loginWrap}>
        {!isResetFormVisible ? (
          <>
            <Typography variant={'h3'}>Login</Typography>
            <LoginForm />
            <Button
              type={'button'}
              variant={'text'}
              size={'small'}
              title={'show reset password form'}
              onClick={() => setResetFormVisible(true)}
            >
              Reset password
            </Button>
          </>
        ) : (
          <>
            <Typography variant={'h3'}>Login</Typography>
            <ResetPasswordRequestForm />
            <Button
              type={'button'}
              variant={'text'}
              size={'small'}
              title={'Show login form'}
              onClick={() => setResetFormVisible(false)}
            >
              Login
            </Button>
          </>
        )}
      </main>
    </div>
  )
}
