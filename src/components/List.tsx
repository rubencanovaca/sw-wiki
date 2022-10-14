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
import GroupsIcon from '@mui/icons-material/Groups'
import HeightIcon from '@mui/icons-material/Height'
import InfoIcon from '@mui/icons-material/Info'
import ScaleIcon from '@mui/icons-material/Scale'
import SpeedIcon from '@mui/icons-material/Speed'
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty'
import WcIcon from '@mui/icons-material/Wc'

import { red } from '@mui/material/colors'

import Service from '../api/service'
import { getIdFromEndpoint } from '../api/utils'

import { LocalDataContext } from '../providers/LocalDataProvider'

import DataType from '../types/DataType'
import ItemDataType from '../types/ItemDataType'
import IPeopleData from '../types/IPeopleData'
import IPlanetsData from '../types/IPlanetsData'
import IStarshipsData from '../types/IStarshipsData'

const CardContentChips = function (props: { chips: Array<{ icon: any, label: string }> }): JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {props.chips.map((chip, c) => (
        <Chip
          key={c}
          sx={{ maxWidth: '160px', padding: '2px', textTransform: 'capitalize' }}
          size="small"
          icon={chip.icon}
          label={chip.label}
        />
      ))}
    </Box>
  )
}

function List (props: { type: DataType }): JSX.Element {
  const navigate = useNavigate()

  const {
    page,
    setPage,
    showFavourites,
    favourites,
    addFavourite,
    isFavourite,
    removeFavourite
  } = useContext(LocalDataContext)
  const currentPage = page[props.type]

  const [items, setItems] = useState<ItemDataType[]>([])

  const { data, error, isError, isLoading, isFetching, isSuccess } = useQuery(
    [props.type, currentPage],
    async () => await Service.getAll(props.type, currentPage),
    { keepPreviousData: true, staleTime: 600000 }
  )

  useEffect(() => {
    if (showFavourites) {
      setItems(favourites[props.type])
    } else if (typeof data !== 'undefined' && data.results.length > 0) {
      setItems(data.results)
    }
  }, [data, favourites, showFavourites])

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
          <Link sx={{ marginLeft: 'auto' }} onClick={() => navigate(0)}>Reload</Link>
        </Alert>
      )}
      {isSuccess && items.length > 0 && (
        <>
          <Grid container spacing={3}>
            {items.map((item: ItemDataType, i: number) => {
              const id = getIdFromEndpoint(item.url)
              const favourite = isFavourite(props.type, id)
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
                      title={<Typography variant="h6">{item.name}</Typography>}
                    />
                    <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
                      {props.type === DataType.people && (
                        <CardContentChips
                          chips={[
                            { icon: <WcIcon/>, label: (item as IPeopleData).gender },
                            { icon: <HeightIcon/>, label: (item as IPeopleData).height },
                            { icon: <ScaleIcon/>, label: (item as IPeopleData).mass }
                          ]}
                        />
                      )}
                      {props.type === DataType.planets && (
                        <CardContentChips
                          chips={[
                            { icon: <GroupsIcon/>, label: (item as IPlanetsData).population },
                            {
                              icon: <ThreeSixtyIcon/>,
                              label: `${(item as IPlanetsData).rotation_period}h /${(item as IPlanetsData).orbital_period}d`
                            }
                          ]}
                        />
                      )}
                      {props.type === DataType.starships && (
                        <CardContentChips
                          chips={[
                            { icon: <InfoIcon/>, label: (item as IStarshipsData).starship_class },
                            { icon: <SpeedIcon/>, label: (item as IStarshipsData).max_atmosphering_speed }
                          ]}
                        />
                      )}
                    </CardContent>
                    <CardActions sx={{ margin: '0 4px' }}>
                      <Button
                        sx={{ marginRight: 'auto' }}
                        size="small"
                        onClick={() => navigate(`/${props.type}/${id}`)}
                      >
                        See more
                      </Button>
                      <IconButton
                        aria-label={`${favourite ? 'remove' : 'add'} favorite`}
                        onClick={() => toggleFavourite(favourite, { ...item, id })}
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
                <Button
                  sx={{ width: '100px' }}
                  disabled={data.previous === null}
                  onClick={() => setPage({ ...page, [props.type]: currentPage - 1 })}
                >
                  Prev Page
                </Button>
                <Button
                  sx={{ width: '100px' }}
                  disabled={data.next === null}
                  onClick={() => setPage({ ...page, [props.type]: currentPage + 1 })}
                >
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

export default List
