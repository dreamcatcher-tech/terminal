import React from 'react'
import Debug from 'debug'
import { Button } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useChannel } from '../hooks/useChannel'
import { AppBar, Toolbar } from '@material-ui/core'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
const debug = Debug('terminal:widgets:Home')

const Customers = (props) => {
  debug(`props: `, props)
  const { path, cwd } = props
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null
  const { ls, subscribeLs } = useChannel(cwd)
  subscribeLs()
  const children = ls
    ? Object.keys(ls).filter((child) => child !== '.' && child !== '..')
    : []

  return (
    <List component="nav" aria-labelledby="customers">
      {children.map()}
      <ListItem button>
        <ListItemText primary={'meow'} />
      </ListItem>
    </List>
  )
}

export default Customers
