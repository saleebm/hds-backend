import { useForm } from 'react-hook-form'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { motion, Variants } from 'framer-motion'

import Button from '@material-ui/core/Button'
import { AddCircleOutlineOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  TextField,
  Theme,
} from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { ProductWithInventory } from '@Pages/dashboard/products'
import { RootAction } from '@Store/modules/root-action'
import {
  addOrUpdateProductOrderInCustomerSaleAction,
  removeProductOrderInCustomerSaleAction,
} from '@Store/modules/customer-order/action'
import { useDebouncedCallback } from '@Utils/hooks'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import {
  CustomerOrderProductInCart,
  CustomerOrderProductsPOS,
} from '@Types/customer-order'
import { RootStateType } from '@Store/modules/types'
import { CustomerOrderActionTypes } from '@Store/modules/customer-order/types'
import { formatCurrencyOutput, formatMoney } from '@Utils/common'

type ProductLookup = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> & {
    products: ReadonlyArray<ProductWithInventory>
    currentEmployee: FindOneEmployee
    storeLocationIdOptions: StoreLocationsIdOptions
  }

interface ProductEnterInPosForm {
  product: string
  quantity: number
}

enum ProductLookupFields {
  product = 'product',
  quantity = 'quantity',
}

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: 0,
    padding: theme.spacing(1),
    height: '115px',
  },
  title: {
    margin: '1rem 0',
  },
  form: {
    padding: theme.spacing(1),
    margin: `${theme.spacing(3)}px auto`,
    height: '225px',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  formFields: {
    flexGrow: 1,
  },
  quantityInfo: {
    padding: `${theme.spacing(3)}px 0`,
    flex: 1,
    flexShrink: 0,
  },
  addProductButton: {
    alignSelf: 'flex-end',
  },
  hiddenContainer: {
    minHeight: '150px',
    margin: `${theme.spacing(3)}px 0`,
    padding: theme.spacing(1),
  },
  priceTagSpan: {
    '&> span': {
      fontVariant: 'tabular-nums',
      fontVariationSettings: `'wght' 700, 'slnt' -100`,
      '&:nth-child(2)': {
        fontFeatureSettings: `'numr'`,
      },
    },
  },
}))

const MotionCard = motion.custom(Card)

/**
 * This allows the employee to search for products by inventory and enter the quantity, then add that to store.
 * @param products
 * @param currentEmployee
 * @param addOrUpdateProduct
 * @param removeProduct
 * @param storeLocationIdOptions
 * @param currentProducts
 * @constructor
 */
