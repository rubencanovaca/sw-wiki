import React, { createContext, useState } from 'react'

import DataType from '../types/DataType'
import IPage from '../types/IPage'
import IPeopleData from '../types/IPeopleData'
import IPlanetsData from '../types/IPlanetsData'
import IStarshipsData from '../types/IStarshipsData'
import ItemDataType from '../types/ItemDataType'

interface IFavouritesData {
  people: IPeopleData[]
  planets: IPlanetsData[]
  starships: IStarshipsData[]
}

interface ILocalDataContextProps {
  page: IPage
  setPage: (page: IPage) => void
  showFavourites: boolean
  setShowFavourites: (show: boolean) => void
  favourites: IFavouritesData
  addFavourite: (type: DataType, favourite: ItemDataType) => void
  isFavourite: (type: DataType, id?: string) => boolean
  removeFavourite: (type: DataType, id?: string) => void
}

interface ILocalDataProviderProps {
  children?: any
}

export const LocalDataContext = createContext<ILocalDataContextProps>({
  page: {
    people: { list: 1, search: 1 },
    planets: { list: 1, search: 1 },
    starships: { list: 1, search: 1 }
  },
  setPage: () => {},
  showFavourites: false,
  setShowFavourites: () => {},
  favourites: { people: [], planets: [], starships: [] },
  addFavourite: () => {},
  isFavourite: () => false,
  removeFavourite: () => {}
})

export function LocalDataProvider (props: ILocalDataProviderProps): JSX.Element {
  const [page, setPage] = useState<IPage>({
    people: { list: 1, search: 1 },
    planets: { list: 1, search: 1 },
    starships: { list: 1, search: 1 }
  })
  const [showFavourites, setShowFavourites] = useState<boolean>(false)
  const [favourites, setFavourites] = useState<IFavouritesData>({ people: [], planets: [], starships: [] })

  function addFavourite (type: DataType, favourite: ItemDataType): void {
    setFavourites({ ...favourites, [type]: [...favourites[type], favourite] })
  }

  function isFavourite (type: DataType, id?: string): boolean {
    const index = favourites[type].findIndex(f => f.id === id)
    return index > -1
  }

  function removeFavourite (type: DataType, id?: string): void {
    const index = favourites[type].findIndex(f => f.id === id)
    setFavourites({ ...favourites, [type]: [...favourites[type].slice(0, index), ...favourites[type].slice(index + 1)] })
  }

  return (
    <LocalDataContext.Provider
      value={{
        page,
        setPage,
        showFavourites,
        setShowFavourites,
        favourites,
        addFavourite,
        isFavourite,
        removeFavourite
      }}
    >
      {props.children}
    </LocalDataContext.Provider>
  )
}
