import { Controller, useForm } from 'react-hook-form'
import { KeyboardDatePicker } from '@material-ui/pickers'
import React, { useCallback, useState } from 'react'

import { FormControl, Grid, InputLabel } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'
import {
  InvoiceEditableFields,
  InvoiceLineCreateBodyArgs,
} from '@Types/invoices'
import { Input } from '@Components/Elements/Input'
import Button from '@material-ui/core/Button'
import { SendTwoTone } from '@material-ui/icons'
import mutator from '@Lib/server/mutator'
import { useSnackbarContext } from '@Utils/context'

enum UpdateBillFields {
  LINE_ITEM_TOTAL = 'lineItemTotal',
  DATE_DUE = 'dueDate',
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    priceTagSpan: {
      paddingRight: theme.spacing(1),
      '&> span': {
        fontVariant: 'tabular-nums',
        fontVariationSettings: `'wght' 700, 'slnt' -100`,
        '&:nth-child(2)': {
          fontFeatureSettings: `'numr'`,
        },
      },
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
    secondaryHeading: {
      fontSize: '1.3rem',
      fontVariant: 'petite-caps',
    },
  })
)

export function UpdateBillForm({
  revalidate,
  invoiceId,
}: {
  revalidate: any
  invoiceId: number
}) {
  const classes = useStyles()
  const defaultDate = new Date().setMonth(new Date().getMonth() + 1)
  const theFifteenthOfNextMonth = new Date(defaultDate).setDate(15)
  const [selectedDate, handleDateChange] = useState<Date>(
    new Date(theFifteenthOfNextMonth)
  )

  const { toggleSnackbar } = useSnackbarContext()

  const onDatePickerChange = useCallback(
    (value) => {
      if (!!value) {
        handleDateChange(value)
      }
    },
    [handleDateChange]
  )

  const {
    control,
    handleSubmit,
    errors,
    reset,
    formState: { isSubmitting },
  } = useForm<InvoiceEditableFields>()

  const onSubmit = useCallback(
    async (values: any) => {
      try {
        await mutator<{ isSuccessful: boolean }, InvoiceLineCreateBodyArgs>(
          '/api/v1/invoice-line-items/create',
          {
            createLineItem: {
              invoiceId,
              lineItemTotal: values.lineItemTotal,
              dueDate: values.dueDate,
            },
          }
        )
        await revalidate()
        reset()
        toggleSnackbar({
          isOpen: true,
          severity: 'success',
          message: 'Success!',
        })
      } catch (e) {
        toggleSnackbar({
          isOpen: true,
          severity: 'error',
          message: e.toString(),
        })
      }
    },
    [revalidate, invoiceId, reset, toggleSnackbar]
  )

  return (
    <Grid container spacing={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container alignItems={'center'} justify={'space-evenly'}>
          <Grid item xs={12} sm={6}>
            <Input
              autoFocus
              required
              control={control}
              rules={{ required: true, min: 0 }}
              type={'number'}
              name={UpdateBillFields.LINE_ITEM_TOTAL}
              label={'Line Item Amount Due'}
              isError={!!errors.lineItemTotal}
              htmlFor={UpdateBillFields.LINE_ITEM_TOTAL}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Please choose due date</InputLabel>
              <Controller
                name={UpdateBillFields.DATE_DUE}
                as={
                  <KeyboardDatePicker
                    autoOk
                    disablePast
                    animateYearScrolling
                    value={selectedDate}
                    format="yyyy/MM/dd hh:mm a"
                    orientation={'landscape'}
                    variant={'static'}
                    onChange={onDatePickerChange}
                  />
                }
                control={control}
              />
            </FormControl>
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
          <Typography>{isSubmitting ? 'Submitting' : 'Submit'}</Typography>
        </Button>
      </form>
    </Grid>
  )
}
