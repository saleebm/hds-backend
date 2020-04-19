import { bindActionCreators, Dispatch } from 'redux'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { RootStateType } from '@Store/modules/types'
import { RootAction } from '@Store/modules/root-action'
import { setOrderTotalAction } from '@Store/modules/customer-order/action'
import { formatCurrencyOutput, formatMoney } from '@Utils/common'

type PriceCalculatorProps = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>

interface PriceCalculatorProduct {
  quantity: number
  name: string
  unitCost: number
  deliveryFee: number
  id: number
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // the box
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.grey['700'],
    borderRadius: '7px',
    boxShadow: theme.shadows['3'],
    overflow: 'hidden',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  boxLeft: {
    fontVariant: 'petite-caps',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
  boxRight: {
    textAlign: 'right',
  },
  typography: {
    fontSize: '1.25rem',
    fontVariant: 'all-petite-caps',
  },
  typographyProduct: {
    fontVariant: 'small-caps',
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  priceTagSpan: {
    padding: `0 ${theme.spacing(3)}px`,
    '&> span': {
      fontVariant: 'tabular-nums',
      fontVariationSettings: `'wght' 700, 'slnt' -100`,
      '&:nth-child(2)': {
        fontFeatureSettings: `'numr'`,
      },
    },
  },
  row: {
    borderBottom: `1px solid ${theme.palette.grey['300']}`,
    flexShrink: 0,
    alignSelf: 'flex-start',
    '&:nth-child(even)': {
      backgroundColor: theme.palette.grey['800'],
    },
  },
  lineItems: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex-start',
  },
  endRow: {
    alignSelf: 'flex-end',
    flexShrink: 0,
  },
  topRow: {
    borderBottom: `2px solid ${theme.palette.grey['100']}`,
    '& > div:not(:last-child)': {
      borderRight: `1px solid ${theme.palette.grey['300']}`,
    },
  },
  headings: {
    fontVariant: 'petite-caps',
  },
  gridProminent: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
}))

