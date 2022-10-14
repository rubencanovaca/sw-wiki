import { createTheme } from '@mui/material/styles'

enum Breakpoint {
  xs = 0,
  sm = 600,
  md = 900,
  lg = 1200,
  xl = 1800
}

const getMediaQueryCSSValues = (property: string, value: [string, string?, string?, string?, string?]): any => {
  const mediaQueryCSSValues: any = {
    [property]: value[0]
  }
  if (value[1] !== '') {
    mediaQueryCSSValues[`@media (min-width: ${Breakpoint.sm}px) and (max-width: ${Breakpoint.md - 1}px)`] = { [property]: value[1] }
  }
  if (value[2] !== '') {
    mediaQueryCSSValues[`@media (min-width: ${Breakpoint.md}px) and (max-width: ${Breakpoint.lg - 1}px)`] = { [property]: value[2] }
  }
  if (value[3] !== '') {
    mediaQueryCSSValues[`@media (min-width: ${Breakpoint.lg}px) and (max-width: ${Breakpoint.xl - 1}px)`] = { [property]: value[3] }
  }
  if (value[4] !== '') {
    mediaQueryCSSValues[`@media (min-width: ${Breakpoint.xl}px)`] = { [property]: value[4] }
  }
  return mediaQueryCSSValues
}

export default createTheme({
  breakpoints: {
    values: {
      xs: Breakpoint.xs,
      sm: Breakpoint.sm,
      md: Breakpoint.md,
      lg: Breakpoint.lg,
      xl: Breakpoint.xl
    }
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        message: {
          display: 'flex',
          width: '100%'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: getMediaQueryCSSValues('fontSize', ['.8rem', '1rem', '1.25rem', '1.5rem', '2rem'])
      }
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
        }
      }
    }
  },
  palette: {
    mode: 'dark'
  },
  typography: {
    h1: getMediaQueryCSSValues('fontSize', ['1.5rem', '1.75rem', '2rem', '2.5rem', '3rem'])
  }
})
