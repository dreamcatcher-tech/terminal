import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import debugFactory from 'debug'
import Terminal from './Terminal'
import { useBlockchain } from './useBlockchain'

const debug = debugFactory(`shell:App`)
debugFactory.enable(`*metro* dos-shell*`)

function App() {
  const [chainState, blockchain] = useBlockchain()

  if (!blockchain) {
    return <h1>Initializing Blockchain</h1>
  }
  debug(`app render`)

  return (
    <div>
      <Terminal style={{ height: '100vh', backgroundColor: 'black' }} />
    </div>
  )

  return (
    <Router basename="/calendar">
      <Link to="/today" />
      <Link to="/tomorrow" />
    </Router>
  )
}

export default App
