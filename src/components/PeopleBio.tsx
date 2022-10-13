import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import PersonIcon from '@mui/icons-material/Person'
import Typography from '@mui/material/Typography'

import CribIcon from '@mui/icons-material/Crib'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HeightIcon from '@mui/icons-material/Height'
import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ScaleIcon from '@mui/icons-material/Scale'
import WcIcon from '@mui/icons-material/Wc'

import { red } from '@mui/material/colors'

import PeopleService from '../api/services/people'
import IPeopleData from '../api/types/IPeopleData'

import { UserDataContext } from '../providers/UserDataProvider'
import { getIdFromEndpoint } from '../api/utils'

function PeopleBio (): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()

  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery(
    ['people', params.peopleId],
    async () => await PeopleService.get(params.peopleId),
    { keepPreviousData: true, staleTime: 600000 }
  )

  const { addFavourite, isFavourite, removeFavourite } = useContext(UserDataContext)

  const favourite = isFavourite('people', params.peopleId)

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
      {isSuccess && (
        <Card sx={{ alignSelf: 'start', width: '100%' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ width: 66, height: 66 }} variant="square">
                <PersonIcon sx={{ width: 60, height: 60 }}/>
              </Avatar>
            }
            title={<Typography variant="h4">{data.name}</Typography>}
          />
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 4 }}>
              <Chip sx={{ padding: '6px' }} icon={<WcIcon/>} label={data.gender}/>
              <Chip sx={{ padding: '6px' }} icon={<HeightIcon/>} label={data.height}/>
              <Chip sx={{ padding: '6px' }} icon={<ScaleIcon/>} label={data.mass}/>
              <Chip sx={{ padding: '6px' }} icon={<CribIcon/>} label={data.birth_year}/>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <PublicIcon/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Homeworld"
                  secondary={(
                    <Link
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/planets/${getIdFromEndpoint(data.homeworld)}`)}
                    >
                      {`/planets/${getIdFromEndpoint(data.homeworld)}`}
                    </Link>
                  )}
                />
              </ListItem>
              {data.starships.length > 0 && (
                <>
                  <Divider sx={{ margin: '6px 0' }}/>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <RocketLaunchIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Starships"
                      secondary={(
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {data.starships.map((starship: string, i: number) => (
                            <Link
                              key={i}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => navigate(`/starships/${getIdFromEndpoint(starship)}`)}
                            >
                              {`/starships/${getIdFromEndpoint(starship)}`}
                            </Link>
                          ))}
                        </Box>
                      )}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </CardContent>
          <CardActions>
            <IconButton
              sx={{ marginLeft: 'auto' }}
              size="large"
              aria-label={`${favourite ? 'remove' : 'add'} favorite`}
              onClick={() => toggleFavourite(favourite, { ...data, id: params.peopleId })}
            >
              <FavoriteIcon sx={{ color: favourite ? red[500] : 'inherit' }}/>
            </IconButton>
          </CardActions>
        </Card>
      )}
    </section>
  )
}

export default PeopleBio
