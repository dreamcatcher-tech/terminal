/**
 * A default component that renders if nothing specified for the object.
 * Renders itself as a list of children, then renders the selected child indented.
 */
import React, { useEffect, useState } from 'react'
import { useBlockchain } from '../useBlockchain'
import { useChannel } from '../useChannel'
import Debug from 'debug'
import ReactJson from 'react-json-view'
import assert from 'assert'
import { getNextPath } from '../utils'

const debug = Debug('terminal:Explorer')
const Explorer = (props) => {
  const { path, cwd = '/', widgets = {} } = props
  debug(`path: `, path)
  const { blockchain, latest } = useBlockchain()

  const { state, ls, subscribeLs } = useChannel(cwd)
  subscribeLs()

  const Component = getChildComponent(cwd, widgets)
  if (Component) {
    return <Component path={path} cwd={cwd} widgets={widgets} />
  }
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null
  return <div>{child}</div>

  // let renderedState = <div>no state</div>
  // if (state) {
  //   renderedState = <ReactJson src={state} name={'state'} collapsed />
  // }
  // let renderedChildren = <div>no children</div>
  // if (children) {
  //   renderedChildren = <ReactJson src={children} name={'children'} collapsed />
  // }
  // let renderedChild
  // if (nextPath) {
  //   renderedChild = <Explorer path={path} cwd={nextPath} />
  // }
  // return (
  //   <div style={{ borderColor: 'red' }}>
  //     <pre>Explorer path: {path}</pre>
  //     <pre>Cwd: {cwd}</pre>
  //     {renderedState}
  //     {renderedChildren}
  //     {renderedChild}
  //   </div>
  // )
}
const getChildComponent = (cwd, widgets) => {
  // if datum, use the jscon-schema-form
  // if collection, use the standard collection
  // else return Explorer as the standard component
  // OR always start with / since guaranteed to be first
  if (widgets[cwd]) {
    debug(`widget found for ${cwd}`)
    return widgets[cwd]
  }
  debug(`no widget found for ${cwd} - using Explorer`)
  return
}

export default Explorer
