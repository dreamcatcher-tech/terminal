import React from 'react'
import Debug from 'debug'
import { Button } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useChannel } from '../hooks/useChannel'
import { useBlockstream } from '../hooks/useBlockstream'
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
  const { block, path, cwd } = props
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  // TODO let Explorer figure out the nextProps on its own
  const child = nextPath ? <Explorer {...nextProps} /> : null

  const children = getChildren(block)
  debug(`aliases: `, children)
  const navLinks = children.map((child) => ({
    title: child,
    path: '/' + child,
  }))
  const onClick = (child) => () => {
    debug(`onclick`, child)
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
  return (
    <>
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
      {child}
    </>
  )
}
const getChildren = (block) => {
  const masked = ['..', '.', '.@@io']
  return block.network.getAliases().filter((alias) => !masked.includes(alias))
}
export default Nav