function ProductLookup({
  products,
  currentEmployee,
  addOrUpdateProduct,
  removeProduct,
  storeLocationIdOptions,
  currentProducts,
}: ProductLookup) {
  const classes = useStyles()
  const { register, reset, errors, handleSubmit } = useForm<
    ProductEnterInPosForm
  >()
  /*
   * the currently selected product in the add product row
   */
  const [currentProductInSelect, setCurrentProductSelected] = useState<
    CustomerOrderProductInCart | undefined
  >(undefined)
  // the store location to pick inventory from
  const [storeLocationIdForInventory, setStoreLocationId] = useState<number>(
    currentEmployee.employee?.storeLocationId ||
      storeLocationIdOptions[0].idStoreLocations
  )

  const customerOrderProductOptions: CustomerOrderProductsPOS = useMemo(
    () =>
      products.map((product) => ({
        name: `${product.brand} ${product.description}`,
        category: product.productCategory,
        id: product.idProduct,
        price: product.unitPrice,
        quantity:
          product.inventory.filter(
            (inventory) =>
              inventory.storeLocation === storeLocationIdForInventory
          )[0]?.quantityOnHand || 0,
        storeLocationId: storeLocationIdForInventory,
      })),
    [products, storeLocationIdForInventory]
  )

  const handleStoreLocationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setStoreLocationId(event.target.value as number)
  }

  const [setProductSelectedCallback] = useDebouncedCallback(
    async (productInSelection: CustomerOrderProductInCart | undefined) => {
      setCurrentProductSelected(productInSelection)
    },
    300,
    {
      maxWait: 1500,
      leading: true,
      trailing: false,
    }
  )

  const onProductAdd = useCallback(
    async (productToEnter: ProductEnterInPosForm) => {
      if (
        !!currentProductInSelect &&
        !!productToEnter &&
        'quantity' in productToEnter
      ) {
        await addOrUpdateProduct({
          addOrUpdateProduct: {
            perUnitCost: currentProductInSelect.price,
            productId: currentProductInSelect.id,
            category: currentProductInSelect.category,
            name: currentProductInSelect.name,
            quantity: productToEnter.quantity,
            storeLocationId: currentProductInSelect.storeLocationId,
          },
          actionType: CustomerOrderActionTypes.AddOrderProduct,
        })
        setCurrentProductSelected(undefined)
        reset()
      }
    },
    [currentProductInSelect, addOrUpdateProduct, reset]
  )

  const hiddenVariants: Variants = {
    hidden: {
      opacity: 0,
      scaleX: 1,
      scaleY: 0,
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      transition: {
        ease: 'anticipate',
        duration: 0.3,
        mass: 200,
      },
    },
  }

  return (
    <Container disableGutters maxWidth={false} component={'section'}>
      <Grid container justify={'flex-start'} spacing={2}>
        <Grid className={classes.title} item>
          <Typography variant={'h4'}>Transaction</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        alignItems={'baseline'}
        justify={'flex-start'}
      >
        <Grid item>
          <Typography variant={'h5'} color={'secondary'}>
            Customer Order Products
          </Typography>
        </Grid>
      </Grid>
      <form
        title={'add products to customer order form'}
        onSubmit={handleSubmit(onProductAdd)}
        className={classes.form}
        tabIndex={-1}
      >
        <Grid
          container
          alignItems={'stretch'}
          justify={'space-evenly'}
          spacing={1}
          className={classes.formFields}
        >
          <Grid item xs={12} sm={6}>
            <Autocomplete
              id={'product-lookup-input'}
              options={customerOrderProductOptions}
              blurOnSelect
              clearOnEscape
              disablePortal
              autoSelect
              autoComplete
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              getOptionDisabled={(option) =>
                option.quantity === 0 ||
                (currentProducts &&
                  'has' in currentProducts &&
                  currentProducts.has(option.id))
              }
              groupBy={(option) => option.category}
              onChange={(
                event: ChangeEvent<any>,
                value: CustomerOrderProductInCart | null
              ) => setProductSelectedCallback(value || undefined)}
              aria-required
              openOnFocus
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Select product'}
                  variant={'outlined'}
                  fullWidth
                  inputRef={register({ required: true })}
                  size={'medium'}
                  name={ProductLookupFields.product}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.quantityInfo}>
            <Box alignItems={'center'}>
              <FormControl
                variant={'filled'}
                fullWidth
                className={classes.formControl}
                disabled={!currentProductInSelect}
                error={!!errors.quantity}
                aria-errormessage={
                  (!!errors.quantity && (errors.quantity.message as string)) ||
                  undefined
                }
              >
                <InputLabel htmlFor={'quantity-select'}>Quantity</InputLabel>
                <Input
                  name={ProductLookupFields.quantity}
                  inputRef={register({
                    required: { value: true, message: 'This is required' },
                    min: { value: 1, message: 'Must be at least one.' },
                    max: {
                      value: currentProductInSelect?.quantity || 1,
                      message: `Max quantity is ${currentProductInSelect?.quantity}`,
                    },
                  })}
                  id={'quantity-select'}
                  type={'number'}
                  error={!!errors.quantity}
                  aria-describedby={
                    (errors.quantity?.type &&
                      `error-quantity-${errors.quantity?.type}`) ||
                    undefined
                  }
                />
                {!!currentProductInSelect && (
                  <FormHelperText error={false} variant={'standard'}>
                    <Typography variant={'caption'} color={'textSecondary'}>
                      Available in stock: {currentProductInSelect?.quantity}
                    </Typography>
                  </FormHelperText>
                )}
                {!!errors.quantity && errors.quantity.type && (
                  <FormHelperText id={`error-quantity-${errors.quantity.type}`}>
                    {errors.quantity.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl
              variant={'filled'}
              fullWidth
              className={classes.formControl}
            >
              <InputLabel htmlFor={'store-location-select'}>
                Store Location for Inventory
              </InputLabel>
              <Select
                variant={'filled'}
                disableUnderline
                value={storeLocationIdForInventory}
                onChange={handleStoreLocationChange}
                inputProps={{
                  name: 'store-location',
                  id: 'store-location-select',
                }}
              >
                {storeLocationIdOptions.map((loc) => (
                  <MenuItem
                    key={loc.idStoreLocations}
                    value={loc.idStoreLocations}
                  >
                    <span dangerouslySetInnerHTML={{ __html: `${loc.city}` }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          className={classes.hiddenContainer}
          container
          spacing={3}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid item xs={12} sm={8}>
            <MotionCard
              variant={'elevation'}
              component={'article'}
              variants={hiddenVariants}
              initial={'hidden'}
              animate={!!currentProductInSelect ? 'visible' : 'hidden'}
            >
              <CardHeader
                avatar={
                  <Avatar>
                    {currentProductInSelect?.name.slice(0, 1).toUpperCase()}
                  </Avatar>
                }
                title={currentProductInSelect?.name || ''}
                subheader={currentProductInSelect?.category || ''}
              />
              <CardContent>
                <Grid spacing={1} container>
                  <Grid item xs={12} sm={4}>
                    <Typography variant={'h5'}>Category: </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      variant={'body1'}
                      component={'p'}
                      color={'textSecondary'}
                    >
                      {currentProductInSelect?.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant={'h5'}>Price: </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      variant={'body1'}
                      component={'p'}
                      color={'textSecondary'}
                    >
                      <span
                        className={classes.priceTagSpan}
                        dangerouslySetInnerHTML={{
                          __html: `${formatCurrencyOutput(
                            formatMoney(currentProductInSelect?.price || 0)
                          )}`,
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          alignItems={'flex-end'}
          justify={'flex-end'}
        >
          <Grid item>
            <Button
              className={classes.addProductButton}
              startIcon={<AddCircleOutlineOutlined />}
              size={'large'}
              variant={'contained'}
              type={'submit'}
              disabled={!currentProductInSelect}
              title={'Add product to customer order'}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const mapStateToProps = (state: RootStateType) => ({
  currentProducts: state.customerOrderReducer.orderProducts,
})
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      addOrUpdateProduct: addOrUpdateProductOrderInCustomerSaleAction,
      removeProduct: removeProductOrderInCustomerSaleAction,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProductLookup)
