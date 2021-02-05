import React from 'react'
import './App.css'
import debugFactory from 'debug'
import Terminal from './Terminal'
import DUI from './DUI'
import { useNavigation } from './useNavigation'

debugFactory.enable(`*metro* dos* *useBlockchain *Blockchain `)

function App() {
  useNavigation()
  return (
    <>
      <Terminal path="/" style={{ height: '50vh', backgroundColor: 'black' }} />
      <DUI />
    </>
  )
}

export default App
