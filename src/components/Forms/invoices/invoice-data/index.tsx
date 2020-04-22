import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Box, Grid } from '@material-ui/core'
import { Calendar } from '@material-ui/pickers'
import { darken } from '@material-ui/core/styles/colorManipulator'
import { InvoiceData, InvoiceLineItemsMod } from '@Types/invoices'
import { formatCurrencyOutput, formatMoney } from '@Utils/common'

interface InvoiceDataProps {
  invoiceData: InvoiceData
  invoiceLineItems: InvoiceLineItemsMod[] | undefined
  isValidating: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(19),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(17),
      color: theme.palette.text.secondary,
      fontVariationSettings: "'wght' 700, 'GRAD' 100, 'slnt' -33",
    },
    details: {
      alignItems: 'center',
    },
    info: {
      fontSize: theme.typography.pxToRem(15),
    },
    spanWithDetails: {
      display: 'inline-flex',
      flexFlow: 'row nowrap',
      width: '100%',
      justifyContent: 'stretch',
      alignItems: 'center',
      textAlign: 'left',
      fontVariationSettings: '"wght" 700',
      '& > *': {
        paddingRight: theme.spacing(1),
        width: '100%',
      },
      '& > *:not(:first-child)': {
        flexGrow: 1,
      },
    },
    multiRowInfo: {
      display: 'flex',
      flexDirection: 'column',
      whiteSpace: 'pre-wrap',
      alignContent: 'flex-start',
      justifyContent: 'center',
      alignItems: 'space-between',
      padding: `0 ${theme.spacing(1)}px`,
    },
    headerRow: {
      borderBottom: `1px solid ${theme.palette.secondary.dark}`,
    },
    infoRow: {
      padding: `${theme.spacing(3)}px 0`,
      backgroundColor: darken(theme.palette.secondary.dark, 0.1),
      color: theme.palette.secondary.contrastText,
      '&:nth-child(even)': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
      },
      '& p': {
        marginLeft: theme.spacing(1),
      },
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
    focusedPanel: {
      '&.Mui-focused': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
      },
    },
  })
)

/**
 * Utility view, displays the single invoice in table view
 * Show the order info as one row
 * Show any job fees
 * Show the total amount due
 *
 */
export function InvoiceDataView({
  invoiceData,
  invoiceLineItems,
  isValidating,
}: InvoiceDataProps) {
  const classes = useStyles()
  return (
    <Box component={'section'} className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          className={classes.focusedPanel}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant={'h4'} className={classes.heading}>
            Customer Order Products | ID #{invoiceData.idCustomerOrder}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Grid container spacing={1} direction={'column'}>
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <Typography className={classes.secondaryHeading}>
                  Order Product
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.secondaryHeading}>
                  Store Location
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.secondaryHeading}>
                  Quantity
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.secondaryHeading}>
                  Unit Cost
                </Typography>
              </Grid>
            </Grid>
            {invoiceData.customerOrderProducts.map((orderProduct) => (
              <Grid
                key={orderProduct.idCustomerOrderProducts}
                container
                spacing={0}
                className={classes.infoRow}
              >
                <Grid item xs={4}>
                  <Typography className={classes.info}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${orderProduct.product.brand} - ${orderProduct.product.description}`,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.info}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${orderProduct.storeLocation.city} - ID #${orderProduct.storeLocationIdOfInventory}`,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.info}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${orderProduct.quantity}`,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.info}>
                    <span
                      className={classes.priceTagSpan}
                      dangerouslySetInnerHTML={{
                        __html: `${formatCurrencyOutput(
                          formatMoney(orderProduct.perUnitCost)
                        )}`,
                      }}
                    />
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          className={classes.focusedPanel}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography variant={'h4'} className={classes.heading}>
            Order Information - Customer, Employee, Store Location, &amp;
            Delivery
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Grid container spacing={1} direction={'column'}>
            <Grid container spacing={0}>
              <Grid item xs={3}>
                <Typography className={classes.secondaryHeading}>
                  Customer
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className={classes.secondaryHeading}>
                  Employee
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className={classes.secondaryHeading}>
                  Store Location
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className={classes.secondaryHeading}>
                  Expected Delivery Date
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0} className={classes.infoRow}>
              <Grid item xs={3} className={classes.multiRowInfo}>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.customer.lastName}, ${invoiceData.customer.firstName} ${invoiceData.customer.middleInitial}</span>`,
                    }}
                  />
                </Typography>
                <Typography className={classes.info} component={'p'}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.customer.address}, ${invoiceData.customer.city} ${invoiceData.customer.state}, ${invoiceData.customer.zipCode}</span>`,
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={3} className={classes.multiRowInfo}>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.employee.lastName}, ${invoiceData.employee.firstName}</span>`,
                    }}
                  />
                </Typography>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.employee.positionName}</span>`,
                    }}
                  />
                </Typography>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.employee.roleCapability}</span>`,
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={3} className={classes.multiRowInfo}>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>ID #${invoiceData.storeLocationId} - ${invoiceData.storeLocations.city}</span>`,
                    }}
                  />
                </Typography>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.storeLocations.address}, ${invoiceData.storeLocations.city} ${invoiceData.storeLocations.state} ${invoiceData.storeLocations.zipCode}</span>`,
                    }}
                  />
                </Typography>
                <Typography className={classes.info}>
                  <span
                    className={classes.spanWithDetails}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${invoiceData.storeLocations.phone}</span>`,
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={3} className={classes.multiRowInfo}>
                <Calendar
                  date={new Date(invoiceData.expectedDeliveryDate)}
                  onChange={() => {}}
                  disableFuture
                  disablePast
                />
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          className={classes.focusedPanel}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography variant={'h4'} className={classes.heading}>
            Invoice Line Items
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={1} direction={'column'}>
            <Grid container spacing={0}>
              <Grid item xs={2}>
                <Typography className={classes.secondaryHeading}>
                  Invoice Line Item ID
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography className={classes.secondaryHeading}>
                  Amount Due
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography className={classes.secondaryHeading}>
                  Due Date
                </Typography>
              </Grid>
            </Grid>
            {Array.isArray(invoiceLineItems) ? (
              invoiceLineItems.map((lineItem: InvoiceLineItemsMod) => (
                <Grid
                  key={lineItem.idinvoiceLineItem}
                  container
                  spacing={0}
                  className={classes.infoRow}
                >
                  <Grid item xs={2}>
                    <Typography className={classes.secondaryHeading}>
                      {lineItem.idinvoiceLineItem}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography className={classes.secondaryHeading}>
                      {lineItem.lineItemTotal}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography className={classes.secondaryHeading}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${Intl.DateTimeFormat('en-US').format(
                            new Date(lineItem.dueDate || 0)
                          )}`,
                        }}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid container spacing={0} className={classes.infoRow}>
                <Grid item xs={12}>
                  <Typography variant={'subtitle1'}>No data yet</Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Box>
  )
}
