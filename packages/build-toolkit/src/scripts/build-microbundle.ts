#! /usr/bin/env node
'use strict'

/**
 * Microbundle docs - https://tinyurl.com/qw86j8j
 */
import {spawn} from 'child_process'
import path from 'path'
const args = process.argv.slice(2)

const child = spawn(path.resolve(__dirname, '../../node_modules/.bin/microbundle'), ['build'].concat(args), {
  stdio: 'inherit',
})
child.on('exit', (code: number, signal: string) => {
  if (signal) {
    if (signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      )
    } else if (signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      )
      process.exit(1)
    }
  } else {
    console.log('child process exited with ' + `code ${code} and signal ${signal}`)
    process.exit(code || undefined)
  }
})
child.on('error', (err: Error) => {
  console.error(err)
  process.exit(1)
})
