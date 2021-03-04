import React from 'react'
import Debug from 'debug'
import { Button } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useChannel } from '../hooks/useChannel'
import { AppBar, Toolbar, Fab } from '@material-ui/core'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
const debug = Debug('terminal:widgets:Customers')

const Customers = (props) => {
  debug(`props: `, props)
  const { block, path, cwd } = props
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
  const isSelected = (child) => path.startsWith(cwd + '/' + child)
  const addButtonStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
  const addCustomer = () => {
    debug(`addCustomer`)
  }
  return (
    <>
      <List component="nav" aria-labelledby="customers">
        {children.map((child, index) => (
          <ListItem
            button
            key={index}
            selected={isSelected(child)}
            onClick={onClick(child)}
          >
            <ListItemText primary={child} />
          </ListItem>
        ))}
      </List>
      <Fab color="primary" style={addButtonStyle} onClick={addCustomer}>
        <Add />
      </Fab>
      {child}
    </>
  )
}
const _getChildren = (block) => {
  const masked = ['..', '.', '.@@io']
  return block.network
    .getAliases()
    .filter((alias) => !masked.includes(alias) && !alias.startsWith('.'))
}
export default Customers
