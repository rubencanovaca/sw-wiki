import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Link } from '@mui/material'

import theme from '../styles/theme'
import './App.css'

function App (): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div className="app">
        <header>SW Wiki</header>
        <main/>
        <footer>
          <Link href="https://github.com/rubencanovaca" target="_blank">@rubencanovaca</Link>
          {new Date().getFullYear()}
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
