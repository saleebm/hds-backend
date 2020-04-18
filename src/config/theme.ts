import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes'

// Create a theme instance.
export const darkTheme = responsiveFontSizes(
  createMuiTheme({
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
    typography: {
      h1: {
        fontSize: '2rem',
        fontWeight: 500,
        letterSpacing: '-0.022em',
        fontVariant: 'petite-caps',
        textTransform: 'initial',
      },
      h2: {
        fontSize: '1.85rem',
        fontWeight: 400,
        letterSpacing: '-0.021em',
        fontVariant: 'small-caps',
        textTransform: 'initial',
      },
      h3: {
        fontSize: '1.55rem',
        fontWeight: 500,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: '1.35rem',
        fontWeight: 500,
        letterSpacing: '-0.019em',
        fontVariant: 'petite-caps',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '-0.018em',
      },
      h6: {
        fontSize: '1.15rem',
        fontWeight: 700,
        letterSpacing: '-0.017em',
      },
      body1: {
        fontFamily: 'Inter var experimental',
        fontSize: '0.9rem',
        letterSpacing: '-0.021em',
      },
      body2: {
        fontSize: '0.85rem',
        letterSpacing: 0,
      },
      button: {
        fontSize: '1.2rem',
        letterSpacing: '-0.013em',
      },
      allVariants: {
        fontFamily: 'Inter var experimental',
      },
    },
  })
)
