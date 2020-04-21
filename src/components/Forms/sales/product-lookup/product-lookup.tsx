import { useForm } from 'react-hook-form'
import React, {
  ChangeEvent,
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/NativeSelect'
import Box from '@material-ui/core/Box'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { ProductWithInventory } from '@Pages/dashboard/products'
import { RootAction } from '@Store/modules/root-action'
import { addProductOrderInCustomerSaleAction } from '@Store/modules/customer-order/action'
import { useDebouncedCallback } from '@Utils/hooks'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import {
  CustomerOrderProductInCart,
  CustomerOrderProductsPOS,
} from '@Types/customer-order'
import { RootStateType } from '@Store/modules/types'
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
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    position: 'relative',
  },
  form: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  formFields: {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
  },
  quantityInfo: {
    padding: `${theme.spacing(3)}px 0`,
    flex: 1,
    flexShrink: 0,
  },
  addProductButton: {
    alignSelf: 'flex-start',
    width: '200px',
  },
  hiddenContainer: {
    minHeight: '150px',
    margin: `${theme.spacing(1)}px 0`,
    paddingLeft: theme.spacing(1),
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
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const MotionCard = motion.custom(Card)

/**
 * This allows the employee to search for products by inventory and enter the quantity, then add that to store.
 * @param products
 * @param currentEmployee
 * @param addOrUpdateProduct
 * @param storeLocationIdOptions
 * @param currentProducts
 * @constructor
 */
function ProductLookup({
  products,
  currentEmployee,
  addOrUpdateProduct,
  storeLocationIdOptions,
  currentProducts,
}: ProductLookup) {
  const classes = useStyles()
  const { reset, errors, handleSubmit, register } = useForm<
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

  /**
   * the main object containing the order products to choose, and to insert from
   */
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
        deliveryFee: product.deliveryPrice,
      })),
    [products, storeLocationIdForInventory]
  )

  // make sure the quantity changes on store location input chosen
  useEffect(() => {
    const productOverThere = customerOrderProductOptions.find(
      (product) => product.id === currentProductInSelect?.id
    )
    setCurrentProductSelected(productOverThere)
  }, [
    storeLocationIdForInventory,
    currentProductInSelect,
    customerOrderProductOptions,
  ])

  const handleStoreLocationChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      if (event.target.value) {
        const locationChosen =
          typeof event.target.value === 'string'
            ? parseInt(event.target.value)
            : (typeof event.target.value === 'number' && event.target.value) ||
              storeLocationIdOptions[0].idStoreLocations

        if (!isNaN(locationChosen)) setStoreLocationId(locationChosen)
      }
    },
    [storeLocationIdOptions]
  )

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
        // besides the quantity, everything relies on the selected order product
        addOrUpdateProduct({
          product: {
            quantity: productToEnter.quantity,
            perUnitCost: currentProductInSelect.price,
            productId: currentProductInSelect.id,
            category: currentProductInSelect.category,
            name: currentProductInSelect.name,
            storeLocationId: currentProductInSelect.storeLocationId,
            deliveryFee: currentProductInSelect.deliveryFee,
          },
        })
        // reset the form to allow for more selections
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
    <StrictMode>
      <Grid
        container
        spacing={0}
        alignItems={'flex-start'}
        justify={'flex-start'}
      >
        <Grid item xs={12} sm={8} md={7}>
          <form
            title={'add products to customer order form'}
            onSubmit={handleSubmit(onProductAdd)}
            className={classes.form}
          >
            <Grid
              container
              alignItems={'stretch'}
              justify={'space-evenly'}
              spacing={1}
              className={classes.formFields}
            >
              <Grid item xs={12}>
                <Typography
                  className={classes.title}
                  variant={'h3'}
                  color={'secondary'}
                >
                  Add Products to Order
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
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
              <Grid item xs={12} sm={6} className={classes.quantityInfo}>
                <Box alignItems={'center'}>
                  <FormControl
                    variant={'filled'}
                    fullWidth
                    className={classes.formControl}
                    disabled={!currentProductInSelect}
                    error={!!errors.quantity}
                    aria-errormessage={
                      (!!errors.quantity &&
                        (errors.quantity.message as string)) ||
                      undefined
                    }
                  >
                    <InputLabel htmlFor={'quantity-select'}>
                      Quantity
                    </InputLabel>
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
                      <FormHelperText
                        id={`error-quantity-${errors.quantity.type}`}
                      >
                        {errors.quantity.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  variant={'filled'}
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel
                    id={'store-location-selector'}
                    htmlFor={'store-location-select'}
                  >
                    Store Location for Inventory
                  </InputLabel>
                  <Select
                    variant={'filled'}
                    id={'store-location-select-input'}
                    disableUnderline
                    value={storeLocationIdForInventory}
                    onChange={handleStoreLocationChange}
                    inputProps={{
                      name: 'store-location',
                      id: 'store-location-select',
                    }}
                  >
                    {storeLocationIdOptions.map((loc) => (
                      <option
                        dangerouslySetInnerHTML={{ __html: `${loc.city}` }}
                        key={loc.idStoreLocations}
                        value={loc.idStoreLocations}
                      />
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={0}
              alignItems={'center'}
              justify={'flex-start'}
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
        </Grid>
        <Grid item xs={12} sm={4} md={5}>
          <Grid
            className={classes.hiddenContainer}
            container
            spacing={0}
            justify={'center'}
            alignItems={'center'}
          >
            <Grid className={classes.cardContainer} item xs={12}>
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
                <CardContent color={'transparent'}>
                  <Grid spacing={2} container>
                    <Grid item xs={12} sm={6}>
                      <Typography variant={'h5'}>Category:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        align={'right'}
                        variant={'body1'}
                        component={'p'}
                        color={'textSecondary'}
                      >
                        {currentProductInSelect?.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant={'h5'}>Price:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant={'body1'}
                        component={'p'}
                        color={'textSecondary'}
                        align={'right'}
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
        </Grid>
      </Grid>
    </StrictMode>
  )
}

const mapStateToProps = (state: RootStateType) => ({
  currentProducts: state.customerOrderReducer.orderProducts,
})
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      addOrUpdateProduct: addProductOrderInCustomerSaleAction,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProductLookup)
