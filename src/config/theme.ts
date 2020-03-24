import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#b8bdd7',
    },
    secondary: {
      main: '#b7d7d3',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#000',
    },
  },
})

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#16181f',
    },
    secondary: {
      main: '#03211c',
    },
    error: {
      main: red.A700,
    },
    background: {
      default: '#f7f7f7',
    },
  },
})
