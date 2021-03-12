import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Form from '@rjsf/material-ui'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Toolbar,
  IconButton,
  AppBar,
  Grid,
  Paper,
} from '@material-ui/core'
import { Home, Edit, Cancel, Save } from '@material-ui/icons'
import { useBlockchain } from '../hooks/useBlockchain'
import Debug from 'debug'
const debug = Debug('terminal:widgets:Datum')

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: { maxWidth: 345 },
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
}))

const Datum = ({ block }) => {
  const { state } = block
  const { schema, formData: storedFormData } = state
  const { title, ...noTitleSchema } = schema
  const [liveFormData, setLiveFormData] = useState(storedFormData)
  const { isPending } = useBlockchain()
  const onBlur = (...args) => {
    debug(`onBlur: `, ...args)
  }
  const setDatum = (formData) => {
    const string = JSON.stringify(formData)
    debug(`setDatum`, string)
    // show an enquiring modal UI over the top to get the data we need

    const command = `./set --formData ${string}\n`
    for (const c of command) {
      process.stdin.send(c)
    }
  }
  const onChange = ({ formData }) => {
    debug(`onChange: `, formData)
    setLiveFormData(formData)
    // if any booleans changed, then apply the changes immediately

    // ? what is the action to call on the blockchain ?
    setDatum(formData)
  }
  const classes = useStyles()
  return (
    <Grid container spacing={3}>
      <Grid item>
        <Card className={classes.card} raised={true}>
          <CardHeader
            title="Name"
            action={
              <>
                <IconButton aria-label="edit">
                  <Save color="primary" />
                </IconButton>
                <IconButton aria-label="edit">
                  <Cancel color="secondary" />
                </IconButton>
              </>
            }
          />

          <CardContent>
            <Form
              disabled={true}
              schema={noTitleSchema}
              formData={liveFormData}
              children
              onBlur={onBlur}
              onChange={onChange}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card className={classes.card}>
          <CardHeader
            title="Address"
            action={
              <IconButton aria-label="edit">
                <Edit color="primary" />
              </IconButton>
            }
          />
          <CardContent>
            <Form
              disabled={isPending}
              schema={noTitleSchema}
              formData={liveFormData}
              children
              onBlur={onBlur}
              onChange={onChange}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Datum
