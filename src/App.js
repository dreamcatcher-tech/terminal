import React from 'react'
import './App.css'
import Debug from 'debug'
// import DUI from './DUI'
import { useNavigation, Terminal } from 'webdos'
const debug = Debug('terminal:App')
Debug.enable(`*Customer* *Settings *Datum`)
debug(`App loaded`)
function App() {
  // useNavigation()
  return (
    <>
      <Terminal path="/" style={{ height: '30vh', backgroundColor: 'black' }} />
      {/* <DUI /> */}
    </>
  )
}

export default App
