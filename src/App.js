import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import debugFactory from 'debug'
import Terminal from './Terminal'

const debug = debugFactory(`shell:App`)
debugFactory.enable(`*metro* dos*`)

function App() {
  return <Terminal style={{ height: '100vh', backgroundColor: 'black' }} />

  return (
    <Router basename="/calendar">
      <Link to="/today" />
      <Link to="/tomorrow" />
    </Router>
  )
}

export default App
