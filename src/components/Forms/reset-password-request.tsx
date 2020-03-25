import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import { AccountCircle, SendTwoTone } from '@material-ui/icons'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useStyles } from '@Components/Forms/login'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { emailRegEx } from '@Utils/common'
import { getAxiosInstance } from '@Lib/axios-instance'

import styles from '@Components/Forms/form.module.scss'

function ResetPasswordRequest() {
  const classes = useStyles()
  const [status, setStatus] = useState<string | undefined>(undefined)
  const axios = getAxiosInstance()
  const {
    register,
    handleSubmit,
    errors,
    setError,
    formState: { isSubmitting },
  } = useForm<{
    email: string
  }>({ reValidateMode: 'onBlur', mode: 'onBlur' })

  const resetPasswordRequest = useCallback(
    async (body: { email: string }) => {
      await axios
        .post('account/reset-password-request', body)
        .catch((e) => {
          console.warn(e)
          setError('email', 'validate', 'Email does not exits')
        })
        .then((res) => {
          if (res && res.data && res.data.success) {
            setStatus('Success. Please check your email.')
          }
        })
    },
    [setError, axios]
  )

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit(resetPasswordRequest)}
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
                const { data } = await axios.get(
                  `account/email-exists?email=${value}`
                )
                // console.log(data)
                if (data && 'exists' in data) {
                  // data.exists is either true or false
                  return data.exists
                }
              } catch (e) {
                console.warn(e)
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
          <FormHelperText id={'error-email-required'}>Required</FormHelperText>
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
      {status && <Typography variant={'h3'}>{status}</Typography>}
    </form>
  )
}

export default ResetPasswordRequest
