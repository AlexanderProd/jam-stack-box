import React from 'react'
import styled from '@emotion/styled'
import { render } from 'react-dom'

const Hello = styled.h1`
  color: blue;
`

const App = () => {
  return (
    <div>
      <Hello>Hello Parcel</Hello>
    </div>
  )
}

render(<App />, document.getElementById('app'))
