import { useCallback, useEffect, useState } from 'react'
import { FindManyCustomerArgs } from '@prisma/client'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

import { CustomerFindManyReturn } from '@Pages/api/v1/customers/find-many'
import mutator from '@Lib/server/mutator'

interface CustomerSelectType {
  name: string
  customerId: number
}

/**
 * Looks up the customer
 */
export function CustomerLookupForm() {
  // options for the select field,
  const [options, setOptions] = useState<CustomerSelectType[]>([])
  const [open, setOpen] = useState(false)
  const loading = open && options.length === 0
  // look up all customers
  const customers = useCallback(async () => {
    try {
      const data = await mutator<CustomerFindManyReturn, FindManyCustomerArgs>(
        '/api/v1/customers/find-many',
        { orderBy: { firstName: 'asc' } }
      )
      return {
        customers: data.customers || undefined,
      }
    } catch (e) {
      throw new Error(e)
    }
  }, [])

  useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    ;(async () => {
      const response = await customers()

      if (active && response.customers && Array.isArray(response.customers)) {
        setOptions(
          response.customers.map((cust) => ({
            customerId: cust.idCustomer,
            name: `${cust.firstName} ${cust.lastName}`,
          }))
        )
      }
    })()

    return () => {
      active = false
    }
  }, [loading, customers])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  const onInputChange: (
    event: object,
    value: CustomerSelectType | null
  ) => void = (event, value) => {
    console.log(event, value)
  }

  return (
    <Autocomplete
      id="customer-lookup-input"
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onChange={onInputChange}
      clearOnEscape
      blurOnSelect
      disablePortal
      getOptionSelected={(option, value) =>
        option.customerId === value.customerId
      }
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select customer"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
