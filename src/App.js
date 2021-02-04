import { Router, useLocation, useNavigate } from '@reach/router'
import React from 'react'
import './App.css'
import debugFactory from 'debug'
import Terminal from './Terminal'

const debug = debugFactory(`shell:App`)
debugFactory.enable(`*metro* dos* *useNavigation`)

function App() {
  return (
    <Terminal path="/" style={{ height: '50vh', backgroundColor: 'black' }} />
  )
}

export default App
