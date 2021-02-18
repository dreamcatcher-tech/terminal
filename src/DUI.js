import React from 'react'
import { useBlockchain } from './useBlockchain'
import Debug from 'debug'
import Explorer from './components/Explorer'
import Home from './components/Home'
const debug = Debug('terminal:DUI')
/** DYNAMIC UI
 * Walk the full path from the wd and build up the ui by these layers.
 * Use the dpkg to know that we should pull in all staticly defined chains.
 *
 * Render placeholders while children may still be pulling in data.
 * Dispatch all requests in parallel.
 * Do not request if already have a request outstanding, or if no changes have occured since last reqest
 * Render as far down the tree as we can at any given moment.
 */

const DUI = () => {
  const { context } = useBlockchain()
  if (!context) {
    return <h3>Blockchain loading....</h3>
  }
  const { wd } = context
  // fetch all segments state
  // map segment widgetUi to either a default component if schema, or to customUi component
  // ? how to get the children in when we do not have them resolved yet ?
  // make a render manager component which handled effects for each level, so can fetch more

  const widgets = {
    '/crm': Home,
  }

  return <Explorer path={wd} widgets={widgets} />
}

export default DUI
