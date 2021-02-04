import { useState } from 'react'
import { useBlockchain } from './useBlockchain'
import debugFactory from 'debug'

const debug = debugFactory(`terminal:useNavigation`)
export const useNavigation = () => {
  // TODO make urls drive the blockchain, as well as blockchain drive urls
  const [blockchainState, blockchain] = useBlockchain()
  const [popstate, setPopstate] = useState()
  window.onpopstate = ({ state }) => {
    const { wd } = state
    debug(`popstate wd: `, wd)
    debug(`blockchain wd: `, blockchain.getContext().wd)
    // TODO store the current terminal contents, delete back to the prompt
    const command = `cd ${wd}\n`
    for (const c of command) {
      process.stdin.send(c)
    }
    // TODO restore the existing terminal text

    setPopstate(wd)
  }
  if (!blockchainState || !blockchainState.state.context) {
    return
  }

  const { wd } = blockchain.getContext()
  if (window.location.pathname !== wd) {
    debug(`window.history.pushState: `, wd)
    if (!popstate) {
      debug(`command was not from history`)
      window.history.pushState({ wd }, '', wd)
      window.history.replaceState({ wd }, '', wd)
      document.title = wd
    } else {
      debug(`command was from history`)
    }
  } else {
    if (popstate) {
      setPopstate()
    }
  }
}
