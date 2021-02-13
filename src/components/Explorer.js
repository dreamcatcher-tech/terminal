/**
 * A default component that renders if nothing specified for the object.
 * Renders itself as a list of children, then renders the selected child indented.
 */
import React, { useEffect, useState } from 'react'
import { useBlockchain } from '../useBlockchain'
import Debug from 'debug'
import ReactJson from 'react-json-view'
import assert from 'assert'
const debug = Debug('terminal:Explorer')

const Explorer = ({ path, cwd = '/' }) => {
  debug(`path: `, path)
  const { blockchain, latest } = useBlockchain()
  const [children, setChildren] = useState()
  const [state, setState] = useState()
  const nextPath = _getNextPath(path, cwd)
  const [cwdHeight, setCwdHeight] = useState()
  // TODO make a useChannel() function to subscribe to a particular channel
  // this can be used by multiple channel callers, to unify their interactions with channels
  // can allow functions like requesting state and ls, managing subscriptions to those things
  useEffect(() => {
    const lsState = async () => {
      debug(`effect`, cwd, latest.getHeight())
      // do not rerequest if already issued ls
      // check the blockchain state is the same still

      // if we do not have an outstanding ls & state request, make one
      const height = latest.getHeight()
      if (height === cwdHeight) {
        return
      }
      setCwdHeight(height)
      const channel = getChannel(cwd, latest)

      const awaitLs = blockchain
        .ls(cwd)
        .then(({ children }) => setChildren(children))
      const awaitState = blockchain
        .cat(cwd)
        .then(({ state }) => setState(state))
      await Promise.all([awaitLs, awaitState])

      // any time the height of / has increased, recheck everything
      assert(channel, `No channel found for ${cwd}`)
      const { heavyHeight } = channel //TODO use lightheight but do not overload
      if (heavyHeight > cwdHeight) {
        // send ls command if hasn't been sent already ?
      }

      // const children = cwd === '/' ? blockchain : blockchain.getChildren()[cwd]
      // assert(children[cwd], `No cwd chain found for ${cwd}`)
      // blockchain.subscribe( () => {

      //   debug(`new block`)
      // })
    }
    lsState()
    return () => {
      // cleanup somehow ?
      debug(`cleanup ?`)
    }
  }, [blockchain, cwd, latest])
  let renderedState = <div>no state</div>
  if (state) {
    renderedState = <ReactJson src={state} name={'state'} collapsed />
  }
  let renderedChildren = <div>no children</div>
  if (children) {
    renderedChildren = <ReactJson src={children} name={'children'} collapsed />
  }
  let renderedChild
  if (nextPath) {
    renderedChild = <Explorer path={path} cwd={nextPath} />
  }
  return (
    <div style={{ borderColor: 'red' }}>
      <pre>Explorer path: {path}</pre>
      <pre>Cwd: {cwd}</pre>
      {renderedState}
      {renderedChildren}
      {renderedChild}
    </div>
  )
}
const getChannel = (cwd, latest) => {
  if (cwd === '/') {
    return latest
  }
  assert(cwd.startsWith('/'))
  assert(cwd.length > 1)
  const directChild = cwd.substring(1)
  return latest.getChannels()[directChild]
}
const _getNextPath = (path, cwd) => {
  const segments = _getPathSegments(path)
  assert(segments.includes(cwd), `invalid cwd: ${cwd}`)
  while (segments[0] !== cwd) {
    segments.shift()
  }
  segments.shift()
  const nextPath = segments.shift()
  debug(`nextPath`, nextPath)
  return nextPath
}
const _getPathSegments = (alias) => {
  if (alias === '/') {
    return ['/']
  }
  let prefix = ''
  const splits = alias.split('/').filter((seg) => !!seg)
  splits.unshift('/')
  const paths = splits.map((segment) => {
    prefix && prefix !== '/' && (prefix += '/') // TODO make child naming convention avoid this check ?
    prefix += segment
    return prefix
  })
  return paths
}
export default Explorer
