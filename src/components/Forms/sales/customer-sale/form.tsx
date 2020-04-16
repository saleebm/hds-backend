import { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import Router from 'next/router'

import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import { ArrowBack, ArrowForward } from '@material-ui/icons'
import { Button } from '@material-ui/core'

import Transaction from '@Components/Forms/sales/customer-sale/transaction'
import CustomerInfo from '@Components/Forms/sales/customer-sale/customer-info'

import { RootStateType } from '@Store/modules/types'
import { AnimationWrapper } from '@Components/Elements/AnimateWrapper'
import { ProductWithInventory } from '@Pages/dashboard/products'

type CustomerSaleProps = ReturnType<typeof mapStateToProps> & {
  products: ReadonlyArray<ProductWithInventory>
}

const mapStateToProps = (state: RootStateType) => {
  return {
    customerOrderState: state.customerOrderReducer,
  }
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    },
    moveButtons: {
      maxWidth: '350px',
      marginTop: theme.spacing(3),
    },
  })
)

/**
 * wizard step form
 */
export default connect(mapStateToProps)(function CustomerSale({
  customerOrderState,
  products,
}: CustomerSaleProps) {
  const classes = useStyles()

  const [step, setStep] = useState<0 | 1>(0)
  const { customerId } = customerOrderState || {}
  // the entire first step is about the customer!
  const [canMoveToTransaction, setCanMoveToTransaction] = useState(false)

  useEffect(() => {
    //cant be 0.. duh
    if (!!customerId && !isNaN(customerId)) {
      setCanMoveToTransaction(true)
    } else {
      setCanMoveToTransaction(false)
    }
  }, [customerId, canMoveToTransaction])

  const moveForward = useCallback(async () => {
    await Router.push(
      { pathname: Router.pathname, query: { step: 'transaction' } },
      undefined,
      { shallow: true }
    )
    setStep(1)
  }, [setStep])

  const moveBack = useCallback(async () => {
    await Router.push(
      { pathname: Router.pathname, query: { step: 'customer-info' } },
      undefined,
      { shallow: true }
    )
    setStep(0)
  }, [setStep])

  /*
   *todo
   * the submit button here
   * - canSubmit
   * - onSubmit
   */

  return (
    <Container className={classes.root} maxWidth={false}>
      <AnimatePresence exitBeforeEnter>
        <AnimationWrapper animateOn={step}>
          {step === 0 && <CustomerInfo />}
          {step === 1 && <Transaction products={products} />}
        </AnimationWrapper>
      </AnimatePresence>
      {step === 1 && (
        <Button
          variant={'contained'}
          className={classes.moveButtons}
          title={'Back to choose or create customer'}
          endIcon={<ArrowBack />}
          onClick={moveBack}
        >
          Back
        </Button>
      )}
      {step === 0 && (
        <Button
          className={classes.moveButtons}
          variant={'contained'}
          disabled={!canMoveToTransaction}
          aria-disabled={!canMoveToTransaction}
          title={'Next to pick products'}
          endIcon={<ArrowForward />}
          onClick={moveForward}
        >
          Next
        </Button>
      )}
    </Container>
  )
})
