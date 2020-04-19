/**
 * A table to display the products in a customer's cart for the POS and perhaps the receipts
 */
import { Column } from 'material-table'
import React from 'react'

import {
  CustomerOrderProductInCart,
  CustomerOrderProductKeys,
} from '@Types/customer-order'
import { camelCaseToFormal } from '@Utils/common'
import Table from '@Components/Elements/Table/table'
import { RootStateType } from '@Store/modules/types'
import { connect } from 'react-redux'

type CustomerOrderProductsProps = ReturnType<typeof mapStateToProps>

function CustomerOrderProducts({
  customerOrderProducts,
}: CustomerOrderProductsProps) {
  const tableRowColumns: Partial<CustomerOrderProductInCart> = {
    id: undefined,
    name: undefined,
    category: undefined,
    price: undefined,
    deliveryFee: undefined,
    quantity: undefined,
    storeLocationId: undefined,
  }
  const columnData: Array<Column<CustomerOrderProductInCart>> = Array.from(
    Object.keys(
      tableRowColumns as CustomerOrderProductInCart
    ) as CustomerOrderProductKeys[]
  ).map((key) => {
    switch (key) {
      case 'id':
        return {
          title: 'PRODUCT ID',
          field: key,
          editable: 'never',
          readonly: true,
          cellStyle: {
            whiteSpace: 'pre',
          },
        }
      case 'name':
        return {
          title: 'PRODUCT NAME',
          field: key,
          editable: 'never',
          cellStyle: {
            minWidth: `300px`,
            whiteSpace: 'pre',
          },
        }
      case 'quantity':
        return {
          title: 'QUANTITY',
          field: key,
          type: 'numeric',
          editable: 'onUpdate',
          cellStyle: {
            whiteSpace: 'pre',
          },
        }
      case 'category':
        return {
          title: 'CATEGORY',
          field: key,
          editable: 'never',
          readonly: true,
        }
      case 'deliveryFee':
      case 'price':
        return {
          title: camelCaseToFormal(key).toUpperCase(),
          field: key,
          editable: 'never',
          readonly: true,
          type: 'currency',
          cellStyle: {
            whiteSpace: 'pre',
            textAlign: 'left',
          },
        }
      default:
        return {
          title: camelCaseToFormal(key).toUpperCase(),
          field: key,
          editable: 'never',
          readonly: true,
          cellStyle: {
            whiteSpace: 'pre',
          },
        }
    }
  })

  const tableData: Array<CustomerOrderProductInCart> = Array.from(
    customerOrderProducts.entries()
  ).map(([id, { unitCost, ...orderProductDetails }]) => ({
    id,
    ...orderProductDetails,
    price: unitCost,
  }))

  return (
    <Table
      style={{ height: '100%' }}
      title={'Customer Order Products'}
      editable={{
        onRowAdd: undefined,
        onRowDelete: undefined,
        onRowUpdate: undefined,
      }}
      optionsToMerge={{
        padding: 'dense',
      }}
      columns={columnData as Column<Partial<CustomerOrderProductInCart>>[]}
      data={tableData}
    />
  )
}

const mapStateToProps = (state: RootStateType) => ({
  customerOrderProducts: state.customerOrderReducer.orderProducts,
})

export default connect(mapStateToProps)(CustomerOrderProducts)
