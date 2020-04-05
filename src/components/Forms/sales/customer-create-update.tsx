import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { useForm } from 'react-hook-form'
import { SendTwoTone } from '@material-ui/icons'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { useEffect, useState } from 'react'
import { Customer } from '@prisma/client'

import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'

import mutator from '@Lib/server/mutator'
import { FindOneCustomerBodyArgs } from '@Pages/api/v1/customers/find-one'
import { useSnackbarContext } from '@Utils/context'
import { RootStateType } from '@Store/modules/types'
import { RootAction } from '@Store/modules/root-action'
import {
  createCustomerAction,
  updateCustomerAction,
} from '@Store/modules/customer-order/action'
import { CustomerEditableFields } from '@Types/customer'
import { Input } from '@Components/Elements/Input'

import styles from '@Components/Forms/form.module.scss'

type CustomerCreateUpdate = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> & {
    isCreating: boolean
    isUpdating: boolean
    isHidden: boolean
  }

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

enum customerCreateUpdateFields {
  firstName = 'firstName',
  middleInitial = 'middleInitial',
  lastName = 'lastName',
  address = 'address',
  state = 'state',
  city = 'city',
  zipCode = 'zipCode',
}

function CustomerCreateUpdateForm({
  customerOrderState,
  createCustomer,
  updateCustomer,
  isCreating,
  isUpdating,
  isHidden,
  stateErrors,
}: CustomerCreateUpdate) {
  const { customerId } = customerOrderState || {}
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const { toggleSnackbar } = useSnackbarContext()
  const [isLoading, setLoading] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    errors,
    formState: { isSubmitting },
  } = useForm<CustomerEditableFields>()

  useEffect(() => {
    if (stateErrors && Array.isArray(stateErrors) && !!stateErrors.length) {
      toggleSnackbar({
        isOpen: true,
        severity: 'error',
        message: `${stateErrors[stateErrors.length - 1].reference}`,
      })
    }
  }, [stateErrors, toggleSnackbar])

  useEffect(() => {
    if (isCreating) {
      reset()
      setCurrentCustomer(null)
    }
  }, [reset, isCreating])

  useEffect(() => {
    if (customerId) {
      try {
        setLoading(true)
        mutator<{ customer: Customer }, FindOneCustomerBodyArgs>(
          '/api/v1/customers/find-one',
          { findOneBy: { where: { idCustomer: customerId } } }
        )
          .then((value) => setCurrentCustomer(value.customer))
          .finally(() => setLoading(false))
      } catch (e) {
        toggleSnackbar({
          severity: 'error',
          isOpen: true,
          message: e.toString(),
        })
        console.error(e)
        setLoading(false)
      }
    }
  }, [toggleSnackbar, customerId])

  useEffect(() => {
    if (!!currentCustomer) {
      const customerFiltered = Object.entries(currentCustomer)
        .filter(
          ([key]) =>
            key !== 'updatedAt' && key !== 'createdAt' && key !== 'idCustomer'
        )
        .map(([key, value]) => ({
          [key]: value ? value : '',
        }))
      setValue(customerFiltered)
    }
  }, [currentCustomer, setValue])

  const onSubmit = async (editableFields: CustomerEditableFields) => {
    if (isCreating) {
      const res = await createCustomer(editableFields)
      if (res) {
        console.log(res)
        toggleSnackbar({
          isOpen: true,
          message: `Success. Customer ID: ${currentCustomer?.idCustomer}`,
          severity: 'success',
        })
      }
    } else if (isUpdating && customerId) {
      const res = updateCustomer({
        where: { idCustomer: customerId },
        data: editableFields,
      })
      if (res) {
        console.log(res)
        toggleSnackbar({
          isOpen: true,
          message: `Success. Customer ID: ${currentCustomer?.idCustomer}`,
          severity: 'success',
        })
      }
    }
  }

  return (
    <form
      noValidate
      aria-hidden={isHidden}
      className={styles.createForm}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container justify={'space-around'} spacing={0}>
        <Grid item md={5}>
          <Input
            autoFocus
            required
            isDisabled={isLoading}
            rules={{
              required: { value: true, message: 'Required' },
              minLength: { value: 3, message: 'Too short!' },
            }}
            aria-describedby={
              'error-firstName-required error-firstName-minLength'
            }
            autoComplete={'given-name'}
            type={'text'}
            label={'First name'}
            name={customerCreateUpdateFields.firstName}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.firstName}
            aria-invalid={!!errors.firstName}
            errorType={errors.firstName?.type}
            errorMessage={
              (!!errors.firstName && errors.firstName.message) || undefined
            }
            htmlFor={customerCreateUpdateFields.firstName}
            control={control}
          />
        </Grid>
        <Grid item xs md={2}>
          <Input
            rules={{
              maxLength: { value: 1, message: 'TMI, just the initial!' },
            }}
            aria-describedby={
              'error-middleInitial-required error-middleInitial-minLength'
            }
            autoComplete={'additional-name'}
            type={'text'}
            isDisabled={isLoading}
            label={'Middle initial'}
            name={customerCreateUpdateFields.middleInitial}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.middleInitial}
            aria-invalid={!!errors.middleInitial}
            errorType={errors.middleInitial?.type}
            errorMessage={
              (!!errors.middleInitial && errors.middleInitial.message) ||
              undefined
            }
            htmlFor={customerCreateUpdateFields.middleInitial}
            control={control}
          />
        </Grid>
        <Grid item xs md={5}>
          <Input
            required
            rules={{
              required: { value: true, message: 'Required' },
              minLength: { value: 3, message: 'Too short!' },
            }}
            aria-describedby={
              'error-lastName-required error-lastName-minLength'
            }
            autoComplete={'family-name'}
            type={'text'}
            label={'Last name'}
            name={customerCreateUpdateFields.lastName}
            labelClasses={classes.label}
            isDisabled={isLoading}
            wrapClasses={classes.margin}
            isError={!!errors.lastName}
            errorType={errors.lastName?.type}
            aria-invalid={!!errors.lastName}
            errorMessage={
              (!!errors.lastName && errors.lastName.message) || undefined
            }
            htmlFor={customerCreateUpdateFields.lastName}
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            required
            rules={{
              required: { value: true, message: 'Required' },
              minLength: { value: 3, message: 'Too short!' },
            }}
            aria-describedby={'error-address-required error-address-minLength'}
            autoComplete={'address-line1'}
            type={'text'}
            label={'Street address'}
            isDisabled={isLoading}
            name={customerCreateUpdateFields.address}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.address}
            aria-invalid={!!errors.address}
            errorType={errors.address?.type}
            errorMessage={
              (!!errors.address && errors.address.message) || undefined
            }
            htmlFor={customerCreateUpdateFields.address}
            control={control}
          />
        </Grid>
        <Grid item xs md={4}>
          <Input
            required
            rules={{
              required: { value: true, message: 'Required' },
              minLength: { value: 3, message: 'Too short!' },
            }}
            aria-describedby={'error-city-required error-city-minLength'}
            autoComplete={'address-level2'}
            type={'text'}
            label={'City'}
            isDisabled={isLoading}
            name={customerCreateUpdateFields.city}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.city}
            aria-invalid={!!errors.city}
            errorType={errors.city?.type}
            errorMessage={(!!errors.city && errors.city.message) || undefined}
            htmlFor={customerCreateUpdateFields.city}
            control={control}
          />
        </Grid>
        <Grid xs item md={4}>
          <Input
            required
            rules={{
              required: { value: true, message: 'Required' },
            }}
            aria-describedby={'error-state-required error-state-minLength'}
            autoComplete={'address-level1'}
            isDisabled={isLoading}
            type={'text'}
            label={'State'}
            name={customerCreateUpdateFields.state}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.state}
            aria-invalid={!!errors.state}
            errorType={errors.state?.type}
            errorMessage={(!!errors.state && errors.state.message) || undefined}
            htmlFor={customerCreateUpdateFields.state}
            control={control}
          />
        </Grid>
        <Grid xs item md={4}>
          <Input
            required
            rules={{
              required: { value: true, message: 'Required' },
              minLength: { value: 3, message: 'Too short!' },
            }}
            aria-describedby={'error-zipCode-required error-zipCode-minLength'}
            autoComplete={'address-level1'}
            type={'number'}
            label={'Zip code'}
            isDisabled={isLoading}
            name={customerCreateUpdateFields.zipCode}
            labelClasses={classes.label}
            wrapClasses={classes.margin}
            isError={!!errors.zipCode}
            aria-invalid={!!errors.zipCode}
            errorType={errors.zipCode?.type}
            errorMessage={
              (!!errors.zipCode && errors.zipCode.message) || undefined
            }
            htmlFor={customerCreateUpdateFields.zipCode}
            control={control}
          />
        </Grid>
      </Grid>
      <Button
        size={'large'}
        endIcon={<SendTwoTone />}
        className={classes.margin}
        variant={'contained'}
        color={'secondary'}
        aria-disabled={isSubmitting}
        type={'submit'}
        disabled={isSubmitting}
      >
        <Typography>{isCreating ? 'Create new' : 'Update'}</Typography>
      </Button>
    </form>
  )
}

const mapStateToProps = (state: RootStateType) => ({
  customerOrderState: state.customerOrderReducer,
  stateErrors: state.globalReducer.errors,
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      updateCustomer: updateCustomerAction,
      createCustomer: createCustomerAction,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCreateUpdateForm)
