import React, { Fragment, useContext } from 'react'
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
import Typography from '@mui/material/Typography'

import CribIcon from '@mui/icons-material/Crib'
import GroupsIcon from '@mui/icons-material/Groups'
import FactoryIcon from '@mui/icons-material/Factory'
import Fade from '@mui/material/Fade'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HeightIcon from '@mui/icons-material/Height'
import InfoIcon from '@mui/icons-material/Info'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import PersonIcon from '@mui/icons-material/Person'
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone'
import PublicIcon from '@mui/icons-material/Public'
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import RocketLaunchTwoToneIcon from '@mui/icons-material/RocketLaunchTwoTone'
import ScaleIcon from '@mui/icons-material/Scale'
import Skeleton from '@mui/material/Skeleton'
import SpeedIcon from '@mui/icons-material/Speed'
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty'
import WcIcon from '@mui/icons-material/Wc'

import { red } from '@mui/material/colors'

import Service from '../api/service'
import { getIdFromEndpoint } from '../api/utils'

import { LocalDataContext } from '../providers/LocalDataProvider'

import DataType from '../types/DataType'
import IPeopleData from '../types/IPeopleData'
import IPlanetsData from '../types/IPlanetsData'
import IStarshipsData from '../types/IStarshipsData'
import ItemDataType from '../types/ItemDataType'

const CardContentChips = function (props: { chips: Array<{ icon: any, label: string }> }): JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 4 }}>
      {props.chips.map((chip, c) => (
        <Chip
          key={c}
          sx={{ padding: '6px', textTransform: 'capitalize' }}
          icon={chip.icon}
          label={chip.label}
        />
      ))}
    </Box>
  )
}

const ListItemLink = function (props: { type: DataType, id: string }): JSX.Element {
  const navigate = useNavigate()

  const { data, isSuccess } = useQuery(
    [props.type, props.id],
    async () => await Service.get(props.type, props.id),
    { keepPreviousData: true, staleTime: 600000 }
  )

  return (
    <Link
      sx={{ cursor: 'pointer', padding: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      onClick={() => navigate(`/${props.type}/${props.id}`)}
    >
      {isSuccess ? data.name : <Skeleton variant="text" animation="wave" width={210}/>}
    </Link>
  )
}

const CardContentList = function (props: { items: Array<{ type: DataType, icon: any, ids: string[] }> }): JSX.Element {
  return (
    <>
      {props.items.some(item => item.ids?.length > 0) && (
        <List sx={{ bgcolor: 'background.paper', padding: '4px 0', width: '100%' }}>
          {props.items.map((item, i) => item.ids?.length > 0 && (
            <Fragment key={i}>
              {i > 0 && props.items[i - 1]?.ids.length > 0 && <Divider sx={{ margin: '4px 0 6px' }}/>}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{item.icon}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.type}
                  secondary={(
                    <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                      {item.ids?.map((id: string, i: number) => (
                        <ListItemLink key={i} type={item.type} id={id}/>
                      ))}
                    </Box>
                  )}
                />
              </ListItem>
            </Fragment>
          ))}
        </List>
      )}
    </>
  )
}

function Bio (props: { type: DataType }): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()

  const { addFavourite, isFavourite, removeFavourite } = useContext(LocalDataContext)

  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery(
    [props.type, params[`${props.type}Id`]],
    async () => await Service.get(props.type, params[`${props.type}Id`]),
    { keepPreviousData: true, staleTime: 600000 }
  )

  const favourite = isFavourite(props.type, params[`${props.type}Id`])

  function toggleFavourite (favourite: boolean, favouriteData: ItemDataType): void {
    if (favourite) {
      removeFavourite(props.type, favouriteData.id)
    } else {
      addFavourite(props.type, favouriteData)
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
        <Fade in={!isLoading}>
          <Card sx={{ alignSelf: 'start', width: '100%' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ width: 66, height: 66 }} variant="square">
                  {props.type === DataType.people && <PersonTwoToneIcon sx={{ width: 60, height: 60 }}/>}
                  {props.type === DataType.planets && <PublicTwoToneIcon sx={{ width: 60, height: 60 }}/>}
                  {props.type === DataType.starships && <RocketLaunchTwoToneIcon sx={{ width: 60, height: 60 }}/>}
                </Avatar>
              }
              title={<Typography variant="h5">{data.name}</Typography>}
            />
            <CardContent>
              {props.type === DataType.people && (
                <>
                  <CardContentChips
                    chips={[
                      { icon: <WcIcon/>, label: (data as IPeopleData).gender },
                      { icon: <HeightIcon/>, label: (data as IPeopleData).height },
                      { icon: <ScaleIcon/>, label: (data as IPeopleData).mass },
                      { icon: <CribIcon/>, label: (data as IPeopleData).birth_year }
                    ]}
                  />
                  <CardContentList
                    items={[
                      {
                        type: DataType.planets,
                        icon: <PublicIcon/>,
                        ids: [getIdFromEndpoint(data.homeworld)]
                      },
                      {
                        type: DataType.starships,
                        icon: <RocketLaunchIcon/>,
                        ids: data.starships?.map((starship: string) => getIdFromEndpoint(starship))
                      }
                    ]}
                  />
                </>
              )}
              {props.type === DataType.planets && (
                <>
                  <CardContentChips
                    chips={[
                      { icon: <GroupsIcon/>, label: (data as IPlanetsData).population },
                      {
                        icon: <ThreeSixtyIcon/>,
                        label: `${(data as IPlanetsData).rotation_period}h / ${(data as IPlanetsData).orbital_period}d`
                      }
                    ]}
                  />
                  <CardContentList
                    items={[
                      {
                        type: DataType.people,
                        icon: <GroupsIcon/>,
                        ids: data.residents?.map((resident: string) => getIdFromEndpoint(resident))
                      }
                    ]}
                  />
                </>
              )}
              {props.type === DataType.starships && (
                <>
                  <CardContentChips
                    chips={[
                      { icon: <InfoIcon/>, label: (data as IStarshipsData).starship_class },
                      { icon: <FactoryIcon/>, label: (data as IStarshipsData).manufacturer },
                      { icon: <SpeedIcon/>, label: (data as IStarshipsData).max_atmosphering_speed },
                      { icon: <LocalAtmIcon/>, label: (data as IStarshipsData).cost_in_credits }
                    ]}
                  />
                  <CardContentList
                    items={[
                      {
                        type: DataType.people,
                        icon: <PersonIcon/>,
                        ids: data.pilots?.map((pilot: string) => getIdFromEndpoint(pilot))
                      }
                    ]}
                  />
                </>
              )}
            </CardContent>
            <CardActions>
              <IconButton
                sx={{ marginLeft: 'auto' }}
                size="large"
                aria-label={`${favourite ? 'remove' : 'add'} favorite`}
                onClick={() => toggleFavourite(favourite, { ...data, id: params[`${props.type}Id`] })}
              >
                <FavoriteIcon sx={{ color: favourite ? red[500] : 'inherit' }}/>
              </IconButton>
            </CardActions>
          </Card>
        </Fade>
      )}
    </section>
  )
}

export default Bio
