import Portal from '@material-ui/core/Portal'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import Debug from 'debug'
import { Button, DialogActions } from '@material-ui/core'
import Explorer from './Explorer'
import { getNextPath } from '../utils'
import { useChannel } from '../hooks/useChannel'
import { AppBar, Toolbar } from '@material-ui/core'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
const debug = Debug('terminal:widgets:Customer')

const useStyles = makeStyles({
  root: {
    position: 'absolute',
  },
  backdrop: {
    position: 'absolute',
  },
})

const Customer = (props) => {
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
  const onClose = () => {
    const command = `cd ..\n`
    for (const c of command) {
      process.stdin.send(c)
    }
  }

  const classes = useStyles()
  const container = document.getElementById('DUI')
  const isTerminalFocused = !container.contains(document.activeElement)
  return (
    <Dialog
      container={container}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open
      BackdropProps={{
        classes: { root: classes.backdrop },
      }}
      style={{ position: 'absolute' }}
      disableEnforceFocus // TODO if terminal is showing, do not force
      disableRestoreFocus={isTerminalFocused}
      disableAutoFocus={isTerminalFocused}
    >
      <DialogTitle id="simple-dialog-title">Customer {cwd}</DialogTitle>
      <DialogContent>
        {children.map((child, index) => {
          return <div key={index}>{child}</div>
        })}
        // show all the panels, with their individual edit files
      </DialogContent>
      {/* <DialogActions>
        <Button autoFocus color="primary">
          Cancel
        </Button>
        <Button color="primary">Ok</Button>
      </DialogActions> */}
    </Dialog>
  )
}
const _getChildren = (block) => {
  const masked = ['..', '.', '.@@io']
  return block.network
    .getAliases()
    .filter((alias) => !masked.includes(alias) && !alias.startsWith('.'))
}
export default Customer
