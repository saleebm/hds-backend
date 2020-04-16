import {
  Customer,
  CustomerCreateWithoutCustomerOrderInput,
  CustomerUpdateArgs,
} from '@prisma/client'

export interface CreateCustomerArgs {
  createCustomer: CustomerCreateWithoutCustomerOrderInput
}

export interface CustomerCreatedResponse {
  customer: Customer
}

export interface UpdateOneBody {
  updateCustomer: CustomerUpdateArgs
}

export interface CustomerUpdatedResponse {
  customer: Customer
}

export type CustomerEditableFields = Omit<
  Customer,
  'idCustomer' | 'createdAt' | 'updatedAt' | 'zipCode'
> & {
  zipCode: number | string
}
