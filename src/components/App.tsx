import React, { CSSProperties, useRef, useState } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SearchIcon from '@mui/icons-material/Search'

import theme from '../styles/theme'

import PeopleList from './PeopleList'
import PeopleBio from './PeopleBio'

function App (): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const getNavLinkStyle = (isActive: boolean): CSSProperties => ({ color: isActive ? 'white' : theme.palette.primary.main })

  return (
    <ThemeProvider theme={theme}>
      <header>
        <Typography sx={{ fontWeight: 'bold', mr: 3, whiteSpace: 'nowrap' }} color="primary" variant="h1">
          SW Wiki
        </Typography>
        <Paper sx={{ p: '0 .5rem 0 1rem', mr: 1, display: 'flex', alignItems: 'center' }}>
          <InputBase
            sx={{ flex: 1 }}
            inputRef={inputRef}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            sx={{ ml: 1, visibility: searchTerm !== '' ? 'visible' : 'hidden' }}
            type="button"
            size="small"
            aria-label="clear"
            onClick={() => {
              setSearchTerm('')
              inputRef.current?.focus()
            }}
          >
            <CloseIcon sx={{ width: '16px', height: '16px' }}/>
          </IconButton>
        </Paper>
        <IconButton type="button" aria-label="search">
          <SearchIcon/>
        </IconButton>
        <Tooltip title="My favourites">
          <IconButton sx={{ ml: 'auto' }} aria-label="add to favorites">
            <FavoriteIcon sx={{ color: theme.palette.primary.main, width: '30px', height: '30px' }}/>
          </IconButton>
        </Tooltip>
      </header>
      <main>
        <nav>
          <NavLink to={'/people'} end style={({ isActive }) => getNavLinkStyle(isActive)}>
            People
          </NavLink>
          <NavLink to={'/planets'} end style={({ isActive }) => getNavLinkStyle(isActive)}>
            Planets
          </NavLink>
          <NavLink to={'/starships'} end style={({ isActive }) => getNavLinkStyle(isActive)}>
            Starships
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/people" replace/>}/>
          <Route path="/people" element={<PeopleList/>}/>
          <Route path="/people/:peopleId" element={<PeopleBio/>}/>
          <Route path="*" element={<section>Nothing here!</section>}/>
        </Routes>
      </main>
      <footer>
        <Link href="https://github.com/rubencanovaca" target="_blank">@rubencanovaca</Link>
        {new Date().getFullYear()}
      </footer>
      <CssBaseline/>
    </ThemeProvider>
  )
}

export default App
