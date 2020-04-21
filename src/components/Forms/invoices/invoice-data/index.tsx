import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Box, Grid } from '@material-ui/core'

import { InvoiceData } from '@Types/invoices'

interface InvoiceDataProps {
  invoiceData: InvoiceData
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    details: {
      alignItems: 'center',
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
export function InvoiceDataView({ invoiceData }: InvoiceDataProps) {
  const classes = useStyles()
  return (
    <Box component={'section'} className={classes.root}>
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Typography variant={'h4'} className={classes.heading}>
            Customer Order Information | ID #{invoiceData.idCustomerOrder}
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
              <Grid item xs={2}>
                <Typography className={classes.secondaryHeading}>
                  Store Location ID
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={0}></Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Box>
  )
}
