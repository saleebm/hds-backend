import { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import mutator from '@Lib/server/mutator'
import { ResetPasswordForm } from '@Components/Forms'
import { MaterialNextBtn } from '@Components/Elements/Button'

import styles from './views.module.scss'
import { useSnackbarContext } from '@Utils/reducers'
import { Loading } from '@Components/Elements/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
)

/**
 * The page used for resetting password
 * @param initialCode The code from the code generator that verifies a user's identity
 */
export function AuthPage({ initialCode }: { initialCode: string | undefined }) {
  const classes = useStyles()
  const { toggleSnackbar } = useSnackbarContext()

  const [state, setState] = useState<{
    userId?: number
    error?: boolean
  } | null>(null)
  // 1. check if code is valid
  useEffect(() => {
    // get the userID
    mutator('/api/v1/account/verify-auth-code', {
      code: initialCode,
    })
      .catch((e) => {
        setState({ error: true })
      })
      .then((data: { userId: string | undefined }) => {
        // console.log(data)
        if (data && data.userId) {
          setState({ userId: parseInt(data.userId) })
          return
        }
        setState({
          error: true,
          // '<p>Failed to retrieve info.</p> <p>Please contact support or request another password reset from the login page.</p>',
        })
      })
  }, [initialCode])

  const { error } = state || {}

  useEffect(() => {
    if (error) {
      toggleSnackbar({
        message:
          'Oops, something went wrong. Please request another password change from the login page. For more info, please contact our so called engineers..',
        isOpen: true,
        severity: 'warning',
      })
    }
  }, [toggleSnackbar, error])

  return (
    <>
      {!!state ? (
        <section className={styles.authPage}>
          <div className={styles.innerAuth}>
            <div className={styles.authPage}>
              {!state.error && state.userId && (
                <>
                  <Typography variant={'h4'}>Reset your password</Typography>
                  <ResetPasswordForm userId={state.userId}/>
                </>
              )}
            </div>
            <MaterialNextBtn
              nextLinkProps={{ href: '/' }}
              variant={'outlined'}
              title={'go to dashboard'}
              className={classes.button}
            >
              Back to login.
            </MaterialNextBtn>
          </div>
        </section>
      ) : (
        <Loading/>
      )}
    </>
  )
}
