import { useForm } from 'react-hook-form'
import { bindActionCreators, Dispatch } from 'redux'
import { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'

import Input from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { AccountCircle, SecurityRounded, SendTwoTone } from '@material-ui/icons'
import { createStyles } from '@material-ui/styles'

import { emailRegEx } from '@Utils/common'

import { useSnackbarContext } from '@Utils/context'
import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { loginUserAction } from '@Store/modules/auth/action'
import { LoginBody, LoginRequestSuccess } from '@Pages/api/v1/account/login'

import styles from '@Components/Forms/form.module.scss'
import mutator from '@Lib/server/mutator'
import { ResetPasswordRequest } from '@Pages/api/v1/account/reset-password-request'
import fetcher from '@Lib/server/fetcher'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    label: {
      margin: theme.spacing(1),
    },
  })
)

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setErrorDispatch: setErrorAction,
      loginUser: loginUserAction,
    },
    dispatch
  )

function LoginForm({
  setErrorDispatch,
  loginUser,
}: ReturnType<typeof mapDispatchToProps>) {
  const { toggleSnackbar } = useSnackbarContext()

  const [isLogin, setIsLogin] = useState(true)
  const formInput = useMemo(
    () =>
      isLogin
        ? {
            email: '',
            password: '',
          }
        : { email: '' },
    [isLogin]
  )
  const classes = useStyles()
  const {
    register,
    unregister,
    handleSubmit,
    errors,
    setError,
    formState: { isSubmitting },
  } = useForm<typeof formInput>({ reValidateMode: 'onBlur', mode: 'onBlur' })

  const loginRequest = useCallback(
    async (props) => {
      try {
        await mutator<LoginRequestSuccess, LoginBody>(
          '/api/v1/account/login',
          props
        ).then((res) => {
          loginUser({
            loginSuccessResponse: res as LoginRequestSuccess,
          })
        })
      } catch (e) {
        console.warn(e)
        // the only error possible at this point, since email has to be in system to even submit
        setError('password', 'validate', 'An incorrect password or username')
        toggleSnackbar({
          message: e.toString(),
          severity: 'error',
          isOpen: true,
        })
        setErrorDispatch({ error: e, reference: 'login user dispatch' })
      }
    },
    [toggleSnackbar, setError, loginUser, setErrorDispatch]
  )

  const resetPasswordRequest = useCallback(
    async (body: { email: string }) => {
      try {
        await mutator<{ success: boolean }, ResetPasswordRequest>(
          '/api/v1/account/reset-password-request',
          body
        ).then((res) => {
          toggleSnackbar(
            res && 'success' in res && res.success
              ? {
                  message: 'Success. Please check your email.',
                  severity: 'success',
                  isOpen: true,
                }
              : {
                  message: 'Sorry, do not go. Do not collect 200. Go to jail.',
                  isOpen: true,
                  severity: 'warning',
                }
          )
        })
      } catch (e) {
        console.warn(e)
        setError('email', 'validate', 'Nonexistent email in system')
      }
    },
    [toggleSnackbar, setError]
  )

  const switchToResetPasswordRequest = () => {
    unregister('password')
    setIsLogin(false)
  }

  return (
    <>
      <Typography variant={'h3'} className={classes.margin}>
        {isLogin ? 'Login' : 'Reset Password'}
      </Typography>
      <form
        className={styles.form}
        noValidate
        onSubmit={
          isLogin
            ? handleSubmit(loginRequest)
            : handleSubmit(resetPasswordRequest)
        }
      >
        <FormControl className={classes.margin}>
          <InputLabel
            id={'email-label'}
            error={!!errors.email}
            required
            htmlFor="email"
            className={classes.label}
          >
            Email address
          </InputLabel>
          <Input
            aria-invalid={!!errors.email}
            type={'email'}
            autoComplete={'email'}
            name={'email'}
            required
            id={'email'}
            aria-describedby="error-email-required error-email-pattern error-email-validate"
            inputRef={register({
              required: true,
              pattern: emailRegEx,
              validate: async (value) => {
                try {
                  const res = await fetcher<{
                    exists: boolean
                  }>(undefined, `/api/v1/account/email-exists?email=${value}`)
                  // console.log(res)
                  if (res && 'exists' in res) {
                    // data.exists is either true or false
                    return res.exists
                  } else {
                    return false
                  }
                } catch (e) {
                  console.warn(e)
                  return false
                }
              },
            })}
            endAdornment={
              <InputAdornment position="end">
                <AccountCircle />
              </InputAdornment>
            }
          />
          {!!errors.email && errors.email?.type === 'required' && (
            <FormHelperText id={'error-email-required'}>
              Required
            </FormHelperText>
          )}
          {!!errors.email && errors.email?.type === 'pattern' && (
            <FormHelperText id={'error-email-pattern'}>
              Invalid email
            </FormHelperText>
          )}
          {!!errors.email && errors.email?.type === 'validate' && (
            <FormHelperText id={'error-email-validate'}>
              Email does not exist in system
            </FormHelperText>
          )}
        </FormControl>
        {isLogin && (
          <FormControl
            disabled={!isLogin}
            aria-hidden={!isLogin}
            aria-disabled={!isLogin}
            className={classes.margin}
          >
            <InputLabel
              error={!!errors.password}
              required
              htmlFor="password"
              id={'password-label'}
              className={classes.label}
            >
              Password
            </InputLabel>
            <Input
              id={'password'}
              inputMode={'text'}
              type={'password'}
              autoComplete={'current-password'}
              error={!!errors.password}
              name={'password'}
              aria-invalid={!!errors.password ? 'true' : 'false'}
              aria-describedby="error-password-required error-password-validate"
              inputRef={register({ required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <SecurityRounded />
                </InputAdornment>
              }
            />
            {!!errors.password && errors.password?.type === 'required' && (
              <FormHelperText id={'error-password-required'}>
                Required
              </FormHelperText>
            )}
            {!!errors.password && errors.password?.type === 'validate' && (
              <FormHelperText id={'error-password-validate'}>
                Wrong password
              </FormHelperText>
            )}
          </FormControl>
        )}

        <Button
          size={'large'}
          endIcon={<SendTwoTone />}
          className={classes.margin}
          variant={'outlined'}
          type={'submit'}
          disabled={isSubmitting}
        >
          <Typography>Submit</Typography>
        </Button>
      </form>
      <Button
        type={'button'}
        variant={'text'}
        size={'small'}
        title={'show reset password form'}
        onClick={
          isLogin
            ? () => switchToResetPasswordRequest()
            : () => setIsLogin(true)
        }
      >
        {isLogin ? 'Reset password' : 'Login'}
      </Button>
    </>
  )
}

export default connect(null, mapDispatchToProps)(LoginForm)
