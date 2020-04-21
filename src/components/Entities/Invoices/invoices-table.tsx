import { Column } from 'material-table'
import Table from '@Components/Elements/Table/table'
import {
  camelCaseToFormal,
  formatCurrencyOutput,
  formatMoney,
} from '@Utils/common'
import { InvoiceSingle, InvoicesServerSideProps } from '@Types/invoices'
import { Typography } from '@material-ui/core'
import { MaterialNextBtn } from '@Components/Elements/Button'

type InvoiceData = {
  invoices: InvoicesServerSideProps
}

type InvoicesTableKey = keyof InvoiceSingle | 'tableData'

export function InvoicesTable({ invoices }: InvoiceData) {
  if (!Array.isArray(invoices)) {
    return <Typography variant={'h2'}>No invoice data found.</Typography>
  }

  const columnData: Array<Column<Partial<InvoiceSingle>>> = Array.from(
    Object.keys(invoices[0] as InvoiceSingle) as InvoicesTableKey[]
  )
    .filter(
      (key) =>
        key !== 'tableData' &&
        key !== 'storeLocationId' &&
        key !== 'employeeId' &&
        key !== 'customerId' &&
        key !== 'customerOrderId'
    )
    .map((value) => {
      switch (value) {
        case 'idInvoice':
          return {
            title: 'INVOICE ID',
            field: value,
            editable: 'never',
            readonly: true,
            render: (rowData: Partial<InvoiceSingle>) => (
              <MaterialNextBtn
                variant={'text'}
                style={{ whiteSpace: 'pre' }}
                nextLinkProps={{
                  href: '/dashboard/invoices/[customerOrderId]',
                  as: `/dashboard/invoices/${rowData.customerOrderId}`,
                }}
              >
                <Typography variant={'subtitle1'}>
                  View Full Invoice #{rowData.idInvoice}
                </Typography>
              </MaterialNextBtn>
            ),
          }
        case 'jobId':
          return {
            title: 'JOB ID',
            field: value,
            editable: 'never',
            readonly: true,
          }
        case 'invoiceTotal':
        case 'jobFeeTotal':
        case 'orderTotal':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            type: 'currency',
            field: value,
            editable: 'never',
          }
        case 'storeLocations':
          return {
            title: 'LOCATION',
            field: value,
            render: (rowData: Partial<InvoiceSingle>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.storeLocations?.city}, ${rowData.storeLocations?.state} - ID #${rowData.storeLocations?.idStoreLocations}`,
                  }}
                />
              </Typography>
            ),
          }
        case 'customerOrder':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            render: (rowData: Partial<InvoiceSingle>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${formatCurrencyOutput(
                      formatMoney(rowData.customerOrder?.orderTotal || 0)
                    )} - ID #${rowData.customerOrder?.idCustomerOrder}`,
                  }}
                />
              </Typography>
            ),
          }
        case 'employee':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            render: (rowData: Partial<InvoiceSingle>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.employee?.lastName}, ${rowData.employee?.firstName} 
                    - ID #${rowData.employee?.employeeId}`,
                  }}
                />
              </Typography>
            ),
          }
        case 'customer':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            render: (rowData: Partial<InvoiceSingle>) => (
              <Typography variant={'body2'}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${rowData.customer?.lastName}, ${rowData.customer?.firstName} ${rowData.customer?.middleInitial} 
                     - ID #${rowData.customer?.idCustomer}`,
                  }}
                />
              </Typography>
            ),
          }
        case 'dueDate':
        case 'paidDate':
        case 'createdAt':
        case 'updatedAt':
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            field: value,
            editable: 'never',
            readonly: true,
            type: 'datetime',
          }
        default:
          return {
            title: camelCaseToFormal(value).toUpperCase(),
            editable: 'always',
            field: value,
            ...(value !== 'tableData' &&
            value in invoices[0] &&
            invoices[0][value] &&
            typeof invoices[0][value] === 'number'
              ? { type: 'numeric' }
              : {}),
          }
      }
    })

  return (
    <Table
      editable={{
        onRowAdd: undefined,
        onRowUpdate: undefined,
        onRowDelete: undefined,
      }}
      title={'Invoices'}
      columns={columnData}
      data={invoices as InvoicesServerSideProps}
    />
  )
}
