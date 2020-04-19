import { connect } from 'react-redux'
import { useCallback, useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'

import { Grid, Typography, Paper } from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'

import { RootAction } from '@Store/modules/root-action'
import { setDeliveryAction } from '@Store/modules/customer-order/action'
import { makeStyles } from '@material-ui/core/styles'

interface DeliveryDatePicker extends ReturnType<typeof mapDispatchToProps> {}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
})
function DeliveryDatePicker({ setDeliveryDate }: DeliveryDatePicker) {
  const classes = useStyles()
  const [selectedDate, handleDateChange] = useState(new Date())
  const onChange = useCallback(
    (value) => {
      if (!!value) {
        handleDateChange(value)
        setDeliveryDate(value)
      }
    },
    [setDeliveryDate]
  )

  return (
    <Grid container spacing={3} justify={'center'} alignItems={'center'}>
      <Grid item xs={12}>
        <Paper className={classes.root} elevation={5} variant={'outlined'}>
          <Typography gutterBottom variant={'h4'}>
            Delivery Date
          </Typography>
          <KeyboardDatePicker
            autoOk
            disablePast
            animateYearScrolling
            value={selectedDate}
            format="yyyy/MM/dd hh:mm a"
            onChange={onChange}
            label="Please choose delivery date"
            orientation={'landscape'}
            variant={'static'}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ setDeliveryDate: setDeliveryAction }, dispatch)

export default connect(null, mapDispatchToProps)(DeliveryDatePicker)
