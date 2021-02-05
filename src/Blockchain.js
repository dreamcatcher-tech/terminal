import React, { useState, useEffect } from 'react'
import { effectorFactory } from '@dreamcatcher-tech/interblock'
import commandLineShell from '@dreamcatcher-tech/dos'
import debugFactory from 'debug'
const debug = debugFactory('terminal:Blockchain')

export const BlockchainContext = React.createContext(null)
BlockchainContext.displayName = 'Blockchain'

function Blockchain({
  identifier = 'terminal',
  context: higherContext,
  children,
}) {
  const [state, setState] = useState()
  const [context, setContext] = useState()
  const [blockchain, setBlockchain] = useState()

  useEffect(() => {
    const subscribe = async () => {
      debug(`initializing blockchain: ${identifier}`)
      const blockchain = await effectorFactory()
      setBlockchain(blockchain)
      const emptyArgs = []
      commandLineShell(emptyArgs, { blockchain })
      debug(`subscribing to blockchain`)
      blockchain.subscribe(() => {
        const blockchainState = blockchain.getState()
        setState(blockchainState)
        if (blockchainState.state.context) {
          debug(`setting context`, blockchainState.state.context)
          setContext(blockchainState.state.context)
        }
      })
    }
    subscribe()
  }, [])

  const Context = higherContext || BlockchainContext
  const contextValue = { blockchain, state, context }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Blockchain
