/**
 * A table to display the products in a customer's cart for the POS and perhaps the receipts
 */
import {
  CustomerOrderProductInCart,
  CustomerOrderProductKeys,
  CustomerOrderProductsPOS,
} from '@Types/customer-order'
import { Column } from 'material-table'
import { camelCaseToFormal } from '@Utils/common'
import { ReactElement } from 'react'

export function CustomerOrderProducts(
  orderProductsPOS: CustomerOrderProductsPOS,
  productLookupElement: ReactElement
) {
  const columnData: Array<Column<CustomerOrderProductInCart>> = Array.from(
    Object.keys(
      orderProductsPOS[0] as CustomerOrderProductInCart
    ) as CustomerOrderProductKeys[]
  ).map((key) => {
    switch (key) {
      case 'name':
        return {
          title: 'PRODUCT NAME',
          field: key,
          editable: 'onAdd',
        }
      case 'quantity':
        return {
          title: 'QUANTITY',
          field: key,
          type: 'numeric',
          editable: 'always',
        }
      case 'category':
        return {
          title: 'CATEGORY',
          field: key,
          editable: 'never',
          readonly: true,
        }
      case 'price':
        return {
          title: 'PRICE',
          field: key,
          editable: 'never',
          readonly: true,
          type: 'currency',
        }
      case 'id':
        return {
          title: 'PRODUCT ID',
          field: key,
          editable: 'never',
          readonly: true,
        }
      default:
        return {
          title: camelCaseToFormal(key).toUpperCase(),
          field: key,
          editable: 'never',
          readonly: true,
        }
    }
  })
  return <></>
}
