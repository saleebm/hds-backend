import { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import { ArrowBack, ArrowForward, SendTwoTone } from '@material-ui/icons'
import { Button } from '@material-ui/core'

import Transaction from '@Components/Forms/sales/customer-sale/transaction'
import CustomerInfo from '@Components/Forms/sales/customer-sale/customer-info'

import { RootStateType } from '@Store/modules/types'
import { ProductWithInventory } from '@Pages/dashboard/products'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import { useQueryParams } from '@Utils/hooks'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import mutator from '@Lib/server/mutator'
import { CustomerOrderCreateInputBodyArgs } from '@Types/customer-order'
import {
  CustomerOrder,
  CustomerOrderProductsCreateWithoutCustomerOrderInput,
} from '@prisma/client'
import { useSnackbarContext } from '@Utils/context'
import { bindActionCreators, Dispatch } from 'redux'
import { RootAction } from '@Store/modules/root-action'
import { setStoreLocationAction } from '@Store/modules/customer-order/action'

type CustomerSaleProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
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

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ setStoreLocationId: setStoreLocationAction }, dispatch)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '700px',
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      position: 'relative',
    },
    moveButtons: {
      width: '100%',
      maxWidth: '400px',
      margin: `${theme.spacing(1)}px 0`,
    },
    contentBox: {
      height: '100%',
      width: '100%',
      position: 'relative',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      marginBottom: theme.spacing(3),
    },
    buttonContainer: {
      display: 'flex',
      flexFlow: 'column wrap',
      justifyContent: 'stretch',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      margin: `${theme.spacing(3)}px auto`,
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
  setStoreLocationId,
}: CustomerSaleProps) {
  const { toggleSnackbar } = useSnackbarContext()
  const classes = useStyles()
  const [query, setQuery] = useQueryParams()
  const [step, setStep] = useState<0 | 1>(0)
  const {
    customerId,
    orderTotal,
    expectedDeliveryDate,
    orderProducts,
    storeLocationId,
  } = customerOrderState || {}
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

  const { employee } = currentEmployee || {}

  //todo manager probably would not like this but who's snitching?!
  // set store location as employee's base location for now
  useEffect(() => {
    if (employee?.storeLocationId) {
      setStoreLocationId(employee?.storeLocationId)
    }
  }, [employee, setStoreLocationId])

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

  const canSubmit = useMemo(
    () => step === 1 && orderTotal > 0 && !!expectedDeliveryDate,
    [step, orderTotal, expectedDeliveryDate]
  )

  const onSubmit = useCallback(async () => {
    if (
      expectedDeliveryDate &&
      storeLocationId &&
      orderProducts &&
      'entries' in orderProducts &&
      Array.isArray(Array.from(orderProducts.entries()))
    ) {
      const createProducts: Array<CustomerOrderProductsCreateWithoutCustomerOrderInput> = Array.from(
        orderProducts.entries()
      ).map(([productId, { quantity, unitCost }]) => ({
        product: { connect: { idProduct: productId } },
        quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity,
        perUnitCost: unitCost,
      }))
      try {
        const createdOrder = await mutator<
          { customerOrder: CustomerOrder },
          { customerOrderCreate: CustomerOrderCreateInputBodyArgs }
        >('/api/v1/customer-orders/create', {
          customerOrderCreate: {
            expectedDeliveryDate,
            customer: { connect: { idCustomer: customerId } },
            storeLocationId,
            orderTotal,
            customerOrderProducts: { create: createProducts },
          },
        })
        if (createdOrder && createdOrder.customerOrder?.idCustomerOrder) {
          toggleSnackbar({
            isOpen: true,
            severity: 'success',
            message: `New Order Received: #${createdOrder.customerOrder?.idCustomerOrder}`,
          })
          await Router.replace('/dashboard/point-of-sale')
        }
      } catch (e) {
        toggleSnackbar({
          isOpen: true,
          severity: 'error',
          message: e.toString(),
        })
        console.error(e)
      }
    }
  }, [
    expectedDeliveryDate,
    customerId,
    orderProducts,
    orderTotal,
    storeLocationId,
    toggleSnackbar,
  ])

  return (
    <Container className={classes.root} maxWidth={false} disableGutters>
      <Box className={classes.contentBox}>
        {step === 0 && <CustomerInfo />}
        {step === 1 && (
          <Transaction
            products={products}
            currentEmployee={currentEmployee}
            storeLocationIdOptions={storeLocationIdOptions}
          />
        )}
      </Box>
      <Grid container>
        {step === 0 && (
          <Grid className={classes.buttonContainer} item xs={12}>
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
          </Grid>
        )}
        {step === 1 && (
          <>
            <Grid className={classes.buttonContainer} item xs={12} md={6}>
              <Button
                variant={'contained'}
                className={classes.moveButtons}
                title={'Back to choose or create customer'}
                startIcon={<ArrowBack />}
                onClick={moveBack}
                color={'secondary'}
                size={'large'}
              >
                Back
              </Button>
            </Grid>
            <Grid className={classes.buttonContainer} item xs={12} md={6}>
              <Button
                variant={'contained'}
                className={classes.moveButtons}
                size={'large'}
                title={'Create Order'}
                endIcon={<SendTwoTone />}
                onClick={onSubmit}
                color={'primary'}
                disabled={!canSubmit}
              >
                Create Order
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSale)
