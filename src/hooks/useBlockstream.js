/**
 * Used to subscribe directly to the blocks of a given chain.
 * Contrasts to useChannel which offers a lightweight view into a chain
 * for reading limited data, and sending actions in.
 * useBlockstream pulls in the entire block, and fires every time a new block is created.
 * Uses the binary layer to access these blocks.
 * Uses the same underlying methods that the stdengine would apply if the same
 * commands were called from inside a chain.
 *
 * If there is no path or we have no permissions, it returns `undefined` and
 * continues to try.
 */
import assert from 'assert'
import { useState, useEffect } from 'react'
import { useBlockchain } from './useBlockchain'
import Debug from 'debug'
const debug = Debug(`terminal:useBlockstream`)

export const useBlockstream = (chainId, slice) => {
  // slice is some subpath in the state that we are interested in
  // TODO if we do not have permission to access block, throw an error

  // register a subscription with the block producer
  // when subscription is notified, pull the latest version from the producer
  // update the state we are tracking
  // goal is to have on hand the latest possible block of a particular path

  const { blockchain } = useBlockchain()
  const [block, setBlock] = useState()
  useEffect(() => {
    const short = chainId.substring(0, 9)
    debug(`subscribe %s`, short)
    const unsubscribe = blockchain.subscribeBlockstream(
      chainId,
      (nextBlock) => {
        assert(!block || block.isNext(nextBlock))
        debug(`setting block`, short, nextBlock.getHeight())
        setBlock(nextBlock)
      }
    )
    return () => {
      debug(`teardown`, short)
      unsubscribe()
    }
  }, [blockchain, chainId, slice])
  return block
}
