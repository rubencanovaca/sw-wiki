import React from 'react'

function Highlight (props: { text: string, search: string }): JSX.Element {
  if (props.text === undefined || props.search === '') return <>{props.text}</>
  const style = 'color: black; background-color: yellow; font-weight: bold; opacity: .5; padding: 0 2px;'
  const regExp = new RegExp(`(${props.search})`, 'ig')
  const highlightedSearch = props.text
    .replace(regExp, (match) => `<span style="${style}">${match}</span>`)
  return <span dangerouslySetInnerHTML={{ __html: highlightedSearch }}/>
}

export default Highlight
