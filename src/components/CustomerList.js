import React from 'react'
import Debug from 'debug'
import { Button } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useBlockchain } from '../hooks/useBlockchain'
import { AppBar, Toolbar, Fab } from '@material-ui/core'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
import { FixedSizeList } from 'react-window'
import { AutoSizer } from 'react-virtualized'

const debug = Debug('terminal:widgets:Customers')

const CustomerList = (props) => {
  debug(`props: `, props)
  const { block, path, cwd } = props
  const { blockchain } = useBlockchain()
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null
  const children = _getChildren(block)
  debug(`children`, children)
  const onClick = (child) => () => {
    debug(`onclick`, child, cwd)
    const nextPath = cwd + '/' + child
    if (path === nextPath) {
      debug(`no change to ${path}`)
      return
    }
    const command = `cd ${nextPath}\n`
    for (const c of command) {
      process.stdin.send(c)
    }
  }
  const onAddCustomer = () => {
    debug(`addCustomer`)
    // show a modal UI over the top to get the data we need

    const command = `./add --isTestData\n`
    for (const c of command) {
      process.stdin.send(c)
    }
    // TODO disable the button or show an animation while it is busy
  }
  const isSelected = (child) => path.startsWith(cwd + '/' + child)
  const addButtonStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
  const renderRow = ({ index, style }) => (
    <ListItem
      button
      key={index}
      selected={isSelected(children[index])}
      onClick={onClick(children[index])}
      style={style}
    >
      <ListItemText primary={children[index]} />
    </ListItem>
  )
  return (
    <div style={{ flex: '1' }}>
      <AutoSizer>
        {({ height, width }) => {
          debug(`height: %s width: %s`, height, width)
          return (
            <FixedSizeList
              aria-labelledby="customers"
              height={height - 1}
              width={width}
              itemSize={46}
              itemCount={children.length}
            >
              {renderRow}
            </FixedSizeList>
          )
        }}
      </AutoSizer>
      <Fab color="primary" style={addButtonStyle} onClick={onAddCustomer}>
        <Add />
      </Fab>
      {child}
    </div>
  )
}
const _getChildren = (block) => {
  const masked = ['..', '.', '.@@io']
  return block.network
    .getAliases()
    .filter((alias) => !masked.includes(alias) && !alias.startsWith('.'))
}
export default CustomerList
