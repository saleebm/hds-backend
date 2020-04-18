import { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AnimatePresence } from 'framer-motion'

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
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import { useQueryParams } from '@Utils/hooks'
import Box from '@material-ui/core/Box'

type CustomerSaleProps = ReturnType<typeof mapStateToProps> & {
  products: ReadonlyArray<ProductWithInventory>
  currentEmployee: FindOneEmployee
  storeLocationIdOptions: StoreLocationsIdOptions
}

// the slugs used in the query
enum CustomerSaleSteps {
  CUSTOMER_INFO = 'customer-info',
  TRANSACTION = 'transaction',
}

const mapStateToProps = (state: RootStateType) => {
  return {
    customerOrderState: state.customerOrderReducer,
  }
}

const useStyles = makeStyles((theme: Theme) =>
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
    contentBox: {
      height: '100%',
      minHeight: '750px',
      width: '100%',
      padding: 0,
      margin: 0,
      position: 'relative',
    },
  })
)

/**
 * wizard step form containing the following two steps:
 *  1. lookup/create customer
 *  2. point of sale (set products, calculate total, seal the deal kinda thingy)
 */
function CustomerSale({
  customerOrderState,
  products,
  currentEmployee,
  storeLocationIdOptions,
}: CustomerSaleProps) {
  const classes = useStyles()
  const [query, setQuery] = useQueryParams()
  const [step, setStep] = useState<0 | 1>(0)
  const { customerId } = customerOrderState || {}
  // the entire first step is about the customer!
  const [canMoveToTransaction, setCanMoveToTransaction] = useState(false)

  // set move to transaction possibilities on change of customerId
  useEffect(() => {
    if (!!customerId && !isNaN(customerId)) {
      setCanMoveToTransaction(true)
    } else {
      setCanMoveToTransaction(false)
    }
  }, [customerId, canMoveToTransaction])

  // if step is customer info, but the query says transaction and there is a customer in store,
  // then move to the second step automatically
  useEffect(() => {
    if (
      step === 0 &&
      query &&
      'step' in query &&
      query.step.toString() === CustomerSaleSteps.TRANSACTION
    ) {
      if (!customerId) {
        // no customerId, you need to have a customer to sell to brah
        setQuery({ step: CustomerSaleSteps.CUSTOMER_INFO })
      } else {
        // if customerId then move forward
        setStep(1)
      }
    }
  }, [query, setQuery, customerId, step])

  const moveForward = useCallback(async () => {
    await setQuery({ step: CustomerSaleSteps.TRANSACTION })
    setStep(1)
  }, [setStep, setQuery])

  const moveBack = useCallback(async () => {
    await setQuery({ step: CustomerSaleSteps.CUSTOMER_INFO })
    setStep(0)
  }, [setStep, setQuery])

  /*
   *todo
   * the submit button here
   * - canSubmit
   * - onSubmit
   */

  /**
   *todo
   * also calculate the total on the fly async, don't forget tax (6.5%)
   */

  return (
    <Container className={classes.root} maxWidth={false}>
      <Box className={classes.contentBox}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <AnimationWrapper animateOn={step}>
            {step === 0 && <CustomerInfo />}
            {step === 1 && (
              <Transaction
                products={products}
                currentEmployee={currentEmployee}
                storeLocationIdOptions={storeLocationIdOptions}
              />
            )}
          </AnimationWrapper>
        </AnimatePresence>
      </Box>
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
}

export default connect(mapStateToProps)(CustomerSale)
