import Portal from '@material-ui/core/Portal'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import Debug from 'debug'
import { Button, DialogActions } from '@material-ui/core'
import Explorer from './Explorer'
import { makeStyles } from '@material-ui/core'
const debug = Debug('terminal:widgets:OpenDialog')

const useStyles = makeStyles({
  root: {
    position: 'absolute',
  },
  backdrop: {
    position: 'absolute',
  },
})
const OpenDialog = ({ title, children }) => {
  const classes = useStyles()
  const container = document.getElementById('DUI')
  const isTerminalFocused = !container.contains(document.activeElement)
  const onClose = () => {
    // TODO halt the user if blockchain is enquiring still
    const command = `cd ..\n`
    for (const c of command) {
      process.stdin.send(c)
    }
  }
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
      // TODO if terminal is showing, do not grab focus
      disableEnforceFocus
      disableRestoreFocus={isTerminalFocused}
      disableAutoFocus={isTerminalFocused}
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {/* <DialogActions>
            <Button autoFocus color="primary">
              Cancel
            </Button>
            <Button color="primary">Ok</Button>
          </DialogActions> */}
    </Dialog>
  )
}

export default OpenDialog
