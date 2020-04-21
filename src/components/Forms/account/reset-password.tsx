import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import Router from 'next/router'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import { SecurityRounded, SendTwoTone } from '@material-ui/icons'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { useSnackbarContext } from '@Utils/context'
import { useStyles } from './login'

import mutator from '@Lib/server/mutator'
import {
  ResetPassword,
  ResetPasswordRes,
} from '@Pages/api/v1/account/reset-password'

import styles from '@Components/Forms/form.module.scss'
function ResetPasswordRequest({ userId }: { userId: number }) {
  const classes = useStyles()
  const { toggleSnackbar } = useSnackbarContext()
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState: { isSubmitting },
  } = useForm<{
    password: string
    validatePassword: string
  }>({ reValidateMode: 'onBlur', mode: 'onBlur' })

  const resetPasswordRequest = useCallback(
    async (body: { password: string; validatePassword: string }) => {
      await mutator<ResetPasswordRes, ResetPassword>(
        '/api/v1/account/reset-password',
        { newPassword: body.password, userId }
      )
        .catch((e) => {
          toggleSnackbar({
            message: e.toString(),
            severity: 'error',
            isOpen: true,
          })
        })
        .then(async (res) => {
          if (res && 'success' in res && res.success) {
            toggleSnackbar({
              message: 'Success. You may now login.',
              isOpen: true,
              severity: 'success',
            })
            await Router.replace('/', undefined, { shallow: true })
          }
        })
    },
    [toggleSnackbar, userId]
  )

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={handleSubmit(resetPasswordRequest)}
    >
      <FormControl className={classes.margin}>
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
          autoComplete={'new-password'}
          error={!!errors.password}
          name={'password'}
          aria-invalid={!!errors.password ? 'true' : 'false'}
          aria-describedby="error-password-required"
          inputRef={register({
            required: true,
            minLength: { value: 8, message: 'Too short!' },
          })}
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
      </FormControl>
      <FormControl className={classes.margin}>
        <InputLabel
          error={!!errors.validatePassword}
          required
          htmlFor="validatePassword"
          id={'validatePassword-label'}
          className={classes.label}
        >
          Validate Password
        </InputLabel>
        <Input
          id={'validatePassword'}
          inputMode={'text'}
          type={'password'}
          autoComplete={'new-password'}
          error={!!errors.validatePassword}
          name={'validatePassword'}
          aria-invalid={!!errors.validatePassword ? 'true' : 'false'}
          aria-describedby="error-validatePassword-required error-validatePassword-validate"
          inputRef={register({
            required: true,
            minLength: { value: 8, message: 'Too short!' },
            validate: (value) =>
              value === watch('password') || "Password's do not match!",
          })}
          endAdornment={
            <InputAdornment position="end">
              <SecurityRounded />
            </InputAdornment>
          }
        />
        {!!errors.validatePassword &&
          errors.validatePassword?.type === 'required' && (
            <FormHelperText id={'error-validatePassword-required'}>
              Required
            </FormHelperText>
          )}
        {!!errors.validatePassword &&
          errors.validatePassword?.type === 'validate' && (
            <FormHelperText id={'error-validatePassword-validate'}>
              {errors.validatePassword.message || 'Passwords do not match'}
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
    </form>
  )
}

export default ResetPasswordRequest
