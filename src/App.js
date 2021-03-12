import React from 'react'
import './App.css'
import debugFactory from 'debug'
import Terminal from './Terminal'
import DUI from './DUI'
import { useNavigation } from './hooks/useNavigation'

debugFactory.enable(`*met* dos* *shell *Customer* *Settings`)

function App() {
  useNavigation()
  return (
    <>
      <Terminal path="/" style={{ height: '30vh', backgroundColor: 'black' }} />
      <DUI />
    </>
  )
}

export default App
