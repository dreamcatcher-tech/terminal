import assert from 'assert'
import { useState, useEffect } from 'react'
import { useBlockchain } from './useBlockchain'
import Debug from 'debug'
// TODO use lightheight to know if should get state
// TODO detect state and child changes just from the interblock hashes
const debug = Debug(`terminal:useChannel`)
export const useChannel = (channelPath) => {
  const { blockchain, latest } = useBlockchain()

  const [ls, setLs] = useState()
  const [state, setState] = useState()
  const [height, setHeight] = useState()
  const [pendingLs, setPendingLs] = useState()
  const [watchingAll, subscribeAll] = useState()
  const [watchingLs, setWatchingLs] = useState()
  const [watchingState, subscribeState] = useState()
  const [previousBlock, setPreviousBlock] = useState()
  if (previousBlock !== latest) {
    setPreviousBlock(latest)
  }

  useEffect(() => {
    let active = true
    const lsState = async () => {
      debug(`useChannel`, channelPath, latest.getHeight())

      if (channelPath === '/') {
        debug(`shell is never displayed as a channel`)
        return
      }
      const channel = getChannel(channelPath, latest)
      assert(channel, `No channel found for: ${channelPath}`)
      if (height === channel.heavyHeight) {
        debug(`no change`)
        return
      }
      if (latest.getHeight() > 50) {
        throw new Error(`Infinite loop`)
      }

      debug(`channel: `, channel)
      setHeight(channel.heavyHeight)

      if (watchingLs) {
        debug(`watching ls`)
        if (!hasLs(channel) && !pendingLs) {
          debug(`no ls`)
          setPendingLs(true)
          blockchain.ls(channelPath).then(({ children }) => {
            if (!active) {
              debug(`command returned after unmount`)
            }
            setLs(children) && setPendingLs()
          })
        }
      }
      if (watchingState) {
        debug(`watching state`)
      }

      // const awaitLs = blockchain
      //   .ls(cwd)
      //   .then(({ children }) => setChildren(children))
      // const awaitState = blockchain
      //   .cat(cwd)
      //   .then(({ state }) => setState(state))
      // await Promise.all([awaitLs, awaitState])
    }
    lsState()
    return () => {
      // cleanup somehow ?
      const baseHeight = latest.getHeight()
      debug(
        `cleanup requested at height: ${height} from latest: ${baseHeight} for: ${channelPath}`
      )
      active = false
    }
  }, [blockchain, latest, watchingLs, watchingState])
  const subscribeLs = () => {
    if (!watchingLs) {
      setWatchingLs(true)
    }
  }
  return { state, ls, height, subscribeAll, subscribeLs, subscribeState }
}
const hasLs = (channel) =>
  Object.keys(channel.requests).some((action) => action.type === '@@LS')

const getChannel = (channelPath, latest) => {
  assert(channelPath !== '/')
  assert(channelPath.startsWith('/'))
  const directChild = channelPath.substring(1)
  return latest.network[directChild]
}
