import React from 'react'
import { useParams } from 'react-router-dom'

function PeopleBio (): JSX.Element {
  const params = useParams()

  return (
    <section>Character {params.peopleId}</section>
  )
}

export default PeopleBio
