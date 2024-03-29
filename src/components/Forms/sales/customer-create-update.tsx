import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { useForm } from 'react-hook-form'
import { SendTwoTone } from '@material-ui/icons'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { useEffect, useState, StrictMode } from 'react'
import { Customer } from '@prisma/client'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'

import mutator from '@Lib/server/mutator'
import { FindOneCustomerBodyArgs } from '@Pages/api/v1/customers/find-one'
import { useSnackbarContext } from '@Utils/context'
import { RootStateType } from '@Store/modules/types'
import { RootAction } from '@Store/modules/root-action'
import {
  createCustomerAction,
  resetCustomerOrderAction,
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
    // the shrink is falling short for some reason
    formControl: {
      top: '-7px',
      left: '-7px',
    },
    label: {
      margin: theme.spacing(1),
    },
    formTitle: {
      margin: '0.72rem 1.3rem',
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
  resetCustomerOrder,
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
    setValue: setValueOfForm,
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

  // on select of create, then reset the fields and wipe data on customer clean
  useEffect(() => {
    if (isCreating) {
      reset()
      resetCustomerOrder()
      setCurrentCustomer(null)
    }
  }, [isCreating, resetCustomerOrder, reset])

  // on customer id put into state, get the customer info and put it as currentCustomer
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
    } else {
      //todo
      // reset not working
      // perhaps bc input control incorrectly implemented
      for (const fieldElementName in customerCreateUpdateFields) {
        // Possible iteration over unexpected (custom / inherited) members, probably missing hasOwnProperty check
        // noinspection JSUnfilteredForInLoop
        setValueOfForm(fieldElementName as keyof CustomerEditableFields, '')
      }
      reset()
    }
  }, [toggleSnackbar, customerId, setValueOfForm, reset])

  // on selection of customer and when customer is put in dataabase,
  // then set the values of the current customer as values of form fields
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
      for (const fieldSet of customerFiltered) {
        if (fieldSet && typeof fieldSet === 'object') {
          for (const fieldElementName in fieldSet) {
            setValueOfForm(fieldElementName, fieldSet[fieldElementName])
          }
        }
      }
    }
  }, [currentCustomer, setValueOfForm])

  const onSubmit = async (editableFields: CustomerEditableFields) => {
    if (isCreating) {
      const { zipCode, ...customerInfo } = editableFields
      const res = await createCustomer({
        ...customerInfo,
        zipCode: typeof zipCode === 'string' ? parseInt(zipCode) : zipCode,
      })
      if (res && 'payload' in res) {
        console.log(res)
        toggleSnackbar({
          isOpen: true,
          message: `Success. Customer ID: ${
            // trying to convince typescript.. I wish i used redux toolkit, todo at least learn how to configure redux better with typescript
            (res as any).payload && (res as any).payload.customerId
          }`,
          severity: 'success',
        })
      }
    } else if (isUpdating && customerId) {
      const { zipCode, ...customerInfo } = editableFields
      const res = await updateCustomer({
        where: { idCustomer: customerId },
        data: {
          ...customerInfo,
          zipCode: typeof zipCode === 'string' ? parseInt(zipCode) : zipCode,
        },
      })
      if (res && 'payload' in res) {
        console.log(res)
        toggleSnackbar({
          isOpen: true,
          message: `Success. Customer ID: ${
            currentCustomer?.idCustomer || customerId
          }`,
          severity: 'success',
        })
      }
    }
  }

  return (
    <StrictMode>
      <form
        noValidate
        aria-hidden={isHidden}
        className={styles.createForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container justify={'space-around'} spacing={3}>
          <Grid item xs={12}>
            <Typography variant={'h5'}>
              {!isCreating
                ? "Please verify the customer's information"
                : 'Create new customer'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Input
              autoFocus
              required={true}
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
              wrapClasses={clsx(classes.margin, classes.formControl)}
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
          <Grid item xs sm={2}>
            <Input
              rules={{
                maxLength: { value: 2, message: 'TMI, just the initial!' },
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
              wrapClasses={clsx(classes.margin, classes.formControl)}
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
          <Grid item xs sm={5}>
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
              wrapClasses={clsx(classes.margin, classes.formControl)}
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
              aria-describedby={
                'error-address-required error-address-minLength'
              }
              autoComplete={'address-line1'}
              type={'text'}
              label={'Street address'}
              isDisabled={isLoading}
              name={customerCreateUpdateFields.address}
              labelClasses={classes.label}
              wrapClasses={clsx(classes.margin, classes.formControl)}
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
          <Grid item xs={12} sm={4}>
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
              wrapClasses={clsx(classes.margin, classes.formControl)}
              isError={!!errors.city}
              aria-invalid={!!errors.city}
              errorType={errors.city?.type}
              errorMessage={(!!errors.city && errors.city.message) || undefined}
              htmlFor={customerCreateUpdateFields.city}
              control={control}
            />
          </Grid>
          <Grid xs={12} item sm={4}>
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
              wrapClasses={clsx(classes.margin, classes.formControl)}
              isError={!!errors.state}
              aria-invalid={!!errors.state}
              errorType={errors.state?.type}
              errorMessage={
                (!!errors.state && errors.state.message) || undefined
              }
              htmlFor={customerCreateUpdateFields.state}
              control={control}
            />
          </Grid>
          <Grid xs={12} item sm={4}>
            <Input
              required
              rules={{
                required: { value: true, message: 'Required' },
                minLength: { value: 3, message: 'Too short!' },
              }}
              aria-describedby={
                'error-zipCode-required error-zipCode-minLength'
              }
              autoComplete={'address-level1'}
              type={'number'}
              label={'Zip code'}
              isDisabled={isLoading}
              name={customerCreateUpdateFields.zipCode}
              labelClasses={classes.label}
              wrapClasses={clsx(classes.margin, classes.formControl)}
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
    </StrictMode>
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
      resetCustomerOrder: resetCustomerOrderAction,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCreateUpdateForm)
