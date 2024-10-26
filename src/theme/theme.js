import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    text: {
      primary: 'rgb(26,30,35)',
    },
  },
  typography: {
    step: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: 'red' },
      },
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          step: 'div',
        },
      },
      styleOverrides: {
        h1: {
          fontSize: '2.25rem',
          lineHeight: 1.2,
          fontWeight: 600,
        },
        h2: {
          fontSize: '1.625rem',
          lineHeight: 1.5,
          letterSpacing: '0.1px',
          fontWeight: 600,
        },
      },
    },
  },
})

export default theme
