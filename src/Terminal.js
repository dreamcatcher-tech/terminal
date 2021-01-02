import assert from 'assert'
import React, { useEffect, useRef } from 'react'
import debugFactory from 'debug'
import { useBlockchain } from './useBlockchain'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import 'xterm/css/xterm.css'

const mockStdin = require('mock-stdin').stdin

const debug = debugFactory(`terminal`)

const getMockStdin = () => {
  const previousStdin = process.stdin
  mockStdin()
  const { stdin } = process
  Object.defineProperty(process, 'stdin', {
    value: previousStdin,
    writable: true,
  })
  return stdin
}

const convertToStdStream = (terminal) => {
  debug(`toStdStream`)
  const stdin = getMockStdin()
  terminal.stdin = stdin
  terminal.isTTY = true
  const clearLineCode = '\u001b[2K'
  terminal.clearLine = () => terminal.write(clearLineCode)
  terminal.cursorTo = (x, y) => {
    debug(`cursorTo: `, x, y)
    assert.strictEqual(x, 0)
    const leftByOneThousandChars = '\u001b[1000D'
    terminal.write(leftByOneThousandChars)
  }
}

const TerminalContainer = (props) => {
  const xtermRef = useRef()

  useEffect(() => {
    debug(`opening terminal`)
    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'underline',
      convertEol: true,
      rendererType: 'dom', // required for TorBrowser
      fontFamily: ['Courier New', 'Firefox Emoji'],
    })
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(document.getElementById('xterm-container'))
    fitAddon.fit()
    terminal.focus()
    convertToStdStream(terminal)
    terminal.attachCustomKeyEventHandler((event) => {
      const { key, type } = event
      if (ignoreKeys.includes(key)) {
        debug(`ignoring: ${key}`)
        return false
      }
    })
    terminal.onKey(({ key, domEvent }) => {
      terminal.stdin.send(key)
    })
    xtermRef.current = terminal
    window.addEventListener('resize', () => fitAddon.fit())
    process.stdout = terminal
    process.stdin = terminal.stdin
    process.stderr = terminal
  }, [])

  const [, blockchain] = useBlockchain()

  //   useEffect(() => {
  //     // TODO pass in std* for isolation ?
  //     const emptyArgs = []
  //     shell(emptyArgs, { blockchain })
  //   }, [])

  return <div id="xterm-container" {...props}></div>
}

const ignoreKeys = 'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12'.split(' ')

export default TerminalContainer
