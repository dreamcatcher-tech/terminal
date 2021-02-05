import React from 'react'
import { useBlockchain } from './useBlockchain'
import debugFactory from 'debug'
const debug = debugFactory('terminal:DUI')
/** DYNAMIC UI
 * Walk the full path from the wd and build up the ui by these layers.
 * Use the dpkg to know that we should pull in all staticly defined chains.
 *
 *
 */

const DUI = () => {
  const { context, state, blockchain } = useBlockchain()
  debug(`render`, context, state)

  if (!context) {
    return <div>Blockchain loading....</div>
  }
  const { wd } = context

  return <div>hwllow</div>
}
export default DUI
