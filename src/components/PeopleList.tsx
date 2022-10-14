import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import HeightIcon from '@mui/icons-material/Height'
import ScaleIcon from '@mui/icons-material/Scale'
import WcIcon from '@mui/icons-material/Wc'

import { red } from '@mui/material/colors'

import PeopleService from '../api/services'
import { getIdFromEndpoint } from '../api/utils'

import IPeopleData from '../types/IPeopleData'

import { LocalDataContext } from '../providers/LocalDataProvider'

function PeopleList (): JSX.Element {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [items, setItems] = useState<IPeopleData[]>([])

  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery(
    ['people', page],
    async () => await PeopleService.getPeople(page),
    { keepPreviousData: true, staleTime: 600000 }
  )

  const { showFavourites, favourites, addFavourite, isFavourite, removeFavourite } = useContext(LocalDataContext)

  useEffect(() => {
    if (showFavourites) {
      setItems(favourites.people)
    } else if (typeof data !== 'undefined' && data.results.length > 0) {
      setItems(data.results)
    }
  }, [data, favourites, showFavourites])

  function toggleFavourite (favourite: boolean, favouriteData: IPeopleData): void {
    if (favourite) {
      removeFavourite('people', favouriteData.id)
    } else {
      addFavourite('people', favouriteData)
    }
  }

  return (
    <section>
      {(isLoading || isFetching) && (
        <Backdrop sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress color="inherit"/>
        </Backdrop>
      )}
      {isError && (
        <Alert sx={{ width: '100%' }} severity="error">
          Error: {(error as Error).message}
          <Link sx={{ marginLeft: 2 }} onClick={() => navigate(0)}>Reload</Link>
        </Alert>
      )}
      {isSuccess && items.length > 0 && (
        <>
          <Grid container spacing={3}>
            {items.map((p: IPeopleData, i: number) => {
              const id = getIdFromEndpoint(p.url)
              const favourite = isFavourite('people', id)
              return (
                <Grid
                  item
                  key={i}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                >
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ width: 46, height: 46 }} variant="square">
                          <PersonIcon sx={{ width: 40, height: 40 }}/>
                        </Avatar>
                      }
                      title={<Typography variant="h6">{p.name}</Typography>}
                    />
                    <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip sx={{ padding: '2px' }} size="small" icon={<WcIcon/>} label={p.gender}/>
                        <Chip sx={{ padding: '2px' }} size="small" icon={<HeightIcon/>} label={p.height}/>
                        <Chip sx={{ padding: '2px' }} size="small" icon={<ScaleIcon/>} label={p.mass}/>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ margin: '0 4px' }}>
                      <Button
                        sx={{ marginRight: 'auto' }}
                        size="small"
                        onClick={() => navigate(`/people/${id}`)}
                      >
                        See more
                      </Button>
                      <IconButton
                        aria-label={`${favourite ? 'remove' : 'add'} favorite`}
                        onClick={() => toggleFavourite(favourite, { ...p, id })}
                      >
                        <FavoriteIcon sx={{ color: favourite ? red[500] : 'inherit' }}/>
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
          <nav>
            {!showFavourites && (data.previous !== null || data.next !== null) && (
              <ButtonGroup variant="outlined" size="small">
                <Button sx={{ width: '100px' }} disabled={data.previous === null} onClick={() => setPage(page - 1)}>
                  Prev Page
                </Button>
                <Button sx={{ width: '100px' }} disabled={data.next === null} onClick={() => setPage(page + 1)}>
                  Next Page
                </Button>
              </ButtonGroup>
            )}
          </nav>
        </>
      )}
      {isSuccess && items.length === 0 && 'Nothing here!'}
    </section>
  )
}

export default PeopleList
