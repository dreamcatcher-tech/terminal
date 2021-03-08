import React from 'react'
import './App.css'
import debugFactory from 'debug'
import Terminal from './Terminal'
import DUI from './DUI'
import { useNavigation } from './hooks/useNavigation'

debugFactory.enable(
  `terminal:cli *met* dos*  *DUI *Explorer *shell *Home *useBlockstream *Customers *Settings`
)

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
