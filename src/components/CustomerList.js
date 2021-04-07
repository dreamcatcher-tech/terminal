import React, { PureComponent, useState, useRef } from 'react'
import calculateSize from 'calculate-size'
import { XGrid } from '@material-ui/x-grid'
import assert from 'assert'
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
import { useBlockstream } from '../hooks/useBlockstream'

import { LicenseInfo } from '@material-ui/x-grid'
LicenseInfo.setLicenseKey(
  '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE='
)

const debug = Debug('terminal:widgets:Customers')

const CustomerList = (props) => {
  const { block, path, cwd } = props // TODO verify this is a Collection
  const { blockchain, isPending } = useBlockchain()
  const columnsRef = useRef()
  const nextPath = getNextPath(path, cwd)
  const nextProps = { ...props, cwd: nextPath }
  const child = nextPath ? <Explorer {...nextProps} /> : null

  const onAddCustomer = async () => {
    assert(!isPending, `Cannot add customers simultaneously`)
    debug(`addCustomer`)
    // show an enquiring modal UI over the top to get the data we need

    const command = `./add --isTestData\n`
    for (const c of command) {
      process.stdin.send(c)
    }
    const newCustomer = await isPending
    // how to learn what customer just got added ?
    const cd = `cd /crm/customers/bob`
  }
  const addButtonStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }

  const { datumTemplate } = block.state
  const columns = columnsRef.current || []
  const rows = []
  if (datumTemplate && !columnsRef.current) {
    columnsRef.current = columns
    // TODO get nested children columns out, hiding all but top level
    const { properties } = datumTemplate.schema
    for (const key in properties) {
      let { title = key, description = '' } = properties[key]
      description = description || title
      const valueGetter = (params) => {
        const { row, id, field } = params
        console.log(row, id, field)

        // need to unmap the field to the nested child
        // need to cache all the blocks so fetching them is very cheap
      }
      const width = calculateSize(title, { font: 'Arial' })
      columns.push({
        field: key,
        headerName: title,
        description,
        valueGetter,
        flex: title.length,
      })
    }
  }
  const children = _getChildren(block)
  if (children.length === 2) {
    // debugger
  }
  for (const child of children) {
    rows.push({ id: rows.length })
  }
  const onClick = ({ id }) => {
    const child = children[id]
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

  return (
    <div style={{ flex: '1' }}>
      <XGrid
        columns={columns}
        rows={rows}
        loading={!datumTemplate}
        disableMultipleSelection
        onRowClick={onClick}
        hideFooter
      />
      {/* <AutoSizer>
        {({ height, width }) => {
          // debug(`height: %s width: %s`, height, width)
          return (
            <FixedSizeList
              aria-labelledby="customers"
              height={height - 1}
              width={width}
              itemSize={46}
              itemCount={children.length}
            >
              {rowRendererFactory(props)}
            </FixedSizeList>
          )
        }}
      </AutoSizer> */}
      <Fab
        color="primary"
        style={addButtonStyle}
        onClick={onAddCustomer}
        disabled={isPending}
      >
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
const rowRendererFactory = ({ block, path, cwd }) => {
  const children = _getChildren(block)
  const isSelected = (child) => path.startsWith(cwd + '/' + child)
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
  return ({ index, style }) => {
    const alias = children[index]
    const rowPath = cwd + '/' + alias
    const block = useBlockstream(rowPath)
    let rowText = alias
    if (block && block.state.formData) {
      // TODO check if this is a datum
      // TODO draw the columns based on the schema, with local prefs stored for the user
      const { state } = block
      const { custNo, name, email } = state.formData
      if (typeof custNo === 'number') {
        rowText = `${custNo} ${name} ${email}`
      }
    }
    return (
      <ListItem
        button
        key={index}
        selected={isSelected(children[index])}
        onClick={onClick(children[index])}
        style={style}
      >
        <ListItemText primary={rowText} />
      </ListItem>
    )
  }
}

export default CustomerList
