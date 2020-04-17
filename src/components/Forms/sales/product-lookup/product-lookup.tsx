import { ChangeEvent, useMemo, useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Theme } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import { ProductWithInventory } from '@Pages/dashboard/products'
import { RootAction } from '@Store/modules/root-action'
import {
  addOrUpdateProductOrderInCustomerSaleAction,
  removeProductOrderInCustomerSaleAction,
} from '@Store/modules/customer-order/action'
import { useDebouncedCallback } from '@Utils/hooks'
import { FindOneEmployee } from '@Pages/api/v1/employees'
import { makeStyles } from '@material-ui/core/styles'
import { StoreLocationsIdOptions } from '@Types/store-locations'
import {
  CustomerOrderProductInCart,
  CustomerOrderProductsPOS,
} from '@Types/customer-order'

type ProductLookup = ReturnType<typeof mapDispatchToProps> & {
  products: ReadonlyArray<ProductWithInventory>
  currentEmployee: FindOneEmployee
  storeLocationIdOptions: StoreLocationsIdOptions
}

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

function ProductLookup({
  products,
  currentEmployee,
  addOrUpdateProduct,
  removeProduct,
  storeLocationIdOptions,
}: ProductLookup) {
  const classes = useStyles()
  // the store location to
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

  const [setProducts] = useDebouncedCallback(
    async (productsInSelection: CustomerOrderProductInCart | null) => {
      console.log(productsInSelection)
    },
    300,
    {
      maxWait: 1500,
      leading: true,
      trailing: false,
    }
  )

  //todo
  // the autocomplete has to disable products already selected.

  //todo
  // make sure to clone the object (CustomerOrderProductInCart) and pass that to the table
  // to prevent the quantity from flipping in the table when searching other stores
  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel>Store Location for Inventory</InputLabel>
        <Select
          value={storeLocationIdForInventory}
          onChange={handleStoreLocationChange}
        >
          {storeLocationIdOptions.map((loc) => (
            <MenuItem key={loc.idStoreLocations} value={loc.idStoreLocations}>
              <span dangerouslySetInnerHTML={{ __html: `${loc.city}` }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        id={'product-lookup-input'}
        options={customerOrderProductOptions}
        blurOnSelect
        disablePortal
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        getOptionDisabled={(option) => option.quantity === 0}
        groupBy={(option) => option.category}
        onChange={(
          event: ChangeEvent<any>,
          value: CustomerOrderProductInCart | null
        ) => setProducts(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={'Select product'}
            variant={'outlined'}
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      addOrUpdateProduct: addOrUpdateProductOrderInCustomerSaleAction,
      removeProduct: removeProductOrderInCustomerSaleAction,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(ProductLookup)
