import { ComponentProps, ReactNode } from 'react'
import { FormControl, FormHelperText } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import MaterialInput from '@material-ui/core/Input'
import { Control, Controller } from 'react-hook-form'

export interface Input
  extends Omit<
    ComponentProps<typeof Controller>,
    'aria-invalid' | 'id' | 'defaultValue'
  > {
  control: Control
  label: string
  name: string
  isDisabled?: boolean
  wrapClasses?: string
  labelClasses?: string
  isError?: boolean
  errorType?: string
  errorMessage?: string | ReactNode
  htmlFor?: string
  variant?: 'outlined' | 'filled' | 'standard'
}

export const Input = ({
  label,
  wrapClasses,
  labelClasses,
  name,
  required,
  isError,
  errorType,
  errorMessage,
  variant = 'standard',
  control,
  isDisabled,
  ...rest
}: Input) => (
  <FormControl fullWidth className={wrapClasses}>
    <InputLabel
      id={`${name}-label`}
      required={required}
      className={labelClasses}
      error={isError}
      variant={variant}
      disabled={isDisabled}
    >
      {label}
    </InputLabel>
    <Controller
      as={MaterialInput}
      name={name}
      id={name}
      required={required}
      control={control}
      defaultValue={''}
      disabled={isDisabled}
      {...rest}
    />
    {isError && errorMessage && (
      <FormHelperText id={`error-${name}-${errorType}`}>
        {errorMessage}
      </FormHelperText>
    )}
  </FormControl>
)