function PriceCalculator({
  orderProducts,
  setOrderTotal,
  orderTotal,
}: PriceCalculatorProps) {
  const classes = useStyles()
  const [orderProductRef, setOrderProductRef] = useState<
    PriceCalculatorProduct[] | undefined
  >(undefined)

  // update the orderProductRef to recalculate totals
  useEffect(() => {
    if (!!orderProducts && 'entries' in orderProducts) {
      setOrderProductRef(
        Array.from(orderProducts.entries()).map(
          ([productId, { quantity, name, unitCost, deliveryFee }]) => ({
            quantity,
            name,
            unitCost,
            deliveryFee,
            id: productId,
          })
        )
      )
    }
  }, [orderProducts, setOrderProductRef])

  const totalProductsCharge = useMemo(
    () =>
      Array.isArray(orderProductRef)
        ? orderProductRef.reduce(
            (acc, curr) => acc + curr.quantity * curr.unitCost,
            0
          )
        : 0,
    [orderProductRef]
  )

  const totalDeliveryCharge = useMemo(
    () =>
      Array.isArray(orderProductRef)
        ? orderProductRef.reduce((acc, curr) => acc + curr.deliveryFee, 0)
        : 0,
    [orderProductRef]
  )

  const totalTaxes = useMemo(() => orderTotal - orderTotal / 1.065, [
    orderTotal,
  ])

  useEffect(() => {
    if (Array.isArray(orderProductRef)) {
      setOrderTotal()
    }
  }, [orderProductRef, setOrderTotal])

  return (
    <Grid className={classes.root} container spacing={0} direction={'column'}>
      <Grid className={classes.topRow} container direction={'row'} spacing={0}>
        <Grid className={classes.gridProminent} item xs={6}>
          <Typography
            align={'left'}
            className={classes.headings}
            variant={'h5'}
          >
            Product
          </Typography>
        </Grid>
        <Grid className={classes.gridProminent} item xs={3}>
          <Typography
            align={'center'}
            className={classes.headings}
            variant={'h5'}
          >
            Quantity
          </Typography>
        </Grid>
        <Grid className={classes.gridProminent} item xs={3}>
          <Typography
            align={'center'}
            className={classes.headings}
            variant={'h5'}
          >
            Total
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.lineItems}>
        {Array.isArray(orderProductRef) &&
          orderProductRef.map((product) => (
            <Grid
              key={product.id}
              direction={'row'}
              container
              spacing={0}
              className={classes.row}
            >
              <Grid className={classes.gridProminent} item xs={6}>
                <Typography
                  className={classes.typographyProduct}
                  component={'p'}
                  variant={'body1'}
                >
                  {product.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  align={'center'}
                  className={classes.typography}
                  component={'p'}
                  variant={'caption'}
                >
                  {product.quantity}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  component={'p'}
                  className={classes.typography}
                  variant={'caption'}
                >
                  <span
                    className={classes.priceTagSpan}
                    dangerouslySetInnerHTML={{
                      __html: `${formatCurrencyOutput(
                        formatMoney(product.quantity * product.unitCost)
                      )}`,
                    }}
                  />
                </Typography>
              </Grid>
            </Grid>
          ))}
      </Grid>
      <Grid container className={classes.endRow}>
        <Grid className={classes.row} container spacing={0}>
          <Grid className={classes.boxLeft} item xs={6}>
            <Typography className={classes.typography} variant={'caption'}>
              Products Total:
            </Typography>
          </Grid>
          <Grid className={classes.boxRight} item xs={6}>
            <Typography
              className={classes.typography}
              variant={'body1'}
              component={'p'}
              color={'textSecondary'}
            >
              <span
                className={classes.priceTagSpan}
                dangerouslySetInnerHTML={{
                  __html: `${formatCurrencyOutput(
                    formatMoney(totalProductsCharge)
                  )}`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid className={classes.row} container spacing={0}>
          <Grid className={classes.boxLeft} item xs={6}>
            <Typography className={classes.typography} variant={'caption'}>
              Delivery Total:
            </Typography>
          </Grid>
          <Grid className={classes.boxRight} item xs={6}>
            <Typography
              className={classes.typography}
              variant={'body1'}
              component={'p'}
              color={'textSecondary'}
            >
              <span
                className={classes.priceTagSpan}
                dangerouslySetInnerHTML={{
                  __html: `${formatCurrencyOutput(
                    formatMoney(totalDeliveryCharge)
                  )}`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid className={classes.row} container spacing={0}>
          <Grid className={classes.boxLeft} item xs={6}>
            <Typography className={classes.typography} variant={'caption'}>
              Taxes
            </Typography>
          </Grid>
          <Grid className={classes.boxRight} item xs={6}>
            <Typography
              className={classes.typography}
              variant={'body1'}
              component={'p'}
              color={'textSecondary'}
            >
              <span
                className={classes.priceTagSpan}
                dangerouslySetInnerHTML={{
                  __html: `${formatCurrencyOutput(formatMoney(totalTaxes))}`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid className={classes.row} container direction={'row'} spacing={0}>
          <Grid className={classes.boxLeft} item xs={6}>
            <Typography className={classes.typography} variant={'caption'}>
              Order Total:
            </Typography>
          </Grid>
          <Grid className={classes.boxRight} item xs={6}>
            <Typography
              className={classes.typography}
              variant={'body1'}
              component={'p'}
              color={'textSecondary'}
            >
              <span
                className={classes.priceTagSpan}
                dangerouslySetInnerHTML={{
                  __html: `${formatCurrencyOutput(
                    formatMoney(orderTotal || 0)
                  )}`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setOrderTotal: setOrderTotalAction,
    },
    dispatch
  )

const mapStateToProps = (state: RootStateType) => ({
  orderProducts: state.customerOrderReducer.orderProducts,
  orderTotal: state.customerOrderReducer.orderTotal,
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceCalculator)
