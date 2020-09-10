import assert from 'assert'
import { useEffect, useState, useRef } from 'react'
import { effectorFactory } from '@dreamcatcher-tech/interblock'
const debug = require('debug')('useBlockchain')
const shell = require('@dreamcatcher-tech/dos')

const blockchains = new Map()

export const useBlockchain = (identifier = 'default', gateways = []) => {
  assert.equal(typeof identifier, 'string')
  if (typeof gateways === 'string') {
    gateways = [gateways]
  }
  assert(Array.isArray(gateways))

  const [state, setState] = useState()
  const blockchainRef = useRef()

  useEffect(() => {
    const subscribe = async () => {
      if (blockchainRef.current) {
        return
      }
      if (!blockchains.has(identifier)) {
        debug(`initializing blockchain: ${identifier}`)
        const blockchainPromise = effectorFactory()
        blockchains.set(identifier, blockchainPromise)
        const emptyArgs = []
        shell(emptyArgs, { blockchain: blockchainPromise })
      }
      const blockchain = await blockchains.get(identifier)
      blockchainRef.current = blockchain
      setState(blockchain.getState())
      blockchain.subscribe(() => {
        setState(blockchain.getState())
      })
    }
    subscribe()

    return () => {
      debug(`TODO shutting down shell`)
    }
  }, [identifier])
  const blockchain = blockchainRef.current
  return [state, blockchain]
}
