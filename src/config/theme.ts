import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#bf1650',
    },
    secondary: {
      main: '#ccc',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#0f111b',
      paper: '#081229',
    },
  },
})
