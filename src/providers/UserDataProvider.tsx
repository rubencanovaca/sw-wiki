import React, { createContext, useState } from 'react'

import { DataType } from '../types/DataType'
import IPeopleData from '../types/IPeopleData'
import IPlanetsData from '../types/IPlanetsData'
import IStarshipsData from '../types/IStarshipsData'

interface IFavourites {
  people: IPeopleData[]
  planets: IPlanetsData[]
  starships: IStarshipsData[]
}

interface IUserDataContextProps {
  showFavourites: boolean
  setShowFavourites: (show: boolean) => void
  favourites: IFavourites
  addFavourite: (type: DataType, favourite: IPeopleData | IPlanetsData | IStarshipsData) => void
  isFavourite: (type: DataType, id?: string) => boolean
  removeFavourite: (type: DataType, id?: string) => void
}

interface IUserDataProviderProps {
  children?: any
}

export const UserDataContext = createContext<IUserDataContextProps>({
  showFavourites: false,
  setShowFavourites: () => {
  },
  favourites: { people: [], planets: [], starships: [] },
  addFavourite: () => {
  },
  isFavourite: () => false,
  removeFavourite: () => {
  }
})

export function UserDataProvider (props: IUserDataProviderProps): JSX.Element {
  const [showFavourites, setShowFavourites] = useState<boolean>(false)
  const [favourites, setFavourites] = useState<IFavourites>({ people: [], planets: [], starships: [] })

  function addFavourite (type: DataType, favourite: IPeopleData | IPlanetsData | IStarshipsData): void {
    setFavourites({ ...favourites, [type]: [...favourites.people, favourite] })
  }

  function isFavourite (type: DataType, id?: string): boolean {
    const favouriteIndex = favourites[type].findIndex(f => f.id === id)
    return favouriteIndex > -1
  }

  function removeFavourite (type: DataType, id?: string): void {
    setFavourites({ ...favourites, [type]: favourites.people.filter(f => f.id !== id) })
  }

  return (
    <UserDataContext.Provider
      value={{
        showFavourites,
        setShowFavourites,
        favourites,
        addFavourite,
        isFavourite,
        removeFavourite
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  )
}
