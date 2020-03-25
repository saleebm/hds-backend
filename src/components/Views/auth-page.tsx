import { useEffect, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import mutator from '@Lib/server/mutator'
import { ResetPasswordForm } from '@Components/Forms'
import { MaterialNextBtn } from '@Components/Elements/Button'

import styles from './views.module.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    button: {
      margin: theme.spacing(1),
    },
  })
)

/**
 * The page used for resetting password
 * @param initialCode The code from the code generator that verifies a user's identity
 */
export function AuthPage({ initialCode }: { initialCode: string | undefined }) {
  const classes = useStyles()
  const [state, setState] = useState<{
    userId?: number
    errorMessage?: string
  } | null>(null)
  // 1. check if code is valid
  useEffect(() => {
    // get the userID
    mutator(undefined, '/api/v1/account/verify-auth-code', {
      code: initialCode,
    })
      .catch((e) => {
        setState({ errorMessage: e.message })
      })
      .then((data: { userId: string | undefined }) => {
        // console.log(data)
        if (data && data.userId) {
          setState({ userId: parseInt(data.userId) })
          return
        }
        setState({
          errorMessage:
            '<p>Failed to retrieve info.</p> <p>Please contact support or request another password reset from the login page.</p>',
        })
      })
  }, [initialCode])

  return (
    <>
      {state ? (
        <section className={styles.authPage}>
          <div className={styles.innerAuth}>
            {state.errorMessage ? (
              <Typography
                dangerouslySetInnerHTML={{ __html: state.errorMessage || '' }}
                variant={'h4'}
              />
            ) : (
              <div className={styles.authPage}>
                <Typography variant={'h4'}>Reset your password</Typography>
                {state.userId ? (
                  <ResetPasswordForm userId={state.userId} />
                ) : (
                  <Typography variant={'body1'}>
                    {/*TODO*/}
                    <p>Ooops.</p>
                    <p>
                      Please request another password change from the login
                      page. Something went wrong. Our so-called engineers have
                      not been notified unfortunately, that is on a todo list.
                    </p>
                  </Typography>
                )}
              </div>
            )}
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
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  )
}
