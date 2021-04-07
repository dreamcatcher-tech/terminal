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
import OpenDialog from './OpenDialog'
import Datum from './Datum'
const debug = Debug('terminal:widgets:Customer')

const Customer = (props) => {
  const { block, path, cwd } = props
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null
  // TODO assert that this is a datum, and that it is formatted correctly ?

  const { title } = block.state.schema
  const { custNo, name } = block.state.formData

  return (
    <OpenDialog title={`${title}: ${name} (${custNo})`}>
      <Datum block={block} />
    </OpenDialog>
  )
}

export default Customer
