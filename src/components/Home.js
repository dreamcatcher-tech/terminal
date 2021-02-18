import React from 'react'
import Debug from 'debug'
import { Button } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useChannel } from '../useChannel'
import { AppBar, Toolbar } from '@material-ui/core'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
const debug = Debug('terminal:widgets:Home')
const useStyles = makeStyles({
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
})

const Nav = (props) => {
  debug(`props: `, props)
  const classes = useStyles()
  const { path, cwd } = props
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null
  const { ls, subscribeLs } = useChannel(cwd)
  subscribeLs()
  const children = ls
    ? Object.keys(ls).filter((child) => child !== '.' && child !== '..')
    : []
  const navLinks = children.map((child) => ({
    title: child,
    path: '/' + child,
  }))
  const onClick = (path) => () => {
    debug(`onclick`, path)
    const command = `cd /crm/${path}\n`
    for (const c of command) {
      process.stdin.send(c)
    }
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="home">
          <Home fontSize="large" />
        </IconButton>
        <List
          component="nav"
          aria-labelledby="main navigation"
          className={classes.navDisplayFlex}
        >
          {navLinks.map(({ title, path }) => (
            <a
              key={title}
              className={classes.linkText}
              onClick={onClick(title)}
            >
              <ListItem button>
                <ListItemText primary={title} />
              </ListItem>
            </a>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  )
}

export default Nav
