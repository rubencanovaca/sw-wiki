import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      }
    }
  }
})
