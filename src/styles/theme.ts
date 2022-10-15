import { createTheme } from '@mui/material/styles'

enum Breakpoint {
  xs = 0,
  sm = 600,
  md = 900,
  lg = 1200,
  xl = 1800
}

const getMediaQueryCSSValues = (property: string, value: [string, string?, string?, string?, string?]): any => {
  const breakpoints: number[] = Object.keys(Breakpoint).reduce((acc: any[], curr, index, arr) => {
    if (index < arr.length / 2) acc.push(parseInt(curr))
    return acc
  }, [])
  const mediaQueryCSSValues: any = {
    [property]: value[0]
  }
  value.forEach((val, v) => {
    const currenBreakpoint = breakpoints[v]
    if (v > 0 && v < value.length - 1) {
      const nextBreakpoint = breakpoints[v + 1]
      mediaQueryCSSValues[`@media (min-width: ${currenBreakpoint}px) and (max-width: ${nextBreakpoint - 1}px)`] = { [property]: val }
    } else if (v === value.length - 1) {
      mediaQueryCSSValues[`@media (min-width: ${currenBreakpoint}px)`] = { [property]: val }
    }
  })
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
        root: getMediaQueryCSSValues('fontSize', ['.8rem', '1rem'])
      }
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          textTransform: 'capitalize'
        }
      }
    }
  },
  palette: {
    mode: 'dark'
  },
  typography: {
    h1: getMediaQueryCSSValues('fontSize', ['1.5rem', '2rem'])
  }
})
