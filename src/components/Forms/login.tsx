import { useForm } from 'react-hook-form'
import { bindActionCreators, Dispatch } from 'redux'
import { useCallback } from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FilledInput from '@material-ui/core/FilledInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { AccountCircle, SecurityRounded } from '@material-ui/icons'
import { createStyles } from '@material-ui/styles'

import { emailRegEx } from '@Utils/common'
import { getAxiosInstance } from '@Lib/axios-instance'

import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { loginUserAction } from '@Store/modules/auth/action'
import { LoginRequestSuccess } from '@Pages/api/v1/account/login'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
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
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    setError,
    formState: { isSubmitting },
  } = useForm<{
    email: string
    password: string
  }>({ reValidateMode: 'onBlur', mode: 'onBlur' })
  const axios = getAxiosInstance()

  const loginRequest = useCallback(
    async (props: { email: string; password: string }) => {
      await axios
        .post<{ data: any }>('account/login', props)
        .catch((e) => {
          console.warn(e)
          // the only error possible at this point, since email has to be in system to even submit
          setError('password', 'validate', 'Wrong password')
        })
        .then((res) => {
          if (typeof res === 'object' && 'data' in res && !!res.data) {
            // data will contain tokens and user data, so pass that over to loginUserAction dispatch thunk to handle
            loginUser({
              loginSuccessResponse: (res.data as unknown) as LoginRequestSuccess,
            })
          }
        })
    },
    [axios, setError, loginUser]
  )

  return (
    <form noValidate onSubmit={handleSubmit(loginRequest)}>
      <FormControl className={classes.margin}>
        <InputLabel
          variant={'filled'}
          error={!!errors.email}
          required
          htmlFor="email"
        >
          Email
        </InputLabel>
        <FilledInput
          autoFocus
          type={'email'}
          autoComplete={'email'}
          error={!!errors.email}
          name={'email'}
          aria-invalid={!!errors.email}
          aria-describedby="error-email-required error-email-pattern error-email-validate"
          inputRef={register({
            required: true,
            pattern: emailRegEx,
            validate: async (value) => {
              try {
                const { data } = await axios.get(
                  `account/email-exists?email=${value}`
                )
                console.log(data)
                if (data && 'exists' in data) {
                  // data.exists is either true or false
                  return data.exists
                }
              } catch (e) {
                console.warn(e)
              }
            },
          })}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
        {!!errors.email && errors.email?.type === 'required' && (
          <FormHelperText id={'error-email-required'}>
            This is required
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
      <FormControl className={classes.margin}>
        <InputLabel
          variant={'filled'}
          error={!!errors.password}
          required
          htmlFor="password"
        >
          Password
        </InputLabel>
        <FilledInput
          autoFocus
          type={'password'}
          autoComplete={'current-password'}
          error={!!errors.password}
          name={'password'}
          aria-invalid={!!errors.password ? 'true' : 'false'}
          aria-describedby="error-password-required"
          inputRef={register({ required: true })}
          startAdornment={
            <InputAdornment position="start">
              <SecurityRounded />
            </InputAdornment>
          }
        />
        {!!errors.password && errors.password?.type === 'required' && (
          <FormHelperText id={'error-name-required'}>Required</FormHelperText>
        )}
        {!!errors.password && errors.password?.type === 'validate' && (
          <FormHelperText id={'error-name-required'}>
            Wrong password
          </FormHelperText>
        )}
      </FormControl>
      <Button variant={'outlined'} type={'submit'} disabled={isSubmitting}>
        <Typography>Submit</Typography>
      </Button>
    </form>
  )
}

export default connect(null, mapDispatchToProps)(LoginForm)
